import { doctorInstance } from '@core/lib/axios';
import { Article } from '@typings/model/article';

interface PublishArticleParams {
  voice_note_url: string;
  article_url: string;
  audience_gender: string;
  audience_age_from: number;
  audience_age_to: number;
  about: string;
  health_issues?: string[];
  article_title: string;
  article_image_url: string;
}

export const publishArticle = async (params: PublishArticleParams) => {
  console.log('params: ', params);
  return doctorInstance.post('/newsfeed', params);
};

interface UploadAudioResponse {
  url: string;
}

export const uploadAudio = async (fileUrl: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUrl,
    type: `audio/${fileUrl.split('.').pop()}`,
    name: fileUrl.split('/').pop(),
  } as any);
  return doctorInstance.post<UploadAudioResponse>('/upload/doctor/newsfeed', formData);
};

interface FetchArticleResponse {
  count: number;
  data: Article[];
}

export const fetchArticles = async () => {
  return doctorInstance.get<FetchArticleResponse>('/newsfeed/mine/doctor');
};
