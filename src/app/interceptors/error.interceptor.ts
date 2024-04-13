import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { DialogService } from '../utils/dialog.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(DialogService);
  return next(req).pipe(
    catchError((error) => {
      console.error('Captured request with error response', req, error);
      dialog.error(renderMessage(error));
      return throwError(() => error);
    }),
  );
};

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
