import { DOCTOR_SEARCH_DOCTOR_ROUTE } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';
import { Doctor } from '@typings/model/doctor';

interface DoctorSearchParams {
  patientId: string;
  first_name?: string;
  search?: string;
  last_name?: string;
  email?: string;
  personal_code?: string;
}

interface SearchDoctorsResponse {
  count: number;
  doctors: Doctor[];
}

export const searchDoctors = async (params: DoctorSearchParams) => {
  const { patientId, ...filters } = params;
  return doctorInstance.post<SearchDoctorsResponse>(
    `${DOCTOR_SEARCH_DOCTOR_ROUTE}?patient_id=${patientId}`,
    filters
  );
};
