import { asyncStorageKeys } from '@core/config/asyncStorage';
import toast from '@core/lib/toast';
import API from '@core/services';
import { ArticleAbout, ConfigHealthIssue, MedicationFrequecny } from '@core/services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Patient } from '@typings/api-responses/responses';
import { UserRole } from '@typings/common';
import { Doctor } from '@typings/model/doctor';
import { PURGE } from 'redux-persist';

interface InitialState {
  emailVerified: boolean;
  verifyingEmail: boolean;
  emailVerificationFailed: boolean;
  loggedIn: boolean;
  role: UserRole;
  doctor: Doctor | null;
  patient: Patient | null;
  invitedBy?: string;
  fetchingProfile: boolean;
  refetchingProfile: boolean;
  errorRefetchingProfile: boolean;
  errorFetchingProfile: boolean;
  patientOnBoardingDone: boolean;
  doctorTourDone: boolean;
  doctorNPINumberAsked?: boolean;
  fetchingConfig: boolean;
  errorFetchingConfig: boolean;
  config: {
    medication_frequecny: MedicationFrequecny[];
    article_about: ArticleAbout[];
    health_issues: ConfigHealthIssue[];
    specialities: string[];
  };
}

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (_, { dispatch }) => {
  await API.patient.auth.verifyEmail();
  dispatch(fetchPatient());
  toast.success('Email verified successfully');
});
export const fetchDoctor = createAsyncThunk('auth/fetchDoctor', () =>
  API.doctor.auth.getDoctorProfile()
);
export const refetchDoctor = createAsyncThunk('auth/refetchDoctor', () =>
  API.doctor.auth.getDoctorProfile()
);
export const fetchPatient = createAsyncThunk('auth/fetchPatient', () => {
  return API.patient.auth.getPatientProfile();
});
export const refetchPatient = createAsyncThunk('auth/refetchPatient', () => {
  return API.patient.auth.getPatientProfile();
});
export const fetchAppConfig = createAsyncThunk('app/appconfig', () => API.config.fetchAppConfig());

const initialState: InitialState = {
  emailVerified: false,
  verifyingEmail: false,
  emailVerificationFailed: false,
  doctor: null as unknown as Doctor,
  patient: null as unknown as Patient,
  role: null as unknown as UserRole,
  loggedIn: false,
  fetchingProfile: false,
  refetchingProfile: false,
  errorRefetchingProfile: false,
  errorFetchingProfile: false,
  patientOnBoardingDone: false,
  doctorTourDone: false,
  doctorNPINumberAsked: false,
  invitedBy: undefined,
  fetchingConfig: false,
  errorFetchingConfig: false,
  config: {
    medication_frequecny: [],
    article_about: [],
    health_issues: [],
    specialities: [],
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state = initialState;
      return state;
    },
    updatePatient: (state, action: PayloadAction<Partial<Patient>>) => {
      // @ts-ignore
      state.patient = {
        ...state.patient,
        ...action.payload,
      };
      state.role = UserRole.Patient;
    },
    updateDoctor: (state, action: PayloadAction<Partial<Doctor>>) => {
      // @ts-ignore
      state.doctor = {
        ...state.doctor,
        ...action.payload,
      };
      state.role = UserRole.Doctor;
    },
    donePatientOnBoarding: (state) => {
      state.patientOnBoardingDone = true;
    },
    setDoctorNPINumberAsked: (state, action: PayloadAction<Partial<boolean>>) => {
      state.doctorNPINumberAsked = action.payload;
    },
    doneDoctorTour: (state) => {
      state.doctorTourDone = true;
    },
    login: (state) => {
      state.loggedIn = true;
    },
    setInvitedBy: (state, action: PayloadAction<string>) => {
      state.invitedBy = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.emailVerified = true;
        state.verifyingEmail = false;
      })
      .addCase(verifyEmail.pending, (state, action) => {
        state.verifyingEmail = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.emailVerificationFailed = true;
        state.verifyingEmail = false;
      })
      .addCase(fetchDoctor.pending, (state, action) => {
        state.fetchingProfile = true;
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.doctor = action.payload;
        state.role = UserRole.Doctor;
        state.loggedIn = true;
        state.fetchingProfile = false;
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.errorFetchingProfile = true;
        state.fetchingProfile = false;
      })
      .addCase(refetchDoctor.pending, (state, action) => {
        state.refetchingProfile = true;
      })
      .addCase(refetchDoctor.fulfilled, (state, action) => {
        state.doctor = action.payload;
        state.refetchingProfile = false;
        state.errorRefetchingProfile = false;
        state.errorFetchingProfile = false;
      })
      .addCase(refetchDoctor.rejected, (state, action) => {
        state.errorRefetchingProfile = true;
        state.refetchingProfile = false;
      })
      .addCase(fetchPatient.pending, (state, action) => {
        state.fetchingProfile = true;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.patient = action.payload;
        state.role = UserRole.Patient;
        state.loggedIn = true;
        state.fetchingProfile = false;
        state.errorFetchingProfile = false;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.errorFetchingProfile = true;
        state.fetchingProfile = false;
      })
      .addCase(refetchPatient.pending, (state, action) => {
        state.refetchingProfile = true;
      })
      .addCase(refetchPatient.fulfilled, (state, action) => {
        state.patient = action.payload;
        state.refetchingProfile = false;
        state.errorRefetchingProfile = false;
        state.errorFetchingProfile = false;
      })
      .addCase(refetchPatient.rejected, (state, action) => {
        state.errorRefetchingProfile = true;
        state.refetchingProfile = false;
      })
      .addCase(fetchAppConfig.pending, (state, action) => {
        state.fetchingConfig = true;
      })
      .addCase(fetchAppConfig.rejected, (state, action) => {
        state.errorFetchingConfig = true;
        state.fetchingConfig = false;
      })
      .addCase(fetchAppConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.fetchingConfig = false;
        state.errorFetchingConfig = false;
      })
      .addCase(PURGE, () => {
        AsyncStorage.multiRemove(Object.keys(asyncStorageKeys));
      });
  },
});

export const {
  logout,
  updatePatient,
  donePatientOnBoarding,
  login,
  doneDoctorTour,
  setInvitedBy,
  setDoctorNPINumberAsked,
} = authSlice.actions;

export default authSlice;
