import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FloppyBotTitleStrategy extends TitleStrategy {
  private static readonly prefix = 'FloppyBot Admin Console';

  constructor(private readonly titleService: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = `${this.buildTitle(snapshot)}`;
    const title = `${pageTitle} [${FloppyBotTitleStrategy.prefix}]`;
    this.titleService.setTitle(title);
  }
}
