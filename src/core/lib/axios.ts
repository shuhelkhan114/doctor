import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import { doximityConfig, drugBankConfig, truDocConfig } from '../config/app';
import { asyncStorageKeys } from '../config/asyncStorage';
import { auth } from './firebase';

export const axiosInstance = Axios.create({
  baseURL: truDocConfig.baseUrl,
});

export const patientAxiosInstance = Axios.create({
  baseURL: truDocConfig.baseUrl,
});

patientAxiosInstance.interceptors.request.use(
  async (config) => {
    const value = await AsyncStorage.getItem(asyncStorageKeys.FIREBASE_PATIENT_TOKENS);
    const keys = JSON.parse(value as string);
    if (keys) {
      config.headers = {
        Authorization: `Bearer ${keys.accessToken}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

patientAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await auth.currentUser?.getIdToken(true);
      await AsyncStorage.setItem(
        asyncStorageKeys.FIREBASE_PATIENT_TOKENS,
        JSON.stringify({
          accessToken: access_token,
        })
      );
      patientAxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
      return patientAxiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const doctorAxiosInstance = Axios.create({
  baseURL: truDocConfig.baseUrl,
});

doctorAxiosInstance.interceptors.request.use(
  async (config) => {
    const value = await AsyncStorage.getItem(asyncStorageKeys.DOCTOR_TOKENS);
    const keys = JSON.parse(value as string);
    if (keys) {
      config.headers = {
        Authorization: `Bearer ${keys.accessToken}`,
      } as AxiosRequestHeaders;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

doctorAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = JSON.parse(
        (await AsyncStorage.getItem(asyncStorageKeys.DOCTOR_TOKENS)) || '{}'
      );
      const res = await doctorAxiosInstance
        .post<{ access_token: string; refresh_token: string }>('/doctors/auth/refresh', {
          refresh_token: refreshToken,
        })
        .then((res) => res.data);

      const { access_token, refresh_token } = res;

      await AsyncStorage.setItem(
        asyncStorageKeys.DOCTOR_TOKENS,
        JSON.stringify({
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      );
      doctorAxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
      return doctorAxiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

const doximityInstance = Axios.create({
  baseURL: doximityConfig.baseUrl,
});

const fhirInstance = Axios.create({});

const drugBankInstance = Axios.create({
  baseURL: drugBankConfig.baseUrl,
});

drugBankInstance.defaults.headers.common.Authorization = drugBankConfig.apiKey;

const patientInstance = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    patientAxiosInstance.get<TResponse>(url, config).then((res) => res.data),
  post: <TResponse>(url: string, body?: object, config?: any) =>
    patientAxiosInstance.post<TResponse>(url, body, config).then((res) => res.data),
  put: <TResponse>(url: string, body?: object, config?: any) =>
    patientAxiosInstance.put<TResponse>(url, body, config).then((res) => res.data),
};

const doctorInstance = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    doctorAxiosInstance.get<TResponse>(url, config).then((res) => res.data),
  post: <TResponse>(url: string, body?: object, config?: any) =>
    doctorAxiosInstance.post<TResponse>(url, body, config).then((res) => res.data),
  put: <TResponse>(url: string, body?: object, config?: any) =>
    doctorAxiosInstance.put<TResponse>(url, body, config).then((res) => res.data),
  delete: <TResponse>(url: string, body?: object) =>
    doctorAxiosInstance.delete<TResponse>(url, body).then((res) => res.data),
};

export { doctorInstance, doximityInstance, drugBankInstance, fhirInstance, patientInstance };
