import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { ChannelService } from '../../utils/channel/channel.service';

@Component({
  selector: 'fac-debug',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDivider, MatIconModule, MatSlideToggle],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
})
export class DebugComponent {
  readonly channelService = inject(ChannelService);
}
