export interface FHIRHealthIssue {
  id: string;
  name: string;
}

export interface HealthIssuesResponse {
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
  mode?: string;
  title?: string;
  code?: Code;
  subject?: Subject;
  entry?: Entry2[];
  issue?: Issue[];
}

export interface Code {
  coding: Coding[];
}

export interface Coding {
  system: string;
  code: string;
}

export interface Subject {
  reference: string;
  display: string;
}

export interface Entry2 {
  item: Item;
}

export interface Item {
  reference: string;
  display: string;
}

export interface Issue {
  severity: string;
  code: string;
  details: Details;
}

export interface Details {
  coding: Coding2[];
  text: string;
}

export interface Coding2 {
  system: string;
  code: string;
  display: string;
}

export interface Search {
  mode: string;
}
