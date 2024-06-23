//import { FAKE_DATA_HOST } from '../app/interceptors/fake-data.interceptor';

import { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  api: 'http://localhost:5266',
  auth: {
    domain: 'floppypanda-dev.eu.auth0.com',
    clientId: 'J3u7VK8ZSid1z2JRsfO8wDH1k9SdC9RZ',
    authorizationParams: {
      audience: 'https://test.bot.floppypanda.ch/',
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/callback',
  },
  streamSource: {
    baseUrl: 'https://stream-source.host.fake/',
  },
  enableDebugTools: true,
};
