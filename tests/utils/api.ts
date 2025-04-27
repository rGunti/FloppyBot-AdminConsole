import { APIRequestContext, APIResponse, Page } from '@playwright/test';

import { environment } from '../../src/environments/environment.playwright';

import { getIdTokenFromLocalStorage } from './auth';

export declare type PageAndRequest = { page: Page; request: APIRequestContext };

export function getBackendRoute(route: string): string {
  return `${environment.api}${route}`;
}

export function getAuthenticationAudience(): string {
  return environment.auth.authorizationParams!.audience!;
}

export async function makeGetApiRequest(
  pageAndRequest: PageAndRequest,
  route: string,
  content: unknown,
): Promise<APIResponse> {
  const { page, request } = pageAndRequest;
  const idToken = await getIdTokenFromLocalStorage(page);
  return await request.post(getBackendRoute(route), {
    data: content,
    headers: getHeaders(idToken!),
  });
}

export async function makePostApiRequest(
  pageAndRequest: PageAndRequest,
  route: string,
  content: unknown,
): Promise<APIResponse> {
  const { page, request } = pageAndRequest;
  const idToken = await getIdTokenFromLocalStorage(page);
  return await request.post(getBackendRoute(route), {
    data: content,
    headers: getHeaders(idToken!),
  });
}

function getHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Playwright-User': 'true',
  };
}
