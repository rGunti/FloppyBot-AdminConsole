import { FAKE_DATA_HOST } from '../app/interceptors/fake-data.interceptor';

import { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  api: FAKE_DATA_HOST,
  auth: {
    domain: 'fake.auth.host',
    clientId: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    authorizationParams: {
      audience: 'https://bot.floppypanda.test',
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/callback',
  },
  enableDebugTools: true,
};
