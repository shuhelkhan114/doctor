import { Doctor } from '@typings/model/doctor';
import { HealthIssue } from '@typings/model/healthIssue';
import { Medication } from '@typings/model/medication';

export interface DoctorLoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface Patient {
  id: string;
  email: string;
  email_verified: boolean;
  primary_doctor_id: string;
  stream_chat_token: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  firebase_id: string;
  phone_number: string;
  linked_my_chart: boolean;
  patient_image: string;
  patient_image_resized: {
    image_url: string;
  }[];
  job_id: string;
  created_at: string;
  updated_at: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  // Custom Field
  fhirId: string;
  medications: Medication[];
  health_issues: HealthIssue[];
  doctors: Doctor[];
  requests: PatientRequest[];
  current_plan: 'BASIC' | 'UNLIMITED';
  on_free_trial: boolean;
}

export interface PatientRequest {
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
  doctor: Doctor;
}

export interface PatientSignUpResponse {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  linked_my_chart: boolean;
  date_of_birth: string;
  job_id: string;
  firebase_id: string;
  stream_chat_token: string;
  patient_image: any;
  id: string;
  created_at: string;
  updated_at: string;
}
