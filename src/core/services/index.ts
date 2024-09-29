import * as configServices from './config';
import doctor from './doctor';
import * as drugbankServices from './drugbank';
import patient from './patient';
import * as streamServices from './stream';

const API = {
  patient,
  doctor,
  stream: streamServices,
  drugbank: drugbankServices,
  config: configServices,
};

export default API;
