import { Page } from '@playwright/test';

import { getAuthenticationAudience } from './api';

export function getIdTokenFromLocalStorage(page: Page): Promise<string | null> {
  return page.evaluate((authAudience) => {
    function findAuthKey() {
      for (const key in localStorage) {
        if (key.startsWith('@@auth0spajs@@') && key.indexOf(authAudience) >= 0) {
          return key;
        }
      }
      return undefined;
    }

    const key = findAuthKey();
    if (!key) {
      return null;
    }

    const item = localStorage.getItem(key);
    if (!item) {
      throw new Error('id_token not found in local storage');
    }
    return JSON.parse(item).body.access_token;
  }, getAuthenticationAudience());
}
