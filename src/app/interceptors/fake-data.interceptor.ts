import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

import { FileHeader, UserReport } from '../api/entities';

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
    '/api/v2/files/Discord/123456789': [] as FileHeader[],
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
    return next(req);
  }

  const route = req.url.slice(FAKE_DATA_HOST.length);
  const handler = FAKE_REPLIES[req.method.toLowerCase()][route];
  if (!handler) {
    console.log('fakeDataInterceptor', 'Call intercepted:', req.method, req.url, req.body, handler);
    return next(req);
  }

  if (typeof handler !== 'function') {
    console.log('fakeDataInterceptor', 'Call intercepted:', req.method, req.url, req.body, handler);
    return ok(handler);
  }

  return handler(req);
};

function ok(body: unknown) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
}

/*
function error(body: unknown) {
  return of(new HttpResponse({ status: 500, body })).pipe(delay(500));
}
 */
