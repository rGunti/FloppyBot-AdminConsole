import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Channel } from '../../api/entities';

import { ChannelService } from './channel.service';
import { ChannelIdPipe } from './channel-id.pipe';

describe('ChannelIdPipe', () => {
  let pipe: ChannelIdPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelIdPipe, ChannelService, provideHttpClient(), provideHttpClientTesting()],
    });
    pipe = TestBed.inject(ChannelIdPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  const cases: [Channel | null | undefined, string | undefined][] = [
    [{ interface: 'Twitch', channel: 'NotARealChannel' }, 'Twitch/NotARealChannel'],
    [{ interface: 'Twitch', channel: 'NotARealChannel', alias: 'Not A Real Channel' }, 'Twitch/NotARealChannel'],
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
