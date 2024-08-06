import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TimerMessageConfig } from '../../../api/entities';
import { FAKE_DATA_HOST } from '../../../interceptors/fake-data.interceptor';
import { ChannelService } from '../../../utils/channel/channel.service';

import { TimerComponent } from './timer.component';

const CHANNEL_ID = 'Twitch/Channel1';
const RESPONSE_DATA: TimerMessageConfig = {
  channelId: CHANNEL_ID,
  messages: ['Message 001', 'Message 002', 'Message 003'],
  minMessages: 10,
  interval: 5,
};

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let httpTestingController: HttpTestingController;
  let channelService: ChannelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    channelService = TestBed.inject(ChannelService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    channelService.updateSelectedChannelId(CHANNEL_ID);
    const req = httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/commands/config/${CHANNEL_ID}/timer`);
    req.forEach((r) => r.flush(RESPONSE_DATA));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list all messages', waitForAsync(() => {
    const form = component.form;
    expect(form.controls.channelId.value).toBe(CHANNEL_ID);
    expect(form.controls.minMessages.value).toBe(10);
    expect(form.controls.interval.value).toBe(5);
    expect(form.controls.messages.value.map((i) => i.message)).toEqual(['Message 001', 'Message 002', 'Message 003']);

    const elements = fixture.debugElement.queryAll(By.css('mat-form-field.message-row'));
    expect(elements.length).withContext('Expect one row per message').toBe(3);
    elements.forEach((element, index) => {
      const textarea = element.query(By.css('textarea'));
      expect(textarea.nativeElement.value).toBe(RESPONSE_DATA.messages[index]);
    });
  }));

  it('should update the message if the text area changes', waitForAsync(() => {
    const form = component.form;

    const elements = fixture.debugElement.queryAll(By.css('mat-form-field.message-row'));
    const textArea: HTMLTextAreaElement = elements[elements.length - 1].query(By.css('textarea')).nativeElement;
    textArea.value = 'My changed message';
    textArea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(form.controls.messages.value.map((i) => i.message)).toEqual([
      'Message 001',
      'Message 002',
      'My changed message',
    ]);
  }));

  it('should add a new message row', waitForAsync(() => {
    const form = component.form;

    const addButton = fixture.debugElement.query(By.css('button.add-message-button'));
    addButton.nativeElement.click();
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('mat-form-field.message-row'));
    expect(elements.length).withContext('Expect one row per message').toBe(4);

    const textArea: HTMLTextAreaElement = elements[elements.length - 1].query(By.css('textarea')).nativeElement;
    textArea.value = 'My new message';
    textArea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(form.controls.channelId.value).toBe(CHANNEL_ID);
    expect(form.controls.minMessages.value).toBe(10);
    expect(form.controls.interval.value).toBe(5);
    expect(form.controls.messages.value.map((i) => i.message)).toEqual([
      'Message 001',
      'Message 002',
      'Message 003',
      'My new message',
    ]);
  }));

  it('should remove a message row', waitForAsync(() => {
    const form = component.form;

    const elements = fixture.debugElement.queryAll(By.css('mat-form-field.message-row'));
    elements[0].query(By.css('button.remove-message-button')).nativeElement.click();
    fixture.detectChanges();

    expect(form.controls.messages.value.map((i) => i.message)).toEqual(['Message 002', 'Message 003']);
  }));
});
