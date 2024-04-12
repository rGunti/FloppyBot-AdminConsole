import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ChannelService } from './channel.service';
import { ChannelIconPipe } from './channel-icon.pipe';

describe('ChannelIconPipe', () => {
  let pipe: ChannelIconPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelIconPipe, ChannelService, HttpClient, provideHttpClient(), provideHttpClientTesting()],
    });
    pipe = TestBed.inject(ChannelIconPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
