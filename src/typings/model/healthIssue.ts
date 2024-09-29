import { DoctorNote } from './doctorNote';

export interface HealthIssue {
  id: string;
  name: string;
  severity: string;
  description: string;
  patient_id: string;
  job_id?: string;
  created_at: string;
  updated_at: string;
  status: string;
  doctor_notes: DoctorNote[];
}
