import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserReport } from '../../api/entities';
import { UserApiService } from '../../api/user-api.service';
import { FAKE_DATA_HOST } from '../../interceptors/fake-data.interceptor';

import { ChannelService } from './channel.service';
import { ChannelAliasPipe } from './channel-alias.pipe';

const FAKE_USER: UserReport = {
  userId: 'fakeUser123',
  ownerOf: ['Twitch/floppypandach', 'Discord/123456789'],
  channelAliases: {
    'Twitch/floppypandach': 'twitch.tv/floppypandach',
    'Discord/123456789': 'my discord',
  },
  permissions: [
    'read:commands',
    'read:bot',
    'restart:bot',
    'read:quotes',
    'edit:quotes',
    'read:custom-commands',
    'edit:custom-commands',
    'read:config',
    'edit:config',
    'read:files',
    'edit:files',
  ],
};

describe('ChannelAliasPipe', () => {
  let pipe: ChannelAliasPipe;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelAliasPipe, ChannelService, UserApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    pipe = TestBed.inject(ChannelAliasPipe);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  const cases: [string, string][] = [
    ['Twitch/floppypandach', 'twitch.tv/floppypandach'],
    ['Discord/123456789', 'my discord'],
    ['Discord/some-unknown-channel', 'Discord/some-unknown-channel'],
  ];

  for (const caseData of cases) {
    it(`should return channel alias "${caseData[1]}" for "${caseData[0]}"`, () => {
      pipe.transform(caseData[0]).subscribe((result) => {
        expect(result).toBe(caseData[1]);
      });

      const req = httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/user/me`);
      req[0].flush(FAKE_USER);
      expect(req.length).withContext('expected only one request to happen, caching should work').toBe(1);
    });
  }

  it(`should not request user data for empty channel`, () => {
    pipe.transform('').subscribe((result) => {
      expect(result).toBe('');
    });

    const req = httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/user/me`);
    expect(req.length).withContext('expected no requests to happen').toBe(0);
  });
});
