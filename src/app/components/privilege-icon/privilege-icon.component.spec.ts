import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeIconComponent } from './privilege-icon.component';

describe('PrivilegeIconComponent', () => {
  let component: PrivilegeIconComponent;
  let fixture: ComponentFixture<PrivilegeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivilegeIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
