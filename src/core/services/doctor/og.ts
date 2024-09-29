import { DOCTOR_OG_ROUTE } from '@core/config/api';
import { doctorInstance } from '@core/lib/axios';
import { OGResponse } from '@typings/api-responses/og';

export const fetchOg = async (url: string) => {
  return doctorInstance
    .get<OGResponse>(`${DOCTOR_OG_ROUTE}/${encodeURIComponent(url)}`)
    .then((res) => res.result);
};
