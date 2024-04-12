import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Channel } from '../../api/entities';

import { ChannelService } from './channel.service';

describe('ChannelService', () => {
  let service: ChannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    service = TestBed.inject(ChannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct icon for a channel', () => {
    const channel = { interface: 'Twitch', channel: 'Channel1' };
    expect(service.getChannelIcon(channel)).toBe('bootstrapTwitch');
  });

  it('should return the default icon for an unknown channel', () => {
    const channel = { interface: 'Unknown', channel: 'Channel1' };
    expect(service.getChannelIcon(channel)).toBe('bootstrapQuestion');
  });

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
