import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingIndicatorService } from '../utils/loading-indicator.service';

export const loadingIndicatorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingIndicator = inject(LoadingIndicatorService);
  loadingIndicator.registerRequest();
  return next(req).pipe(
    finalize(() => {
      loadingIndicator.completeRequest();
    }),
  );
};
