import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualCommandResponseFormComponent } from './visual-command-response-form.component';

describe('VisualCommandResponseFormComponent', () => {
  let component: VisualCommandResponseFormComponent;
  let fixture: ComponentFixture<VisualCommandResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualCommandResponseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualCommandResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
