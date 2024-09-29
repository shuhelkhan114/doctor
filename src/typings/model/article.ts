export interface Article {
  id: string;
  doctor_id: string;
  voice_note_url: string;
  article_url: string;
  article_image_url: string;
  article_title: string;
  audience_gender: string;
  about: string;
  audience_age_from: number;
  audience_age_to: number;
  health_issues: string[];
  job_id: string;
  created_at: string;
  updated_at: string;
  doctor: ArticleDoctor;
}

interface ArticleDoctor {
  first_name: string;
  last_name: string;
  doctor_image: string;
  id: string;
}
