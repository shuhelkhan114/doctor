import { doctorRoutes } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';

interface AddHealthIssueParams {
  patientId: string;
  data: [
    {
      name: string;
      description: string;
      severity: string;
    }
  ];
}

export const addHealthIssue = async (params: AddHealthIssueParams) => {
  const { patientId, data } = params;
  return doctorInstance.post(doctorRoutes.healthIssue.getAddHealthIssueRoute(patientId), data);
};

interface RemoveHealthIssueParams {
  patientId: string;
  healthIssueId: string;
}

export const removeHealthIssue = async (params: RemoveHealthIssueParams) => {
  const { patientId, healthIssueId } = params;

  return doctorInstance.put(
    `/health-issues/remove?health_issue_id=${healthIssueId}&patient_id=${patientId}`
  );
};

interface UpdateHealthIssueParams {
  patientId: string;
  healthIssueId: string;
  severity: string;
}

export const updateHealthIssue = async (params: UpdateHealthIssueParams) => {
  const { patientId, healthIssueId, severity } = params;

  return doctorInstance.put(
    `/health-issues/doctor?health_issue_id=${healthIssueId}&patient_id=${patientId}`,
    { severity }
  );
};
