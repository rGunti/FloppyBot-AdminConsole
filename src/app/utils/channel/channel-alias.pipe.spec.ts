import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserApiService } from '../../api/user-api.service';

import { ChannelService } from './channel.service';
import { ChannelAliasPipe } from './channel-alias.pipe';

describe('ChannelAliasPipe', () => {
  let pipe: ChannelAliasPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelAliasPipe, ChannelService, UserApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    pipe = TestBed.inject(ChannelAliasPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
