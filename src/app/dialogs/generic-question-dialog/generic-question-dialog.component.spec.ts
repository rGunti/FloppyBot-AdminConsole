import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GenericQuestionDialogComponent, GenericQuestionDialogData } from './generic-question-dialog.component';

describe('GenericQuestionDialogComponent', () => {
  let component: GenericQuestionDialogComponent;
  let fixture: ComponentFixture<GenericQuestionDialogComponent>;
  const data: GenericQuestionDialogData = {
    title: 'Test',
    content: 'Test',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericQuestionDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: data,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
