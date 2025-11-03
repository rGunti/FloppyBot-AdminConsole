import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { bootstrapDiscord, bootstrapQuestion, bootstrapTwitch } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'fac-interface-icon',
  standalone: true,
  imports: [MatIconModule, NgIconComponent, MatTooltipModule],
  providers: [
    provideIcons({
      bootstrapTwitch,
      bootstrapDiscord,
      bootstrapQuestion,
    }),
  ],
  templateUrl: './interface-icon.component.html',
  styleUrl: './interface-icon.component.scss',
})
export class InterfaceIconComponent {
  @Input({ required: true }) interface!: string;

  get icon(): string {
    switch (this.interface) {
      case 'Twitch':
        return 'bootstrapTwitch';
      case 'Discord':
        return 'bootstrapDiscord';
      default:
        return 'bootstrapQuestion';
    }
  }
}
