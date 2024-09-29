import { PATIENT_SEND_NON_DOCHELLO_DOCTOR_REQUEST_ROUTE } from '@core/config/api';
import { patientInstance } from '@core/lib/axios';

interface NonDocHelloDoctorRequestParam {
  first_name: string;
  last_name: string;
  email?: string;
}

export const sendDoctorRequestInactive = (data: NonDocHelloDoctorRequestParam[]) => {
  return patientInstance.post(PATIENT_SEND_NON_DOCHELLO_DOCTOR_REQUEST_ROUTE, data);
};

export const sendRequest = async (doctorId: string) => {
  return patientInstance.post('/requests', { doctor_id: doctorId });
};

export const removeRequest = async (requestId: string) => {
  return patientInstance.put(`/requests/remove/patient?request_id=${requestId}`);
};
