import { TestBed } from '@angular/core/testing';

import { CommandApiService } from './command-api.service';

describe('CommandApiService', () => {
  let service: CommandApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
