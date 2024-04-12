import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

import { ChannelService } from '../../utils/channel/channel.service';

@Component({
  selector: 'fac-debug',
  standalone: true,
  imports: [CommonModule, MatButton, MatDivider],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
})
export class DebugComponent {
  readonly channelService = inject(ChannelService);
}
