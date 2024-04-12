import { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  api: 'http://localhost:3000',
  auth: {
    domain: 'floppypanda-dev.eu.auth0.com',
    clientId: '0K1HDg7wVjHo9l0d17BmxK9zTCui3NJ6',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/callback',
  },
};
