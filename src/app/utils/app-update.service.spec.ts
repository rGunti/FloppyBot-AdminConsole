import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppUpdateService } from './app-update.service';

describe('AppUpdateService', () => {
  let service: AppUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
