export interface FHIROAuthResponse {
  // success: boolean;
  // data: { code: string; state: string };
  success: boolean;
  data: {
    patientId: string;
    access_token: string;
  };
}
