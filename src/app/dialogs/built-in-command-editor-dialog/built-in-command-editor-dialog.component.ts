import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import {
  bootstrapClockHistory,
  bootstrapExclamationLg,
  bootstrapPlus,
  bootstrapShieldCheck,
  bootstrapTrash,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { startWith } from 'rxjs';

import { CommandConfiguration, CommandReport, CooldownConfiguration, PrivilegeLevel } from '../../api/entities';
import { PrivilegeIconComponent } from '../../components/privilege-icon/privilege-icon.component';
import { PrivilegeService } from '../../utils/privilege.service';

interface BuiltInCommandEditorDialogData {
  channelId: string;
  report: CommandReport;
}

@Component({
  selector: 'fac-built-in-command-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    NgIconComponent,
    PrivilegeIconComponent,
  ],
  providers: [
    provideIcons({
      bootstrapPlus,
      bootstrapTrash,
      bootstrapExclamationLg,
      bootstrapShieldCheck,
      bootstrapClockHistory,
    }),
  ],
  templateUrl: './built-in-command-editor-dialog.component.html',
  styleUrl: './built-in-command-editor-dialog.component.scss',
})
export class BuiltInCommandEditorDialogComponent {
  private readonly commandData: BuiltInCommandEditorDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly privilegeService = inject(PrivilegeService);

  readonly form = this.formBuilder.group({
    disabled: [false],
    privilegeLevel: [null as PrivilegeLevel | null],
    customCooldown: [false],
    cooldowns: this.formBuilder.array([]),
  });

  readonly commandName = this.commandData.report.command.name;
  readonly allPrivileges = this.privilegeService.privilegeItems;
  readonly defaultPrivilegeLevel = this.commandData.report.command.minPrivilegeLevel;
  readonly defaultPrivilegeIcon = this.defaultPrivilegeLevel
    ? this.privilegeService.getPrivilegeIconSvg(this.defaultPrivilegeLevel)
    : undefined;

  constructor() {
    this.form
      .get('customCooldown')!
      .valueChanges.pipe(startWith(this.form.get('customCooldown')!.value))
      .subscribe((customCooldown) => {
        if (customCooldown) {
          this.form.get('cooldowns')!.enable();
        } else {
          this.form.get('cooldowns')!.disable();
        }
      });

    const customCooldowns = this.commandData.report.configuration?.customCooldownConfiguration ?? [];
    customCooldowns.forEach((cooldown) => {
      this.cooldownArray.push(this.constructCooldownForm(cooldown));
    });
    this.form.patchValue({
      disabled: this.commandData.report.configuration?.disabled ?? false,
      privilegeLevel: this.commandData.report.configuration?.requiredPrivilegeLevel ?? null,
      customCooldown: this.commandData.report.configuration?.customCooldown ?? false,
      cooldowns: customCooldowns,
    });
  }

  get cooldownArray(): FormArray {
    return this.form.get('cooldowns') as FormArray;
  }

  addCooldown(): void {
    this.cooldownArray.push(this.constructCooldownForm({ privilegeLevel: 'Viewer', cooldownMs: 0 }));
  }

  removeCooldown(index: number): void {
    this.cooldownArray.removeAt(index);
  }

  saveChanges(): void {
    const formValue = this.form.value;
    const configuration: CommandConfiguration = {
      id: null!,
      channelId: this.commandData.channelId,
      commandName: this.commandName,
      disabled: formValue.disabled || false,
      requiredPrivilegeLevel: formValue.privilegeLevel,
      customCooldown: formValue.customCooldown || false,
      customCooldownConfiguration: formValue.cooldowns?.filter((c) => !!c).map((c) => c as CooldownConfiguration) || [],
    };

    this.dialogRef.close(configuration);
  }

  resetSettings(): void {
    // TODO: Ask user for confirmation
    this.dialogRef.close(null);
  }

  private constructCooldownForm(cooldown: CooldownConfiguration) {
    return this.formBuilder.group({
      privilegeLevel: [cooldown.privilegeLevel, [Validators.required]],
      cooldownMs: [cooldown.cooldownMs, [Validators.required]],
    });
  }
}
