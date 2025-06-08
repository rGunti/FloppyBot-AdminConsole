import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLinksComponent } from './account-links.component';

describe('AccountLinksComponent', () => {
  let component: AccountLinksComponent;
  let fixture: ComponentFixture<AccountLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
