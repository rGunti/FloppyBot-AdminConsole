import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapFloppy2 } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'fac-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, NgIconComponent],
  providers: [
    provideIcons({
      bootstrapFloppy2,
    }),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
