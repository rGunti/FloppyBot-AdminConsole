import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { Channel, UserReport } from '../../api/entities';
import { FAKE_DATA_HOST } from '../../interceptors/fake-data.interceptor';

import { ChannelService } from './channel.service';

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

describe('ChannelService', () => {
  let service: ChannelService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ChannelService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChannelIcon', () => {
    it('should return the correct icon for a channel', () => {
      const channel = { interface: 'Twitch', channel: 'Channel1' };
      expect(service.getChannelIcon(channel)).toBe('bootstrapTwitch');
    });

    it('should return the default icon for an unknown channel', () => {
      const channel = { interface: 'Unknown', channel: 'Channel1' };
      expect(service.getChannelIcon(channel)).toBe('bootstrapQuestion');
    });
  });

  describe('parseChannelFromChannelId', () => {
    for (const [input, expectedType, expectedId] of [
      ['Twitch/Channel1', 'Twitch', 'Channel1'],
      ['Discord/72136387162378123', 'Discord', '72136387162378123'],
      ['Unknown/123', 'Unknown', '123'],
    ]) {
      test_parseChannelId(input, expectedType, expectedId);
    }

    function test_parseChannelId(input: string, expectedType: string, expectedId: string) {
      it(`should parse channel ID "${input}" correctly`, () => {
        const channel = service.parseChannelFromChannelId(input);
        expect(channel.interface).toBe(expectedType);
        expect(channel.channel).toBe(expectedId);
      });
    }
  });

  describe('getChannelIcon', () => {
    for (const [input, expected] of [
      [{ interface: 'Twitch', channel: 'Channel1' }, 'bootstrapTwitch'],
      [{ interface: 'Discord', channel: '72136387162378123' }, 'bootstrapDiscord'],
      [{ interface: 'Unknown', channel: '123' }, 'bootstrapQuestion'],
    ]) {
      test_getChannelIcon(input as Channel, expected as string);
    }

    function test_getChannelIcon(channel: Channel, expectedIcon: string) {
      it(`should return the correct icon for channel ${channel.interface}`, () => {
        expect(service.getChannelIcon(channel)).toBe(expectedIcon);
      });
    }
  });

  describe('getChannelId', () => {
    for (const [channel, expectedId] of [
      [{ interface: 'Twitch', channel: 'Channel1' }, 'Twitch/Channel1'],
      [{ interface: 'Discord', channel: '72136387162378123' }, 'Discord/72136387162378123'],
      [{ interface: 'Unknown', channel: '123' }, 'Unknown/123'],
    ]) {
      test_getChannelId(channel as Channel, expectedId as string);
    }

    function test_getChannelId(channel: Channel, expectedId: string) {
      it(`should return the correct ID for channel type=${channel.interface}, id=${channel.channel}`, () => {
        expect(service.getChannelId(channel)).toBe(expectedId);
      });
    }
  });

  describe('getChannelAlias', () => {
    beforeEach(() => {
      service = TestBed.inject(ChannelService);
    });

    it('should return the alias for a channel (and call the api only once)', (done) => {
      service
        .getChannelAlias('Twitch/floppypandach')
        .pipe(
          switchMap((twitchAlias) =>
            service
              .getChannelAlias('Discord/123456789')
              .pipe(map((discordAlias) => [twitchAlias, discordAlias] as const)),
          ),
        )
        .subscribe({
          next: ([twitchAlias, discordAlias]) => {
            expect(twitchAlias).toBe('twitch.tv/floppypandach');
            expect(discordAlias).toBe('my discord');
            done();
          },
          error: done.fail,
        });

      const req = httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/user/me`);
      req[0].flush(FAKE_USER);
      expect(req.length).withContext('expected only one request to happen, caching should work').toBe(1);
    });
  });
});
