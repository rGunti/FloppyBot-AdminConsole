import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GlobalLoadingIndicatorComponent } from './components/global-loading-indicator/global-loading-indicator.component';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'fac-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, GlobalLoadingIndicatorComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
