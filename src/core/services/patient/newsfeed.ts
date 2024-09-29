import { PATIENT_NEWSFEED_ROUTE } from '@core/config/api';
import { patientInstance } from '@core/lib/axios';
import { Article } from '@typings/model/article';

interface NewsfeedResponse {
  data: Article[];
  count: number;
}

export const fetchNewsfeed = async () => {
  return patientInstance.get<NewsfeedResponse>(PATIENT_NEWSFEED_ROUTE);
};
