import { TestBed } from '@angular/core/testing';
import { ChannelIdPipe } from './channel-id.pipe';
import { ChannelService } from './channel.service';

describe('ChannelIdPipe', () => {
  let pipe: ChannelIdPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelIdPipe, ChannelService],
    });
    pipe = TestBed.inject(ChannelIdPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
