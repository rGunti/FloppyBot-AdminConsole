import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Channel } from '../../api/entities';
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

  const cases: [Channel | null | undefined, string | undefined][] = [
    [{ interface: 'Twitch', channel: 'NotARealChannel' }, 'Twitch/NotARealChannel'],
    [{ interface: 'Twitch', channel: 'NotARealChannel', alias: 'Not A Real Channel' }, 'Not A Real Channel'],
    [null, undefined],
    [undefined, undefined],
  ];

  for (const caseData of cases) {
    it(`formats channel ${JSON.stringify(caseData[0])} to "${caseData[1]}"`, () => {
      const result = pipe.transform(caseData[0]);
      expect(result).toBe(caseData[1]);
    });
  }
});
