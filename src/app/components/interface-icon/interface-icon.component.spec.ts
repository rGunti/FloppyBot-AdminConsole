import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceIconComponent } from './interface-icon.component';

describe('InterfaceIconComponent', () => {
  let component: InterfaceIconComponent;
  let fixture: ComponentFixture<InterfaceIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterfaceIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterfaceIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
