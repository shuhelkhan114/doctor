import { PatientRequestEntity } from '@core/services/doctor/request';
import { ImageResized, SubscriptionPlan } from '@typings/common';
import { Doctor } from './doctor';
import { DoctorNote } from './doctorNote';
import { HealthIssue } from './healthIssue';
import { Medication } from './medication';

export interface PatientEntity {
  created_at: string;
  date_of_birth: string;
  email: string;
  firebase_id: string;
  first_name: string;
  id: string;
  job_id: string;
  last_name: string;
  linked_my_chart: boolean;
  patient_image: string;
  patient_image_resized: ImageResized[];
  phone_number: string;
  stream_chat_token: string;
  total_doctors: number;
  total_health_issues: number;
  total_medications: number;
  updated_at: string;
  patient_request: PatientRequestEntity;
  health_issues: HealthIssue[];
  medications: Medication[];
  doctors: Doctor[];
  general_notes: DoctorNote[];
  request_exist: boolean;
  current_plan: SubscriptionPlan;
}
