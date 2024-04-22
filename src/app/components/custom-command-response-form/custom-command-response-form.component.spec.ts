import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommandResponseFormComponent } from './custom-command-response-form.component';

describe('CustomCommandResponseFormComponent', () => {
  let component: CustomCommandResponseFormComponent;
  let fixture: ComponentFixture<CustomCommandResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCommandResponseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomCommandResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
