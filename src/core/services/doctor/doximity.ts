import { doximityConfig } from '@core/config/app';
import { doximityInstance } from '@core/lib/axios';
import jwtDecode from 'jwt-decode';

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export const getOAuthToken = async (code: string) => {
  const url = new URLSearchParams();
  url.append('code', code);
  url.append('grant_type', 'authorization_code');
  url.append('redirect_uri', doximityConfig.redirectUri);
  url.append('code_verifier', doximityConfig.codeVerifier);

  return doximityInstance
    .post<OAuthTokenResponse>(`/oauth/token`, url, {
      headers: {
        Authorization: `Basic ${doximityConfig.authorizationToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => res.data);
};

interface UserInfoResponse {
  aud: string[];
  credentials: string;
  family_name: string;
  given_name: string;
  iss: string;
  middle_name: string;
  name: string;
  profile_photo_url: string;
  specialty: string;
  sub: string;
  email?: string;
  token: string;
}

export const getUserInfo = async (accessToken: string) => {
  return await doximityInstance
    .get<string>(`/oauth/userinfo`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then<UserInfoResponse>((res) => {
      const jwtToken = res.data;
      return {
        token: jwtToken,
        ...jwtDecode(res.data as string),
      };
    });
};
