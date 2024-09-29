import {
  PATIENT_ADD_MEDICATION_ROUTE,
  PATIENT_CONFIRM_MEDICATION_ROUTE,
  PATIENT_REMOVE_MEDICATION_ROUTE,
  PATIENT_UPDATE_MEDICATION_ROUTE,
} from '@core/config/api';
import { patientInstance } from '@core/lib/axios';

interface AddMedicationParams {
  name: string;
  dosage: string;
  frequency?: string;
  drugbank_id?: string;
  price_range?: string;
}

export const addMedication = (params: AddMedicationParams[]) => {
  return patientInstance.post(PATIENT_ADD_MEDICATION_ROUTE, params);
};

export const confirmMedication = (medicationId: string) => {
  return patientInstance.put(`${PATIENT_CONFIRM_MEDICATION_ROUTE}?medication_id=${medicationId}`);
};

export const removeMedication = (medicationId: string) => {
  return patientInstance.put(`${PATIENT_REMOVE_MEDICATION_ROUTE}?medication_id=${medicationId}`);
};

interface UpdateMedicationParams {
  medicationId: string;
  updates: Partial<{
    frequency: string;
    price_range: string;
  }>;
}

export const updateMedication = (params: UpdateMedicationParams) => {
  return patientInstance.put(
    `${PATIENT_UPDATE_MEDICATION_ROUTE}?medication_id=${params.medicationId}`,
    params.updates
  );
};
