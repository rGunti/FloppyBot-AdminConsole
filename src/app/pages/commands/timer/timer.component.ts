import { Clipboard } from '@angular/cdk/clipboard';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapChevronExpand,
  bootstrapDownload,
  bootstrapPlus,
  bootstrapTrash,
  bootstrapUpload,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BehaviorSubject, filter, map, merge, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CommandApiService } from '../../../api/command-api.service';
import { TimerMessageConfig } from '../../../api/entities';
import { ChannelSelectorComponent } from '../../../components/channel-selector/channel-selector.component';
import {
  ImportTextDialogComponent,
  ImportTextDialogData,
} from '../../../dialogs/import-text-dialog/import-text-dialog.component';
import { ChannelService } from '../../../utils/channel/channel.service';
import { DialogService } from '../../../utils/dialog.service';

function isMessage(message: string | null | undefined): boolean {
  if (message === null || message === undefined) {
    return false;
  }
  return message.trim().length > 0;
}

function validateMessage(group: AbstractControl): ValidationErrors | null {
  const messageCount =
    (group.get('messages')! as FormArray).value.map((i: { message: string }) => i.message).filter(isMessage).length ||
    0;
  const minMessages = group.get('minMessages')!.value || 0;

  if (minMessages <= 0) {
    return null;
  }

  if (messageCount < 1) {
    return { minMessages: true };
  }

  return null;
}

function validateInterval(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value < 5 && value !== 0) {
    return { minInterval: true };
  }

  return null;
}

function generateNewRow(
  id: string = '',
  message: string = '',
): FormGroup<{
  id: FormControl<string | null>;
  message: FormControl<string | null>;
}> {
  return new FormGroup({
    id: new FormControl(id),
    message: new FormControl(message, [Validators.required]),
  });
}

function generateUniqueId(): string {
  return Math.random().toString(36).substring(2);
}

@Component({
  selector: 'fac-timer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIconComponent,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    ChannelSelectorComponent,
    ReactiveFormsModule,
    NgIconComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  providers: [
    provideIcons({
      bootstrapPlus,
      bootstrapTrash,
      bootstrapChevronExpand,
      bootstrapUpload,
      bootstrapDownload,
    }),
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  readonly showDebug = environment.enableDebugTools;

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly messageCountRefresh$ = new BehaviorSubject<void>(undefined);

  private readonly channelService = inject(ChannelService);
  private readonly commandApiService = inject(CommandApiService);
  private readonly dialog = inject(DialogService);

  private readonly clipboard = inject(Clipboard);

  readonly channelInterfaceFilter = ['Twitch'];
  readonly form = new FormGroup(
    {
      channelId: new FormControl('', [Validators.required]),
      messages: new FormArray([generateNewRow()]),
      interval: new FormControl(0, [Validators.required, Validators.min(5)]),
      minMessages: new FormControl(0, [Validators.required, Validators.min(0), validateInterval]),
    },
    { validators: [validateMessage] },
  );

  readonly messageCount$ = merge(this.messageCountRefresh$, this.form.controls.messages.valueChanges).pipe(
    startWith(undefined),
    map(() => this.form.controls.messages.value),
    map((messages) => messages.map((i) => i.message).filter(isMessage).length || 0),
    startWith(0),
  );
  readonly messageRows$ = this.messageCount$.pipe(
    map((count) => Math.max(count, 2) + 1),
    startWith(3),
  );

  readonly timerMessagesDisabled$ = merge(this.messageCountRefresh$, this.form.controls.messages.valueChanges).pipe(
    startWith(undefined),
    map(() => this.form.controls.minMessages.value),
    map((interval) => (interval || -1) <= 0),
  );

  readonly selectedChannel$ = this.channelService.selectedChannelId$.pipe(
    map((channelId) => {
      if (!channelId) {
        return null;
      }

      const parsedChannel = this.channelService.parseChannelFromChannelId(channelId);
      return this.channelInterfaceFilter.indexOf(parsedChannel.interface) >= 0 ? channelId : null;
    }),
  );
  readonly config$ = this.refresh$.pipe(
    switchMap(() => this.selectedChannel$),
    switchMap((channelId) => {
      if (!channelId) {
        return of(null);
      }

      return this.commandApiService.getTimerConfigForChannel(channelId);
    }),
    tap((config) => {
      if (!config) {
        console.log('TimerComponent', 'No config found');
        return;
      }

      console.log('TimerComponent', 'Config loaded, resetting form', config);
      this.form.controls.messages.clear();
      this.form.reset();

      console.log('TimerComponent', 'Patching form with new values', config);
      const messages = config.messages.map((i) => ({ id: `${config.channelId}/${generateUniqueId()}`, message: i }));
      this.form.controls.messages.controls.push(...messages.map((i) => generateNewRow(i.id, i.message)));
      this.form.patchValue({
        channelId: config.channelId,
        messages,
        interval: config.interval,
        minMessages: config.minMessages,
      });
      this.messageCountRefresh$.next();
    }),
    shareReplay(1),
  );

  onSaveChanges(): void {
    if (this.form.invalid) {
      if (this.form.errors && this.form.errors['minMessages']) {
        this.dialog.error(
          'Please provide at least one message or disable timer messages by setting "Min messages" to 0',
        );
      } else {
        this.dialog.error('Please fill out all required fields');
      }
      return;
    }

    const formValue = this.form.value;
    const config: TimerMessageConfig = {
      channelId: formValue.channelId!,
      messages: (formValue.messages || [])
        .map((i) => i.message)
        .filter(isMessage)
        .map((message) => `${message}`),
      interval: formValue.interval!,
      minMessages: formValue.minMessages!,
    };

    this.selectedChannel$
      .pipe(
        take(1),
        filter((channel) => !!channel),
        switchMap((channel) => this.commandApiService.setTimerConfigForChannel(channel!, config)),
        tap(() => this.refresh$.next()),
      )
      .subscribe(() => {
        this.dialog.success('Timer Messages saved');
      });
  }

  addMessage(): void {
    this.selectedChannel$
      .pipe(
        take(1),
        filter((channel) => !!channel),
      )
      .subscribe((channel) => {
        const newId = `${channel}/${generateUniqueId()}`;
        this.form.controls.messages.push(generateNewRow(newId));
        this.messageCountRefresh$.next();
      });
  }

  removeMessage(index: number) {
    this.form.controls.messages.removeAt(index);
    this.messageCountRefresh$.next();
  }

  onMessageDropped(event: CdkDragDrop<unknown, unknown, unknown>) {
    console.log('TimerComponent', 'onMessageDropped()', event);
    const messages = <{ id: string | null; message: string | null }[]>this.form.controls.messages.value;
    moveItemInArray(messages, event.previousIndex, event.currentIndex);
    this.form.controls.messages.setValue(messages);
  }

  importMessages(): void {
    this.dialog
      .show<string | null | undefined>(
        ImportTextDialogComponent,
        new ImportTextDialogData(
          'Import Timer Messages',
          'Enter the messages to be imported below (one per line). Note that these messages will be added at the end of the current list. No messages will be removed.',
        ),
      )
      .pipe(
        filter((importedText) => !!importedText),
        switchMap((importedText) => this.selectedChannel$.pipe(map((channel) => [channel, importedText]))),
      )
      .subscribe(([channel, importedText]) => {
        const messages = importedText!
          .split('\n')
          .map((message) => message.trim())
          .filter(isMessage)
          .map((message) => ({ id: `${channel}/${generateUniqueId()}`, message }));
        this.form.controls.messages.controls.push(
          ...messages.map(
            (message) =>
              new FormGroup({
                id: new FormControl(message.id),
                message: new FormControl(message.message, [Validators.required]),
              }),
          ),
        );
        this.form.patchValue({
          ...this.form.value,
          messages: [...this.form.controls.messages.value, ...messages],
        });
      });
  }

  exportMessages(): void {
    const messages = this.form.controls.messages.value.map((i) => i.message).filter(isMessage);

    this.clipboard.copy(messages.join('\n'));
    this.dialog.success(`${messages.length} message(s) copied to clipboard`);
  }
}
