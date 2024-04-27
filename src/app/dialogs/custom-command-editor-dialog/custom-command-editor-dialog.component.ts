import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrap1Square,
  bootstrapChatQuote,
  bootstrapExclamationLg,
  bootstrapFastForwardBtn,
  bootstrapFastForwardFill,
  bootstrapLock,
  bootstrapMusicNote,
  bootstrapPlayBtn,
  bootstrapPlayFill,
  bootstrapPlus,
  bootstrapShuffle,
  bootstrapTrash,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map, Observable, startWith } from 'rxjs';

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
    PrivilegeIconComponent,
    CustomCommandResponseFormComponent,
    ListFormControlComponent,
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
    }),
  ],
  templateUrl: './custom-command-editor-dialog.component.html',
  styleUrl: './custom-command-editor-dialog.component.scss',
})
export class CustomCommandEditorDialogComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private readonly formBuilder = inject(FormBuilder);
  private readonly privilegeService = inject(PrivilegeService);
  private readonly channelService = inject(ChannelService);

  readonly ownerChannel$: Observable<string> = this.channelService.selectedChannelId$.pipe(
    filter((channelId) => !!channelId),
    map((channelId) => channelId!),
  );

  readonly form = this.formBuilder.group({
    id: [this.command.id],
    name: ['', [Validators.required]],
    aliases: [[] as string[]],
    responseMode: ['First' as CommandResponseMode, [Validators.required]],
    responses: this.formBuilder.array(this.command.responses.map((response) => this.constructResponseForm(response))),
    limitations: this.formBuilder.group({
      minLevel: ['Viewer' as PrivilegeLevel, [Validators.required]],
      cooldown: this.formBuilder.array(
        this.command.limitations.cooldown.map((cooldown) => this.constructCooldownForm(cooldown)),
      ),
      limitedToUsers: [[] as string[]],
    }),
  });

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

  constructor(@Inject(MAT_DIALOG_DATA) readonly command: CustomCommand) {
    console.log('CustomCommandEditorDialog', 'constructor', command);
    this.form.patchValue(command);
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
      default:
        return '';
    }
  }

  private constructResponseForm(response: CommandResponse) {
    return this.formBuilder.group({
      type: [response.type, [Validators.required]],
      content: [response.content, [Validators.required]],
      auxiliaryContent: [response.auxiliaryContent],
    });
  }

  private constructCooldownForm(cooldown: CooldownDescription) {
    return this.formBuilder.group({
      level: [cooldown.level, [Validators.required]],
      milliseconds: [cooldown.milliseconds, [Validators.required]],
    });
  }

  addResponse(responseType: CommandResponseType): void {
    const newResponse: CommandResponse = { type: responseType, content: '' };
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
}
