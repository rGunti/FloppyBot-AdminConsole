import { TestBed } from '@angular/core/testing';

import { ChannelService } from './channel.service';
import { Channel } from './channel.entities';

describe('ChannelService', () => {
  let service: ChannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct icon for a channel', () => {
    const channel = { type: 'Twitch', id: 'Channel1' };
    expect(service.getChannelIcon(channel)).toBe('bootstrapTwitch');
  });

  it('should return the default icon for an unknown channel', () => {
    const channel = { type: 'Unknown', id: 'Channel1' };
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
      expect(channel.type).toBe(expectedType);
      expect(channel.id).toBe(expectedId);
    });
  }

  for (const [input, expected] of [
    [{ type: 'Twitch', id: 'Channel1' }, 'bootstrapTwitch'],
    [{ type: 'Discord', id: '72136387162378123' }, 'bootstrapDiscord'],
    [{ type: 'Unknown', id: '123' }, 'bootstrapQuestion'],
  ]) {
    test_getChannelIcon(input as Channel, expected as string);
  }

  function test_getChannelIcon(channel: Channel, expectedIcon: string) {
    it(`should return the correct icon for channel ${channel.type}`, () => {
      expect(service.getChannelIcon(channel)).toBe(expectedIcon);
    });
  }

  for (const [channel, expectedId] of [
    [{ type: 'Twitch', id: 'Channel1' }, 'Twitch/Channel1'],
    [{ type: 'Discord', id: '72136387162378123' }, 'Discord/72136387162378123'],
    [{ type: 'Unknown', id: '123' }, 'Unknown/123'],
  ]) {
    test_getChannelId(channel as Channel, expectedId as string);
  }

  function test_getChannelId(channel: Channel, expectedId: string) {
    it(`should return the correct ID for channel type=${channel.type}, id=${channel.id}`, () => {
      expect(service.getChannelId(channel)).toBe(expectedId);
    });
  }
});
