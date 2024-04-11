import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService implements OnDestroy {
  private readonly state$ = new BehaviorSubject<number>(0);
  readonly visible$ = this.state$.pipe(map((totalRequests) => totalRequests > 0));

  private totalRequests = 0;

  registerRequest(): void {
    this.totalRequests++;
    this.state$.next(this.totalRequests);
  }

  completeRequest(): void {
    this.totalRequests--;
    this.state$.next(this.totalRequests);
  }

  ngOnDestroy(): void {
    this.state$.complete();
  }
}
