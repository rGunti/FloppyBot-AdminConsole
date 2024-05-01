import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Channel } from '../../api/entities';

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

  const cases: [Channel | null | undefined, string | undefined][] = [
    [{ interface: 'Twitch', channel: 'NotARealChannel' }, 'bootstrapTwitch'],
    [{ interface: 'Twitch', channel: 'NotARealChannel', alias: 'Not A Real Channel' }, 'bootstrapTwitch'],
    [{ interface: 'Discord', channel: 'NotARealChannel', alias: 'Not A Real Channel' }, 'bootstrapDiscord'],
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
