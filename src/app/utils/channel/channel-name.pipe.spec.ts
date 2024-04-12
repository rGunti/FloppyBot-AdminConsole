import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserApiService } from '../../api/user-api.service';

import { ChannelService } from './channel.service';
import { ChannelNamePipe } from './channel-name.pipe';

describe('ChannelNamePipe', () => {
  let pipe: ChannelNamePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelNamePipe, ChannelService, UserApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    pipe = TestBed.inject(ChannelNamePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
