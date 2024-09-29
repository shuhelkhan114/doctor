import { patientInstance } from '@core/lib/axios';

export const fetchNotifications = () => {
  return patientInstance.get('/inapp-notifications/patient');
};
