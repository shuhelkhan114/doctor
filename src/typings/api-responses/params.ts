export interface PatientSignUpParams {
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  password: string;
  linked_my_chart: boolean;
  patient_image: string;
  gender: string;
  device_tokens?: string[];
}

export interface DoctorSignUpParams {
  first_name: string;
  last_name: string;
  email: string;
  doximity_id: string;
  doximity_secret: string;
  speciality: string;
  doctor_image: string;
  device_tokens?: string[];
}
