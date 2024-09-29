export interface NewsFeedItem {
  id: string;
  title?: string;
  doctor_id: string;
  voice_note_url: string;
  article_url: string;
  audience_gender: string;
  audience_age_from: number;
  audience_age_to: number;
  topics: string[];
  job_id: string;
  created_at: string;
  updated_at: string;
  image_url: string;
}
