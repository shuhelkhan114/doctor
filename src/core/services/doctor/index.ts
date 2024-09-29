import * as articleServices from './article';
import * as authServices from './auth';
import * as doctorServices from './doctor';
import * as doximityServices from './doximity';
import * as healthIssueServices from './healthIssue';
import * as medicationServices from './medication';
import * as noteServices from './notes';
import * as notificationService from './notification';
import * as ogServices from './og';
import * as patientServices from './patient';
import * as requestServices from './request';

const doctor = {
  og: ogServices,
  auth: authServices,
  medication: medicationServices,
  healthIssue: healthIssueServices,
  note: noteServices,
  doctor: doctorServices,
  request: requestServices,
  article: articleServices,
  doximity: doximityServices,
  patient: patientServices,
  notification: notificationService,
};

export default doctor;
