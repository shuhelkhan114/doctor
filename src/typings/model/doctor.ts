import { Availability } from '@typings/common';

export interface Doctor {
  first_name: string;
  last_name: string;
  doximity_id: string;
  doximity_secret: string;
  email: string;
  speciality: string;
  job_id: string;
  personal_code: number;
  stream_chat_token: string;
  office_address: any;
  contact: any;
  chat_availibility: Availability[];
  id: string;
  chat_availibility_tz: number;
  created_at: string;
  updated_at: string;
  access_token: string;
  total_patient: number;
  total_request: number;
  doctor_image: string;
  npi: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  payment_street_address: string;
  payment_city: string;
  payment_state: string;
  payment_zipcode: string;
  venmo_payment_id: string;
  paypal_payment_id: string;
  payment_method: string;
  inapp_notifications_count: number;
  availablity: DoctorAvailability;
}

export enum DoctorAvailability {
  ACCEPTING = 'ACCEPTING',
  NOT_ACCEPTING = 'NOT_ACCEPTING',
  ONLY_VIA_REFERAL = 'ONLY_VIA_REFERAL',
}
