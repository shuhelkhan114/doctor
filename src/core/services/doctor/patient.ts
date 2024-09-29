import { doctorInstance } from '@core/lib/axios';
import { PatientEntity } from '@typings/model/patient';

interface PatientsResponse {
  count: number;
  patients: PatientEntity[];
}

export const fetchPatients = (query = '', sortField = 'first_name', sortDirection = 'ASC') => {
  return doctorInstance.get<PatientsResponse>(
    `/patients?search=${query}&filter[sort]=${sortField}&filter[sort]=${sortDirection}`
  );
};

export const fetchSinglePatient = (patientId: string) => {
  return doctorInstance.get<PatientEntity>(`patients/id?patient_id=${patientId}`);
};

export const removePatient = (patientId: string) => {
  return doctorInstance.put(`doctors/patient/remove?patient_id=${patientId}`);
};
