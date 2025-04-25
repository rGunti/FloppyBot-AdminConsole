import { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  api: 'https://test-api.floppy.bot',
  auth: {
    domain: 'floppypanda-dev.eu.auth0.com',
    clientId: 'J3u7VK8ZSid1z2JRsfO8wDH1k9SdC9RZ',
    authorizationParams: {
      audience: 'https://test.bot.floppypanda.ch/',
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/callback',
  },
  loginMode: 'redirect',
  streamSource: {
    baseUrl: 'https://stream-source.host.fake/',
  },
  enableDebugTools: true,
};
