import { DOCTOR_NOTES_ROUTE } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';
import { DoctorNote } from '@typings/model/doctorNote';

export const fetchGeneralNotes = (patientId: string) => {
  return doctorInstance.get<DoctorNote[]>(`/doctor-notes/general?patient_id=${patientId}`);
};

export const fetchHealthIssueNotes = (patientId: string, healthIssueId: string) => {
  return doctorInstance.get<DoctorNote[]>(
    `/doctor-notes?patient_id=${patientId}&type=HI&id=${healthIssueId}`
  );
};

export const fetchNotes = async (patientId: string, healthIssueId?: string) => {
  let query = `/doctor-notes?patient_id=${patientId}`;
  if (healthIssueId) {
    query += `&type=GN&id=${healthIssueId}`;
  }
  return doctorInstance.get<DoctorNote[]>(query);
};

interface CreateHealthIssueNoteParams {
  patientId: string;
  data: {
    description: string;
    health_issue_id: string;
  };
}

export const createHealthIssueNote = async (params: CreateHealthIssueNoteParams) => {
  const { patientId, data } = params;
  return doctorInstance.post(`${DOCTOR_NOTES_ROUTE}?patient_id=${patientId}`, data);
};

interface CreatePatientNoteParams {
  patientId: string;
  description: string;
}

export const createPatientNote = async (params: CreatePatientNoteParams) => {
  const { patientId, description } = params;

  return doctorInstance.post(`${DOCTOR_NOTES_ROUTE}?patient_id=${params.patientId}`, {
    description,
    patient_id: patientId,
  });
};
