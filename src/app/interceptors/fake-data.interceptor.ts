import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, dematerialize, materialize, of, throwError } from 'rxjs';

import { FileHeader, FileStorageQuota, Quote, UserReport } from '../api/entities';

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
    '/api/v2/quotes/Twitch/floppypandach': [
      {
        id: 'Twitch/floppypandach/1',
        channelMappingId: 'Twitch/floppypandach',
        quoteId: 1,
        quoteText: 'Quote 1 text for Twitch/floppypandach',
        quoteContext: 'Chess',
        createdAt: new Date(),
        createdBy: 'John Doe',
      },
      {
        id: 'Twitch/floppypandach/2',
        channelMappingId: 'Twitch/floppypandach',
        quoteId: 2,
        quoteText: 'Quote 2 text for Twitch/floppypandach',
        quoteContext: 'Checkers',
        createdAt: new Date(),
        createdBy: 'Jane Doe',
      },
      {
        id: 'Twitch/floppypandach/3',
        channelMappingId: 'Twitch/floppypandach',
        quoteId: 3,
        quoteText: 'Quote 3 text for Twitch/floppypandach',
        quoteContext: 'Go',
        createdAt: new Date(),
        createdBy: 'Alice',
      },
    ] as Quote[],
    '/api/v2/quotes/Discord/123456789': [] as Quote[],
  },
  post: {},
  put: {},
  delete: {
    '/api/v2/quotes/Twitch/floppypandach/1': noContent,
    '/api/v2/quotes/Twitch/floppypandach/2': noContent,
    '/api/v2/quotes/Twitch/floppypandach/3': (req: HttpRequest<unknown>) => serverError(req),
  },
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
    console.log('fakeDataInterceptor', 'Call intercepted by data:', req.method, req.url, req.body, handler);
    return ok(handler);
  }

  console.log('fakeDataInterceptor', 'Call intercepted by fn:', req.method, req.url, req.body, handler);
  return handler(req);
};

function ok(body: unknown) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
}

function noContent(req?: HttpRequest<unknown>) {
  console.debug('fakeDataInterceptor', 'Returning 204 No Content:', req?.method, req?.url, req?.body);
  return of(new HttpResponse({ status: 204 })).pipe(delay(500));
}

function notFound() {
  return of(new HttpResponse({ status: 404 })).pipe(delay(500));
}

function serverError(req?: HttpRequest<unknown>, error?: unknown) {
  console.debug('fakeDataInterceptor', 'Returning 500 server error:', req?.method, req?.url, req?.body);
  return throwError(() => error || 'Unknown Error').pipe(materialize(), delay(500), dematerialize());
}
