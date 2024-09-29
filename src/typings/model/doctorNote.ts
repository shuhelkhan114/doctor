import { Doctor } from './doctor';
import { HealthIssue } from './healthIssue';

export interface DoctorNote {
  id: string;
  description: string;
  doctor_id: string;
  health_issue_id: string;
  health_issue: HealthIssue;
  patient_id: any;
  job_id: string;
  created_at: string;
  updated_at: string;
  doctor: Doctor;
}
