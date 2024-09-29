export interface FHIRMedication {
  id: string;
  name: string;
  dosageUnit: string;
  dosageAmount: number;
}

export interface MedicationStatementResponse {
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
  extension?: Extension[];
  identifier?: Identifier[];
  basedOn?: BasedOn[];
  status?: string;
  category?: Category;
  medicationReference?: MedicationReference;
  effectivePeriod?: EffectivePeriod;
  dateAsserted?: string;
  informationSource?: InformationSource;
  subject?: Subject;
  taken?: string;
  dosage?: Dosage[];
  issue?: Issue[];
}

export interface Extension {
  valueBoolean?: boolean;
  url: string;
  valueReference?: ValueReference;
}

export interface ValueReference {
  reference: string;
  display: string;
}

export interface Identifier {
  use: string;
  system: string;
  value: string;
}

export interface BasedOn {
  reference: string;
  identifier: Identifier2;
  display: string;
}

export interface Identifier2 {
  use: string;
  system: string;
  value: string;
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

export interface MedicationReference {
  reference: string;
  display: string;
}

export interface EffectivePeriod {
  start: string;
}

export interface InformationSource {
  reference: string;
  display: string;
}

export interface Subject {
  reference: string;
  display: string;
}

export interface Dosage {
  extension: Extension2[];
  text: string;
  patientInstruction: string;
  timing: Timing;
  asNeededBoolean: boolean;
  route: Route;
  method: Method;
  doseQuantity: DoseQuantity;
}

export interface Extension2 {
  valueQuantity: ValueQuantity;
  url: string;
}

export interface ValueQuantity {
  value: number;
  unit: string;
  system: string;
  code: string;
}

export interface Timing {
  repeat: Repeat;
  code: Code;
}

export interface Repeat {
  boundsPeriod: BoundsPeriod;
  count: number;
  timeOfDay: string[];
}

export interface BoundsPeriod {
  start: string;
}

export interface Code {
  text: string;
}

export interface Route {
  coding: Coding2[];
  text: string;
}

export interface Coding2 {
  system: string;
  code: string;
  display: string;
}

export interface Method {
  coding: Coding3[];
  text: string;
}

export interface Coding3 {
  system: string;
  code: string;
  display: string;
}

export interface DoseQuantity {
  value: number;
  unit: string;
  system: string;
  code: string;
}

export interface Issue {
  severity: string;
  code: string;
  details: Details;
}

export interface Details {
  coding: Coding4[];
  text: string;
}

export interface Coding4 {
  system: string;
  code: string;
  display: string;
}

export interface Search {
  mode: string;
}
