import { axiosInstance } from '@core/lib/axios';

interface ConfigResponse {
  medication_frequecny: MedicationFrequecny[];
  article_about: ArticleAbout[];
  health_issues: ConfigHealthIssue[];
  specialities: string[];
}

export interface ConfigHealthIssue {
  id: string;
  value: string;
}
export interface MedicationFrequecny {
  id: string;
  value: string;
}

export interface ArticleAbout {
  id: string;
  value: string;
}

export const fetchAppConfig = async () => {
  return axiosInstance.get<ConfigResponse>('/appconfig').then((res) => res.data);
};
