import { patientInstance } from '@core/lib/axios';
import { DoctorNote } from '@typings/model/doctorNote';

export const fetchHealthIssueNote = async (healthIssueId: string) => {
  return patientInstance.get<DoctorNote[]>(
    `/doctor-notes/health-issue/patient?health_issue_id=${healthIssueId}`
  );
};
