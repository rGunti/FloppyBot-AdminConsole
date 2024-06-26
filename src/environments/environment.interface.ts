import { AuthConfig } from '@auth0/auth0-angular';

export interface AppEnvironment {
  api: string;
  auth: AuthConfig;
  loginMode: 'redirect' | 'popup';
  streamSource: {
    baseUrl: string;
  };
  enableDebugTools: boolean;
}
