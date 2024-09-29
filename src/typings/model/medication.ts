export interface Medication {
  id: string;
  name: string;
  dosage: string;
  drugbank_id: string;
  price_range: string;
  frequency: string;
  history: History[];
  status: MedicationStatus;
  status_reason: MedicationStatusReason;
  status_updated_by: StatusUpdatedBy;
  patient_id: string;
  created_at: string;
  updated_at: string;
}

export enum MedicationStatus {
  NOT_CONFIRMED = 'NOT CONFIRMED',
  CONFIRMED = 'CONFIRMED',
  DELETED = 'DELETED',
}

export enum MedicationStatusReason {
  ADDED_BY_PATIENT = 'ADDED BY PATIENT',
  ADDED_BY_DOCTOR = 'ADDED BY DOCTOR',
  CONFIRMED_BY_DOCTOR = 'CONFIRMED BY DOCTOR',
  DELETED_BY_DOCTOR = 'DELETED BY DOCTOR',
  DELETED_BY_PATIENT = 'DELETED BY PATIENT',
}

interface History {
  status: string;
  status_reason: string;
  status_updated_by: StatusUpdatedBy;
}

export interface StatusUpdatedBy {
  id: string;
  first_name: string;
  image: string;
  last_name: string;
  timestamp: number;
  user: string;
}
