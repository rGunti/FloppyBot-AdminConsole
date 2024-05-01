import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVersionComponent } from './app-version.component';

describe('AppVersionComponent', () => {
  let component: AppVersionComponent;
  let fixture: ComponentFixture<AppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppVersionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
