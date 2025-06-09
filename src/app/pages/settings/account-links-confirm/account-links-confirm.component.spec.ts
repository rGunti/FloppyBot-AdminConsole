import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLinksConfirmComponent } from './account-links-confirm.component';

describe('AccountLinksConfirmComponent', () => {
  let component: AccountLinksConfirmComponent;
  let fixture: ComponentFixture<AccountLinksConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountLinksConfirmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountLinksConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
