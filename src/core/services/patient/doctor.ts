import { PATIENT_DOCTOR_REMOVE_ROUTE, PATIENT_SEARCH_DOCTOR_ROUTE } from '@core/config/api';
import { patientInstance } from '@core/lib/axios';
import { Doctor } from '@typings/model/doctor';

export const removeDoctor = async (doctorId: string) => {
  return patientInstance.put(`${PATIENT_DOCTOR_REMOVE_ROUTE}?doctor_id=${doctorId}`);
};

interface DoctorSearchParams {
  first_name?: string;
  search?: string;
  last_name?: string;
  email?: string;
  personal_code?: string;
  npi?: string;
  speciality?: string;
}

interface SearchDoctorsResponse {
  count: number;
  doctors: Doctor[];
}

export const searchDoctors = async (params: DoctorSearchParams) => {
  return patientInstance.post<SearchDoctorsResponse>(PATIENT_SEARCH_DOCTOR_ROUTE, params);
};
