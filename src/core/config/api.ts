export const DOCTOR_PROFILE_UPDATE_ROUTE = '/doctors';
export const DOCTOR_OG_ROUTE = '/ogs';
export const DOCTOR_NOTES_ROUTE = '/doctor-notes';
export const DOCTOR_NOTE_HEALTH_ROUTE = '/doctor-notes/health-issue';
export const DOCTOR_SEARCH_DOCTOR_ROUTE = '/doctors/find/doctor';
export const DOCTOR_REFER_ROUTE = '/requests/refer';

export const doctorRoutes = {
  medication: {
    getConfirmMedicationRoute(patientId: string, medicationId: string) {
      return `/medication/confirm?patient_id=${patientId}&medication_id=${medicationId}`;
    },
    getRemoveMedicationRoute(patientId: string, medicationId: string) {
      return `/medication/remove?patient_id=${patientId}&medication_id=${medicationId}`;
    },
    getUpdateMedicationRoute(patientId: string, medicationId: string) {
      return `/medication?patient_id=${patientId}&medication_id=${medicationId}`;
    },
  },
  healthIssue: {
    getAddHealthIssueRoute(patientId: string) {
      return `/health-issues?patient_id=${patientId}`;
    },
  },
  note: {
    getNotesRoute(healthIssueId: string) {
      return `/doctor-notes/${healthIssueId}`;
    },
    createNoteRoute() {
      return '/doctor-notes';
    },
  },
};

export const PATIENT_PROFILE_ROUTE = '/patients';
export const PATIENT_VERIFY_EMAIL_ROUTE = '/patients/verify-email';
export const PATIENT_DOCTOR_REMOVE_ROUTE = '/patients/doctor/remove';
export const PATIENT_ADD_MEDICATION_ROUTE = '/medication/patient';
export const PATIENT_SEARCH_DOCTOR_ROUTE = '/doctors/find';
export const PATIENT_SEND_NON_DOCHELLO_DOCTOR_REQUEST_ROUTE = '/requests/inactive';
export const PATIENT_NEWSFEED_ROUTE = '/newsfeed/mine/patient';
export const PATIENT_CONFIRM_MEDICATION_ROUTE = '/medication/patient/confirm';
export const PATIENT_REMOVE_MEDICATION_ROUTE = '/medication/patient/remove';
export const PATIENT_UPDATE_MEDICATION_ROUTE = 'medication/patient';
