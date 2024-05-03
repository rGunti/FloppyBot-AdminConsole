import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStorageService, provideFakeLocalStorageService } from '../../utils/local-storage';

import { ThemeButtonComponent } from './theme-button.component';

describe('ThemeButtonComponent', () => {
  let component: ThemeButtonComponent;
  let fixture: ComponentFixture<ThemeButtonComponent>;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeButtonComponent],
      providers: [provideFakeLocalStorageService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeButtonComponent);
    component = fixture.componentInstance;

    // make sure local storage is reset
    localStorageService = TestBed.inject(LocalStorageService);
    localStorageService.clear();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save the theme preference to local storage', () => {
    expect(localStorageService.hasItem('alt-theme-enabled')).toBe(false);

    component.changeTheme();
    expect(localStorageService.getItem<boolean>('alt-theme-enabled')).toBe(true);

    component.changeTheme();
    expect(localStorageService.getItem<boolean>('alt-theme-enabled')).toBe(false);
  });
});
