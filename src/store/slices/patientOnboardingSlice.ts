import { asyncStorageKeys } from '@core/config/asyncStorage';
import API from '@core/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FHIRDoctor } from '@typings/api-responses/fhir/doctor';
import { FHIRHealthIssue } from '@typings/api-responses/fhir/healthIssue';
import { FHIRMedication } from '@typings/api-responses/fhir/medication';
import { PURGE } from 'redux-persist';

export type EntityStatus = 'undetermined' | 'confirmed' | 'rejected';

interface FHIRMedicationExtended extends FHIRMedication {
  frequency?: string;
  priceRange?: string;
  drugBankId?: string;
  status: EntityStatus;
}

interface FHIRDoctorExtended extends FHIRDoctor {
  isFHIRDoctor: boolean;
  status: EntityStatus;
}

interface FHIRHealthIssueExtended extends FHIRHealthIssue {
  status: EntityStatus;
}

interface InitialState {
  patientId: string;
  medications: {
    fetching: boolean;
    error: boolean;
    data: FHIRMedicationExtended[];
  };
  doctors: {
    fetching: boolean;
    error: boolean;
    data: FHIRDoctorExtended[];
  };
  healthIssues: {
    fetching: boolean;
    error: boolean;
    data: FHIRHealthIssueExtended[];
  };
}

export const fetchFHIRMedications = createAsyncThunk(
  'auth/fetchFHIRMedications',
  (patientId: string) => API.patient.fhir.getMedications(patientId)
);
export const fetchFHIRDoctors = createAsyncThunk(
  'auth/fetchFHIRDoctors',
  async (patientId: string) => {
    const fhirDoctors = await API.patient.fhir.getDoctors(patientId);
    const doctors: FHIRDoctorExtended[] = [];

    for await (const doctor of fhirDoctors) {
      const { doctors: foundDoctors } = await API.patient.doctor.searchDoctors({
        npi: doctor.npiNumber,
      });

      doctors.push({
        ...doctor,
        status: 'undetermined',
        isFHIRDoctor: foundDoctors.length < 1,
      });
    }

    return doctors;
  }
);
export const fetchFHIRHealthIssues = createAsyncThunk(
  'auth/fetchFHIRHealthIssues',
  (patientId: string) => API.patient.fhir.getHealthIssues(patientId)
);

const initialState: InitialState = {
  patientId: '',
  doctors: {
    fetching: false,
    error: false,
    data: [],
  },
  healthIssues: {
    fetching: false,
    error: false,
    data: [],
  },
  medications: {
    fetching: false,
    error: false,
    data: [],
  },
};

interface UpdateMedicationParams {
  id: string;
  status: EntityStatus;
  params?: {
    frequency: string;
    priceRange: string;
  };
}

interface UpdateHealthIssueParams {
  id: string;
  status: EntityStatus;
}

interface UpdateDoctorParams {
  id: string;
  status: EntityStatus;
}

const patientOnboardingSlice = createSlice({
  name: 'onboardingSlice',
  initialState,
  reducers: {
    setFHIRPatientId: (state, action: PayloadAction<string>) => {
      state.patientId = action.payload;
    },
    updateMedication: (state, action: PayloadAction<UpdateMedicationParams>) => {
      const { payload } = action;
      state.medications.data = state.medications.data.map((medication) => {
        if (medication.id === payload.id) {
          return {
            ...medication,
            status: payload.status,
            frequency: payload.params?.frequency,
            priceRange: payload.params?.priceRange,
          };
        }
        return medication;
      });
    },
    addMedication: (state, action: PayloadAction<FHIRMedicationExtended>) => {
      state.medications.data.push(action.payload);
    },
    clearMedication: (state) => {
      state.medications.data = [];
    },
    updateHealthIssue: (state, action: PayloadAction<UpdateHealthIssueParams>) => {
      const { payload } = action;
      state.healthIssues.data = state.healthIssues.data.map((healthIssue) => {
        if (healthIssue.id === payload.id) {
          return {
            ...healthIssue,
            status: payload.status,
          };
        }
        return healthIssue;
      });
    },
    addHealthIssue: (state, action: PayloadAction<FHIRHealthIssueExtended>) => {
      state.healthIssues.data.push(action.payload);
    },
    removeHealthIssue: (state, action: PayloadAction<string>) => {
      state.healthIssues.data = state.healthIssues.data.filter(
        (healthIssue) => healthIssue.id !== action.payload
      );
    },
    clearHealthIssue: (state) => {
      state.healthIssues.data = [];
    },
    updateDoctor: (state, action: PayloadAction<UpdateDoctorParams>) => {
      const { payload } = action;
      state.doctors.data = state.doctors.data.map((doctor) => {
        if (doctor.id === payload.id) {
          return {
            ...doctor,
            status: payload.status,
          };
        }
        return doctor;
      });
    },
    addDoctor: (state, action: PayloadAction<FHIRDoctorExtended>) => {
      state.doctors.data.push(action.payload);
    },
    removeDoctor: (state, action: PayloadAction<string>) => {
      state.doctors.data = state.doctors.data.filter((doctor) => doctor.id !== action.payload);
    },
    clearDoctors: (state) => {
      state.doctors.data = [];
    },
    setMedications(state, action: PayloadAction<FHIRMedicationExtended[]>) {
      state.medications.data = action.payload;
    },
    setHeathIssues(state, action: PayloadAction<any[]>) {
      state.healthIssues.data = action.payload;
    },
    setDoctors(state, action: PayloadAction<any[]>) {
      state.doctors.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFHIRMedications.pending, (state, action) => {
        state.medications.fetching = true;
        state.medications.error = false;
      })
      .addCase(fetchFHIRMedications.fulfilled, (state, action) => {
        state.medications.data = action.payload.map((medication) => ({
          ...medication,
          // Set the status to `undetermined` by default for all the medications coming from FHIR so that patient can select the status
          status: 'undetermined',
        }));
        state.medications.fetching = false;
      })
      .addCase(fetchFHIRMedications.rejected, (state, action) => {
        state.medications.error = true;
        state.medications.fetching = false;
      })
      .addCase(fetchFHIRDoctors.pending, (state, action) => {
        state.doctors.fetching = true;
        state.doctors.error = false;
      })
      .addCase(fetchFHIRDoctors.fulfilled, (state, action) => {
        state.doctors.data = action.payload;
        state.doctors.fetching = false;
      })
      .addCase(fetchFHIRDoctors.rejected, (state, action) => {
        state.doctors.error = true;
        state.doctors.fetching = false;
      })
      .addCase(fetchFHIRHealthIssues.pending, (state, action) => {
        state.healthIssues.fetching = true;
        state.healthIssues.error = false;
      })
      .addCase(fetchFHIRHealthIssues.fulfilled, (state, action) => {
        state.healthIssues.data = action.payload.map((healthIssue) => ({
          ...healthIssue,
          // Set the status to `undetermined` by default for all the health issues coming from FHIR so that patient can select the status
          status: 'undetermined',
        }));
        state.healthIssues.fetching = false;
      })
      .addCase(fetchFHIRHealthIssues.rejected, (state, action) => {
        state.healthIssues.error = true;
        state.healthIssues.fetching = false;
      })
      .addCase(PURGE, (state) => {
        AsyncStorage.multiRemove(Object.keys(asyncStorageKeys));
      });
  },
});

export const {
  setFHIRPatientId,
  updateMedication,
  addMedication,
  updateHealthIssue,
  addHealthIssue,
  removeHealthIssue,
  updateDoctor,
  addDoctor,
  removeDoctor,
  clearDoctors,
  clearHealthIssue,
  clearMedication,
  setMedications,
  setDoctors,
  setHeathIssues,
} = patientOnboardingSlice.actions;

export default patientOnboardingSlice;
