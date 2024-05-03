import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideFakeLocalStorageService } from '../../utils/local-storage';

import { ThemeButtonComponent } from './theme-button.component';

describe('ThemeButtonComponent', () => {
  let component: ThemeButtonComponent;
  let fixture: ComponentFixture<ThemeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeButtonComponent],
      providers: [provideFakeLocalStorageService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
