import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { bootstrapBan } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { map, shareReplay } from 'rxjs';

import { CommandApiService } from '../../api/command-api.service';
import { CommandInfo } from '../../api/entities';
import { InterfaceIconComponent } from '../../components/interface-icon/interface-icon.component';
import { PrivilegeIconComponent } from '../../components/privilege-icon/privilege-icon.component';

@Component({
  selector: 'fac-about-command-dialog',
  standalone: true,
  templateUrl: './about-command-dialog.component.html',
  styleUrl: './about-command-dialog.component.scss',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    PrivilegeIconComponent,
    InterfaceIconComponent,
    MatIcon,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      bootstrapBan,
    }),
  ],
})
export class AboutCommandDialogComponent {
  private readonly initialData: {
    command: CommandInfo;
    channelId: string;
  } = inject(MAT_DIALOG_DATA);
  private readonly commandApi: CommandApiService = inject(CommandApiService);

  readonly command = this.initialData.command;
  readonly channelId = this.initialData.channelId;

  readonly report$ = this.commandApi.getCommandReport(this.channelId, this.command.name).pipe(shareReplay(1));
  readonly command$ = this.report$.pipe(map((report) => report.command));
  readonly config$ = this.report$.pipe(map((report) => report.configuration));

  readonly hasPrivilegeRestrictions$ = this.command$.pipe(
    map((command) => !!command.minPrivilegeLevel && command.minPrivilegeLevel !== 'Unknown'),
  );
  readonly commandDisabled$ = this.config$.pipe(map((config) => !config || !!config.disabled));
}
