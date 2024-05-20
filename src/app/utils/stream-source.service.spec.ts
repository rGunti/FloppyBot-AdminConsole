import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { StreamSourceService } from './stream-source.service';

describe('StreamSourceService', () => {
  let service: StreamSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StreamSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a stream source URL', () => {
    const generatedUrl = service.buildStreamSourceUrl(
      'https://stream-source.host.fake/',
      'Twitch/SomeChannel',
      'Some-Access-Key',
    );
    expect(generatedUrl).toBe('https://stream-source.host.fake/?channel=Twitch/SomeChannel&token=Some-Access-Key');
  });
});
