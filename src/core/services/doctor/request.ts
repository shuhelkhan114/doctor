import { DOCTOR_REFER_ROUTE } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';
import { Doctor } from '@typings/model/doctor';
import { PatientEntity } from '@typings/model/patient';

export interface ReferPatientParams {
  patientId: string;
  doctorId: string;
}

export interface PatientRequestEntity {
  created_at: string;
  doctor_id: string;
  id: string;
  job_id: string;
  patient: PatientEntity;
  patient_id: string;
  referred_by: string | null;
  referred_note?: string;
  referrer: Doctor;
  // TODO: Make it enum
  status: string;
  updated_at: string;
}

export const referPatient = async (params: ReferPatientParams) => {
  const { doctorId, patientId } = params;
  return doctorInstance.post<{ request_id: string }>(
    `${DOCTOR_REFER_ROUTE}?patient_id=${patientId}`,
    {
      doctor_id: doctorId,
    }
  );
};

interface PatientsResponse {
  count: number;
  requests: PatientRequestEntity[];
}

export const fetchPatientRequests = async () => {
  return doctorInstance.get<PatientsResponse>('/requests/list/doctor');
};

export const acceptRequest = async (requestId: string) => {
  return doctorInstance.post(`/requests/accept/${requestId}`);
};

export const declineRequest = async (requestId: string) => {
  return doctorInstance.post(`/requests/decline/${requestId}`);
};

interface AddReferParams {
  requestId: string;
  note: string;
}

export const addReferNote = (params: AddReferParams) => {
  return doctorInstance.put(`requests/patient?request_id=${params.requestId}`, {
    referred_note: params.note,
  });
};
