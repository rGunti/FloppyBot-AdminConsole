import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingIndicatorService } from '../utils/loading-indicator.service';

export const loadingIndicatorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingIndicator = inject(LoadingIndicatorService);
  console.log('loadingIndicatorInterceptor', 'starting request', req.method, req.url);
  loadingIndicator.registerRequest();
  return next(req).pipe(
    finalize(() => {
      console.log('loadingIndicatorInterceptor', 'finalizing request', req.method, req.url);
      loadingIndicator.completeRequest();
    }),
  );
};
