export type TimeZone = {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
};

export type AvailabilityTime = {
  hours: number;
  minutes: number;
  window: 'am' | 'pm';
};

export type Availability = {
  day: string;
  available?: boolean;
  durations: {
    start_time: AvailabilityTime;
    end_time: AvailabilityTime;
  }[];
};

export enum UserRole {
  Doctor = 'Doctor',
  Patient = 'Patient',
}

export interface SVGIconProps {
  fill?: string;
  height?: number;
  width?: number;
}

export interface PatientRowData {
  id: string;
  name: string;
  imageUrl: string;
  doctorsCount: number;
  healthIssuesCount: number;
}

export enum DocHelloNotificationType {
  NewPatientRequest = 'NEW PATIENT REQUEST',
  NewArticle = 'NEW ARTICLE',
  NewDoctor = 'NEW DOCTOR',
}

export interface ImageResized {
  image_url: string;
}

export enum SubscriptionPlan {
  Basic = 'BASIC',
  Unlimited = 'UNLIMITED',
}
