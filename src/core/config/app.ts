/* global __DEV__ */
import Config from 'react-native-config';

export const chatApiKey = 'kprgakcy9dfk';

export const appConfig = {
  android: {
    bundleId: 'com.trudoc.android',
  },
  ios: {
    bundleId: 'com.trudoc.dochello',
  },
  doctor: {
    defaultWorkingTimeStart: {
      // 9:00 AM
      hours: 9,
      minutes: 0,
    },
    defaultWorkingTimeEnd: {
      // 5:00 PM
      hours: 17,
      minutes: 0,
    },
  },
};

// Doximity Configurations
// TODO: Find a way to secure the credentials
export const doximityConfig = {
  baseUrl: 'https://auth.doximity.com',
  clientId: '69e58506577af9f7082a2a358d3ac508e4e7fa8c16154a11e575640bdf7cacca',
  responseType: 'code',
  redirectUri: 'https://www.trudoc.com/dev/auth/redirect/doximity',
  scope: 'profile:read:basic profile:read:email dialer',
  state: 'random_string_for_development',
  codeChallenge: '9koPMnJpaWYErJvKb49uM6A7UA4JaQ5_hCH53SudlVo',
  codeChallengeMethod: 'S256',
  getOAuthUrl() {
    return `${this.baseUrl}/oauth/authorize?client_id=${this.clientId}&response_type=${
      this.responseType
    }&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(
      this.scope
    )}&state=${this.state}&code_challenge=${this.codeChallenge}&code_challenge_method=${
      this.codeChallengeMethod
    }`;
  },
  authorizationToken:
    'NjllNTg1MDY1NzdhZjlmNzA4MmEyYTM1OGQzYWM1MDhlNGU3ZmE4YzE2MTU0YTExZTU3NTY0MGJkZjdjYWNjYTo3MWQyNWQ2MGU4MDViYWYzN2MxZmIxZjE2ZTUyNmZmYjM3MmQ5ZmQ3ZTVlNTVkMTQzZWUxZjI4Y2E4YTkyZmU3M2RlZDZkZTIzYWEwY2FlNWU3MjFmNTQxYTBkZTdkODI3ODNiODMyOWFkMDgyNjJmZjYwZjcwZDU5MWI5NjQxOQ==',
  codeVerifier:
    'CuKQotQrudDrdT.cwZkH6nlSOniHoGupevPGXmm6Jt6TrzB0WT4fnvhm2.lzOk1ucUl2qfVgincUp0nkCVK.F8CP-Os4qI.jN81VpCq6yFKmu_KOA1suba2HfV5EGKqh',
};

export const truDocConfig = {
  baseUrl: Config.API_URL,
  dynamicLinkBaseUrl:
    Config.NODE_ENV === 'production' ? 'https://app.vocaldocs.com' : 'https://dev.vocaldocs.com',
  primaryDomain: 'https://vocaldocs.com',
  domain:
    Config.NODE_ENV === 'production' ? 'https://app.vocaldocs.com' : 'https://dev.vocaldocs.com',
};

export const fhirConfig = {
  clientId: 'f9a1f2af-1bbb-4bfe-b99b-7fa3e82bba37',
};

export const drugBankConfig = {
  baseUrl: 'https://api.drugbank.com/v1',
  apiKey: '345bdb8b92872001bb48c8a37681a6b9',
  region: 'us',
};

export const deepLinkUrls = {
  emailVerification: `${truDocConfig.domain}/verify-email`,
  forgotPassword: `${truDocConfig.domain}/forgot-password`,
  doctorInvitation: `${truDocConfig.domain}}/invite-patient`,
};

export const medicationPricingRange = ['$', '$$', '$$$', '$$$$', '$$$$$'];
