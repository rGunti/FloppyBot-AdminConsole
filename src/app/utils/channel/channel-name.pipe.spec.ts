import { TestBed } from '@angular/core/testing';

import { ChannelService } from './channel.service';
import { ChannelNamePipe } from './channel-name.pipe';

describe('ChannelNamePipe', () => {
  let pipe: ChannelNamePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelNamePipe, ChannelService],
    });
    pipe = TestBed.inject(ChannelNamePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
