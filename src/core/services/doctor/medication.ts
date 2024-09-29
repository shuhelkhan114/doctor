import { doctorRoutes } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';

interface AddMedicationParams {
  patientId: string;
  params: {
    name: string;
    dosage: string;
    frequency: string;
    drugbank_id: string;
  };
}

export const addMedication = ({ patientId, params }: AddMedicationParams) => {
  return doctorInstance.post(`/medication?patient_id=${patientId}`, params);
};

interface ConfirmMedicationParams {
  patientId: string;
  medicationId: string;
}

export const confirmMedication = (params: ConfirmMedicationParams) => {
  const { patientId, medicationId } = params;
  return doctorInstance.put(
    doctorRoutes.medication.getConfirmMedicationRoute(patientId, medicationId)
  );
};

interface RemoveMedicationParams {
  patientId: string;
  medicationId: string;
}

export const removeMedication = (params: RemoveMedicationParams) => {
  const { patientId, medicationId } = params;
  return doctorInstance.put(
    doctorRoutes.medication.getRemoveMedicationRoute(patientId, medicationId)
  );
};

interface UpdateMedicationParams {
  patientId: string;
  medicationId: string;
  updates: Partial<{
    frequency: string;
  }>;
}

export const updateMedication = (params: UpdateMedicationParams) => {
  const { patientId, medicationId, updates } = params;
  return doctorInstance.put(
    doctorRoutes.medication.getUpdateMedicationRoute(patientId, medicationId),
    updates
  );
};
