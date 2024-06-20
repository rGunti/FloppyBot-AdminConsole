import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

import { DialogService } from '../utils/dialog.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(DialogService);
  return next(req).pipe(
    catchError((error) => {
      if (error.status && typeof error.status === 'number') {
        const renderedMessage = attemptHttpStatusCodeMessage(error.status);
        if (renderedMessage) {
          dialog.error(renderedMessage);
          return throwError(() => error);
        }
      }

      if (error.status === 404) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return of<any>(null);
      }

      console.error('Captured request with error response', req, error);
      dialog.error(renderMessage(error));
      return throwError(() => error);
    }),
  );
};

function attemptHttpStatusCodeMessage(errorCode: number): string | undefined {
  switch (errorCode) {
    case 401:
    case 403:
      return 'You are not authorized to perform this action.';
    case 429:
      return 'You are currently being limited by the server. Please try again at a later time.';
    case 404: // 404 should return null, not an error
    default:
      return undefined;
  }
}

function renderMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyError = error as any;
  if (anyError.message) {
    return anyError.message;
  }

  return JSON.stringify(error);
}
