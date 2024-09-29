import { PATIENT_PROFILE_ROUTE, PATIENT_VERIFY_EMAIL_ROUTE } from '@core/config/api';
import { patientInstance } from '@core/lib/axios';
import { PatientSignUpParams } from '@typings/api-responses/params';
import { Patient, PatientSignUpResponse } from '@typings/api-responses/responses';

export const patientSignUp = async (params: PatientSignUpParams) => {
  return patientInstance.post<PatientSignUpResponse>(PATIENT_PROFILE_ROUTE, params);
};

export const getPatientProfile = async () => {
  return patientInstance.get<Patient>('/patients/profile');
};

interface UpdateProfileParams {
  address: string | null;
  apartment: string | null;
  primary_doctor_id: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  date_of_birth: string;
  patient_image: string;
  on_free_trial: boolean;
  current_plan: 'BASIC' | 'UNLIMITED';
  device_tokens: string[];
}

export const updateProfile = async (params: Partial<UpdateProfileParams>) => {
  return patientInstance.put(PATIENT_PROFILE_ROUTE, params);
};

interface UploadImageResponse {
  image_url: string;
}

export const uploadImage = async (imageFile: string) => {
  const formData = new FormData();
  formData.append('file', {
    // @ts-ignore
    uri: imageFile,
    name: imageFile.split('/').reverse()[0],
    type: 'image/jpg',
  });
  return patientInstance.post<UploadImageResponse>('/upload/patient/image', formData);
};

export const verifyEmail = async () => {
  return patientInstance.put(PATIENT_VERIFY_EMAIL_ROUTE);
};
