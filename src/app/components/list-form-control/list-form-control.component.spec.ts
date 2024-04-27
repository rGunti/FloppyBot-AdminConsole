import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ListFormControlComponent } from './list-form-control.component';

describe('ListFormControlComponent', () => {
  let component: ListFormControlComponent;
  let fixture: ComponentFixture<ListFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFormControlComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ListFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
