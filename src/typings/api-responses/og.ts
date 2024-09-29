export interface OGResponse {
  result: Result;
  body: string;
}

export interface Result {
  articlePublishedTime: string;
  articleAuthor: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterCard: string;
  ogImage: OgImage;
  twitterImage: TwitterImage;
  ogLocale: string;
  favicon: string;
  charset: string;
  requestUrl: string;
  success: boolean;
}

export interface OgImage {
  height: string;
  type: string;
  url: string;
  width: string;
}

export interface TwitterImage {
  alt: any;
  height: any;
  url: string;
  width: any;
}
