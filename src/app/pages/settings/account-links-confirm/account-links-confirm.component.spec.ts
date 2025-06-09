import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccountLinksConfirmComponent } from './account-links-confirm.component';

describe('AccountLinksConfirmComponent', () => {
  let component: AccountLinksConfirmComponent;
  let fixture: ComponentFixture<AccountLinksConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountLinksConfirmComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountLinksConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
