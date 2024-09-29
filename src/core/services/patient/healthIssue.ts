import { patientInstance } from '../../lib/axios';

interface AddHealthIssueParams {
  name: string;
  description: string;
  severity: string;
  patientId: string;
}

export const addHealthIssue = async (params: AddHealthIssueParams) => {
  const { name, description, severity, patientId } = params;
  return patientInstance.post('/health-issues', {
    name,
    description,
    severity,
    patient_id: patientId,
  });
};

interface AddPatientHealthIssueParams {
  name: string;
  description: string;
  severity: string;
}

export const addPatientHealthIssue = async (params: AddPatientHealthIssueParams) => {
  return patientInstance.post('/health-issues/patient', params);
};
