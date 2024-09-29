import * as authServices from './auth';
import * as doctorServices from './doctor';
import * as fhirServices from './fhir';
import * as healthIssueServices from './healthIssue';
import * as medicationServices from './medication';
import * as newsfeedServices from './newsfeed';
import * as noteServices from './notes';
import * as notificationServices from './notification';
import * as requestServices from './request';

const patient = {
  medication: medicationServices,
  doctor: doctorServices,
  auth: authServices,
  request: requestServices,
  newsfeed: newsfeedServices,
  fhir: fhirServices,
  healthIssue: healthIssueServices,
  notification: notificationServices,
  note: noteServices,
};

export default patient;
