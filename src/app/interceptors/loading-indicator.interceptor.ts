import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingIndicatorService } from '../utils/loading-indicator.service';

export const provideLoadingIndicatorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingIndicator = inject(LoadingIndicatorService);
  loadingIndicator.registerRequest();
  return next(req).pipe(
    finalize(() => {
      loadingIndicator.completeRequest();
    }),
  );
};
