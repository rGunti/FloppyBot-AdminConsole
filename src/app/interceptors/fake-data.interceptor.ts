import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

import { FileHeader, FileStorageQuota, UserReport } from '../api/entities';

export const FAKE_DATA_HOST = 'http://api.fake';

declare type FakeDataHandler<T> = ((req: HttpRequest<unknown>) => HttpRequest<T>) | T;
declare type FakeRouter = { [route: string]: FakeDataHandler<unknown> };
declare type FakeMethodRouter = { [method: string]: FakeRouter };

const FAKE_REPLIES: FakeMethodRouter = {
  get: {
    '/api/v2/user/me': {
      userId: 'fakeUser123',
      ownerOf: ['Twitch/floppypandach', 'Discord/123456789'],
      channelAliases: {
        'Twitch/floppypandach': 'twitch.tv/floppypandach',
        'Discord/123456789': 'my discord',
      },
      permissions: [
        'read:commands',
        'read:bot',
        'restart:bot',
        'read:quotes',
        'edit:quotes',
        'read:custom-commands',
        'edit:custom-commands',
        'read:config',
        'edit:config',
        'read:files',
        'edit:files',
      ],
    } as UserReport,
    '/api/v2/files/Twitch/floppypandach': [
      {
        id: 'Twitch/floppypandach/harmony.mp3',
        channelId: 'Twitch/floppypandach',
        fileName: 'harmony.mp3',
        fileSize: 86_516,
        mimeType: 'audio/mpeg',
      },
      {
        id: 'Twitch/floppypandach/bonk.mp3',
        channelId: 'Twitch/floppypandach',
        fileName: 'bonk.mp3',
        fileSize: 67_701,
        mimeType: 'audio/mpeg',
      },
      {
        id: 'Twitch/floppypandach/wow thats a lotta words too bad im not readin em.mp3',
        channelId: 'Twitch/floppypandach',
        fileName: 'wow thats a lotta words too bad im not readin em.mp3',
        fileSize: 254_810,
        mimeType: 'audio/mpeg',
      },
    ] as FileHeader[],
    '/api/v2/files/Twitch/floppypandach/quota': {
      channelId: 'Twitch/floppypandach',
      maxStorageQuota: 15_000_000,
      maxFileNumber: 50,
      storageUsed: 409_027,
      fileCount: 3,
    } as FileStorageQuota,
    '/api/v2/files/Discord/123456789': [] as FileHeader[],
    '/api/v2/files/Discord/123456789/quota': {
      channelId: 'Discord/123456789',
      maxStorageQuota: 15_000_000,
      maxFileNumber: 0,
      storageUsed: 0,
      fileCount: 0,
    } as FileStorageQuota,
  },
  post: {},
  put: {},
  delete: {},
};

export const fakeDataInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(FAKE_DATA_HOST)) {
    return next(req);
  }

  if (!FAKE_REPLIES[req.method.toLowerCase()]) {
    console.error('fakeDataInterceptor', 'Call intercepted but unhandled:', req.method, req.url, req.body);
    return notFound();
  }

  const route = req.url.slice(FAKE_DATA_HOST.length);
  const handler = FAKE_REPLIES[req.method.toLowerCase()][route];
  if (!handler) {
    console.error('fakeDataInterceptor', 'Call intercepted but unhandled:', req.method, req.url, req.body);
    return notFound();
  }

  if (typeof handler !== 'function') {
    console.log('fakeDataInterceptor', 'Call intercepted:', req.method, req.url, req.body, handler);
    return ok(handler);
  }

  console.error('fakeDataInterceptor', 'Call intercepted but unhandled:', req.method, req.url, req.body);
  return notFound();
};

function ok(body: unknown) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
}

function notFound() {
  return of(new HttpResponse({ status: 404 })).pipe(delay(500));
}

/*
function error(body: unknown) {
  return of(new HttpResponse({ status: 500, body })).pipe(delay(500));
}
 */
