import { doctorInstance } from '@core/lib/axios';
import { Doctor } from '@typings/model/doctor';
import { Patient } from '@typings/patient';

const baseRoute = '/inapp-notifications';

export interface Notification {
  medications: Medications;
  requests: Request[];
  doctors_notes: DoctorsNotes;
  total_count: number;
}

export interface Medications {
  [key: string]: {
    first_name: string;
    last_name: string;
    patient_image: string;
    patient_image_resized: PatientImageResized[];
    id: string;
    medication_count_changes: number;
  };
}

export interface PatientImageResized {
  image_url: string;
  dimmensions: Dimmensions;
}

export interface Dimmensions {
  width: number;
  height: number;
}

export interface Request {
  id: string;
  description: string;
  status: string;
  notification_type: string;
  notification_for: string;
  doctor_id: string;
  patient_id: string;
  health_issue_id: any;
  medication_id: any;
  doctor_note_id: any;
  request_id: string;
  job_id: any;
  created_at: string;
  updated_at: string;
  request: Request2;
  medication: any;
  patient: Patient;
  doctor: Doctor;
  referrer: Doctor;
  doctor_note: any;
}

export interface Request2 {
  id: string;
  patient_id: string;
  doctor_id: string;
  referred_by: any;
  referred_note: any;
  status: string;
  job_id: string;
  created_at: string;
  deleted_at: any;
  updated_at: string;
}

export interface DoctorsNotes {
  [key: string]: {
    first_name: string;
    last_name: string;
    patient_image: string;
    patient_image_resized: PatientImageResized[];
    id: string;
    general_note_changes_count: number;
    health_issues_note_changes_count: number;
  };
}

export const getAllNotifications = () => {
  return doctorInstance.get<Notification>(baseRoute);
};
