import { DOCTOR_PROFILE_UPDATE_ROUTE } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';
import { DoctorSignUpParams } from '@typings/api-responses/params';
import { DoctorLoginResponse } from '@typings/api-responses/responses';
import { Doctor } from '@typings/model/doctor';

export const doctorSignUp = async (params: DoctorSignUpParams) => {
  return doctorInstance.post<Doctor>('/doctors', params);
};

interface DoctorLoginParams {
  username: string;
  password: string;
}

export const doctorLogin = async (params: DoctorLoginParams) => {
  return doctorInstance.post<DoctorLoginResponse>('/doctors/auth/login', params);
};

export const getDoctorProfile = async () => {
  return doctorInstance.get<Doctor>('/doctors/profile');
};

type UpdateProfileParams = Partial<{
  device_tokens: string[];
  npi: string;
  availablity: string;
  first_name: string;
  last_name: string;
  chat_availibility_tz: number;
  doctor_image: string;
  contact: string;
  address: string | null;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  payment_street_address: string;
  payment_city: string;
  payment_state: string;
  payment_zipcode: string;
  venmo_payment_id: string;
  paypal_payment_id: string;
  payment_method: string;
  chat_availibility: {
    day: string;
    durations: {
      start_time: {
        hours: number;
        minutes: number;
        window: 'am' | 'pm';
      };
      end_time: {
        hours: number;
        minutes: number;
        window: 'am' | 'pm';
      };
    }[];
  }[];
}>;

export const updateProfile = async (params: UpdateProfileParams) => {
  return doctorInstance.put<Doctor>(`${DOCTOR_PROFILE_UPDATE_ROUTE}`, params);
};
