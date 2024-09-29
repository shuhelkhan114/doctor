export interface FHIRDoctor {
  id: string;
  name: string;
  speciality: string;
  imageUrl: string;
  email?: string;
  npiNumber?: string;
}

export interface CareTeamResponse {
  resourceType: string;
  type: string;
  total: number;
  link: Link[];
  entry: Entry[];
}

export interface Link {
  relation: string;
  url: string;
}

export interface Entry {
  link?: Link2[];
  fullUrl: string;
  resource: Resource;
  search: Search;
}

export interface Link2 {
  relation: string;
  url: string;
}

export interface Resource {
  resourceType: string;
  id?: string;
  status?: string;
  category?: Category[];
  subject?: Subject;
  participant?: Participant[];
  issue?: Issue[];
}

export interface Category {
  coding: Coding[];
  text: string;
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface Subject {
  reference: string;
  display: string;
}

export interface Participant {
  role: Role[];
  member: Member;
}

export interface Role {
  coding: Coding2[];
  text: string;
}

export interface Coding2 {
  system: string;
  code: string;
  display: string;
}

export interface Member {
  reference: string;
  type: string;
  display: string;
}

export interface Issue {
  severity: string;
  code: string;
  details: Details;
}

export interface Details {
  coding: Coding3[];
  text: string;
}

export interface Coding3 {
  system: string;
  code: string;
  display: string;
}

export interface Search {
  mode: string;
}

export interface PractitionerResponse {
  resourceType: string;
  id: string;
  identifier: PractitionerIdentifier[];
  active: boolean;
  name: PractitionerName[];
  gender: string;
  photo: PractitionerPhoto[];
}

export interface PractitionerIdentifier {
  use: string;
  type?: PractitionerType;
  system: string;
  value: string;
}

export interface PractitionerType {
  text: string;
}

export interface PractitionerName {
  use: string;
  text: string;
  family: string;
  given: string[];
}

export interface PractitionerPhoto {
  contentType: string;
  url: string;
}
