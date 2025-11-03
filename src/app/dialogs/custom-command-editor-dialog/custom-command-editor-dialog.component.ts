import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrap1Square,
  bootstrap9Square,
  bootstrapChatQuote,
  bootstrapExclamationLg,
  bootstrapFastForwardBtn,
  bootstrapFastForwardFill,
  bootstrapLock,
  bootstrapMusicNote,
  bootstrapPersonVideo3,
  bootstrapPlayBtn,
  bootstrapPlayFill,
  bootstrapPlus,
  bootstrapShuffle,
  bootstrapTrash,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map, Observable, startWith, takeUntil } from 'rxjs';

import { CommandApiService } from '../../api/command-api.service';
import {
  CommandResponse,
  CommandResponseMode,
  CommandResponseType,
  CooldownDescription,
  CustomCommand,
  PrivilegeLevel,
} from '../../api/entities';
import { CustomCommandResponseFormComponent } from '../../components/custom-command-response-form/custom-command-response-form.component';
import { ListFormControlComponent } from '../../components/list-form-control/list-form-control.component';
import { PrivilegeIconComponent } from '../../components/privilege-icon/privilege-icon.component';
import { ChannelService } from '../../utils/channel/channel.service';
import { CustomCommandValidators, FormErrorPipe } from '../../utils/forms';
import { PrivilegeService } from '../../utils/privilege.service';

@Component({
  selector: 'fac-custom-command-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    NgIconComponent,
    MatTabsModule,
    MatDividerModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    PrivilegeIconComponent,
    CustomCommandResponseFormComponent,
    ListFormControlComponent,
    FormErrorPipe,
  ],
  providers: [
    provideIcons({
      bootstrapExclamationLg,
      bootstrap1Square,
      bootstrapShuffle,
      bootstrapPlayFill,
      bootstrapFastForwardFill,
      bootstrapPlayBtn,
      bootstrapFastForwardBtn,
      bootstrapTrash,
      bootstrapPlus,
      bootstrapChatQuote,
      bootstrapLock,
      bootstrapMusicNote,
      bootstrap9Square,
      bootstrapPersonVideo3,
    }),
  ],
  templateUrl: './custom-command-editor-dialog.component.html',
  styleUrl: './custom-command-editor-dialog.component.scss',
})
export class CustomCommandEditorDialogComponent {
  readonly command = inject<CustomCommand>(MAT_DIALOG_DATA);

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private readonly formBuilder = inject(FormBuilder);
  private readonly privilegeService = inject(PrivilegeService);
  private readonly channelService = inject(ChannelService);
  private readonly commandApi = inject(CommandApiService);
  private readonly dialogRef = inject(MatDialogRef<CustomCommandEditorDialogComponent>);

  readonly ownerChannel$: Observable<string> = this.channelService.selectedChannelId$.pipe(
    filter((channelId) => !!channelId),
    map((channelId) => channelId!),
  );

  readonly form = this.formBuilder.group({
    id: [this.command.id],
    name: this.formBuilder.control(this.command.name, {
      validators: [Validators.required, CustomCommandValidators.customCommandName],
      asyncValidators: [
        CustomCommandValidators.uniqueCommandName(this.ownerChannel$, this.command.id, this.commandApi),
      ],
      // To reduce the amount of validation requests to the backend, we only validate on blur.
      updateOn: 'blur',
    }),
    aliases: this.formBuilder.control(this.command.aliases, {
      validators: [CustomCommandValidators.customCommandNameList],
      // To reduce the amount of validation requests to the backend, we only validate on blur.
      updateOn: 'blur',
    }),
    responseMode: ['First' as CommandResponseMode, [Validators.required]],
    responses: this.formBuilder.array(
      this.command.responses.map((response) => this.constructResponseForm(response)),
      [Validators.required, Validators.minLength(1)],
    ),
    limitations: this.formBuilder.group(
      {
        minLevel: ['Viewer' as PrivilegeLevel, [Validators.required]],
        cooldown: this.formBuilder.array(
          this.command.limitations.cooldown.map((cooldown) => this.constructCooldownForm(cooldown)),
        ),
        limitedToUsers: [[] as string[]],
      },
      [Validators.required],
    ),
    allowCounterOperations: [this.command.allowCounterOperations],
    counter: this.formBuilder.group({
      value: [this.command.counter?.value],
    }),
  });

  readonly changeCounterForm = this.formBuilder.control(false);

  private readonly selectedCommandMode$ = this.form.get('responseMode')!.valueChanges;
  readonly selectedModeIcon$ = this.selectedCommandMode$.pipe(
    startWith(this.command.responseMode || 'First'),
    map((mode) => {
      switch (mode) {
        case 'First':
          return bootstrapPlayFill;
        case 'PickOneRandom':
          return bootstrapShuffle;
        case 'All':
          return bootstrapFastForwardFill;
        default:
          return '';
      }
    }),
  );
  readonly selectedModeTip$ = this.selectedCommandMode$.pipe(
    startWith(this.command.responseMode || 'First'),
    map((mode) => {
      switch (mode) {
        case 'First':
          return 'Runs the first available response';
        case 'PickOneRandom':
          return 'Picks one of the available responses at random';
        case 'All':
          return 'Runs all responses in sequence';
        default:
          return '';
      }
    }),
  );

  readonly allPrivileges = this.privilegeService.privilegeItems;
  readonly selectedPrivilegeLevel$ = this.form
    .get('limitations.minLevel')!
    .valueChanges.pipe(startWith(this.command.limitations.minLevel || 'Unknown'));

  readonly limitedToUsers = this.form.get('limitations.limitedToUsers')!.value || ([] as string[]);

  constructor() {
    const command = this.command;

    console.log('CustomCommandEditorDialog', 'constructor', command);
    this.form.patchValue(command);

    this.changeCounterForm.valueChanges.pipe(takeUntil(this.dialogRef.afterClosed()), startWith(false)).subscribe({
      next: (value) => {
        if (value) {
          this.form.get('counter')!.enable();
        } else {
          this.form.get('counter')!.disable();
        }
      },
    });
  }

  get responsesArray(): FormArray {
    return this.form.get('responses') as FormArray;
  }

  get cooldownArray(): FormArray {
    return this.form.get('limitations.cooldown') as FormArray;
  }

  getResponseForm(form: AbstractControl): FormGroup {
    return form as FormGroup;
  }

  getResponseIcon(form: AbstractControl): string {
    const fg = form as FormGroup;
    const type = fg.get('type')!.value as CommandResponseType;
    switch (type) {
      case 'Text':
        return bootstrapChatQuote;
      case 'Sound':
        return bootstrapMusicNote;
      case 'Visual':
        return bootstrapPersonVideo3;
      default:
        return '';
    }
  }

  private constructResponseForm(response: CommandResponse) {
    return this.formBuilder.group({
      type: [response.type, [Validators.required]],
      content: [response.content, [Validators.required, Validators.maxLength(300)]],
      auxiliaryContent: [response.auxiliaryContent],
      sendAsReply: [response.sendAsReply],
    });
  }

  private constructCooldownForm(cooldown: CooldownDescription) {
    return this.formBuilder.group({
      level: [cooldown.level, [Validators.required]],
      milliseconds: [cooldown.milliseconds, [Validators.required]],
    });
  }

  addResponse(responseType: CommandResponseType): void {
    const newResponse: CommandResponse = { type: responseType, content: '', sendAsReply: true };
    this.responsesArray.push(this.constructResponseForm(newResponse));
  }

  removeResponse(index: number): void {
    this.responsesArray.removeAt(index);
  }

  addCooldown(): void {
    this.cooldownArray.push(this.constructCooldownForm({ level: 'Viewer', milliseconds: 0 }));
  }

  removeCooldown(index: number): void {
    this.cooldownArray.removeAt(index);
  }

  saveChanges(): void {
    const formValue = this.form.value;
    if (!this.changeCounterForm.value) {
      formValue.counter = undefined;
    }

    this.dialogRef.close(formValue);
  }
}
