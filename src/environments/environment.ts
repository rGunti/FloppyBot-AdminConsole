import { FAKE_DATA_HOST } from '../app/interceptors/fake-data.interceptor';

import { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  api: FAKE_DATA_HOST,
  auth: {
    domain: 'floppypanda-dev.eu.auth0.com',
    clientId: '0K1HDg7wVjHo9l0d17BmxK9zTCui3NJ6',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/callback',
  },
};
