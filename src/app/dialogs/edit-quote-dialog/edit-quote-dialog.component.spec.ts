import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EditQuoteDialogComponent } from './edit-quote-dialog.component';

describe('EditQuoteDialogComponent', () => {
  let component: EditQuoteDialogComponent;
  let fixture: ComponentFixture<EditQuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuoteDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            quote: {
              id: 'NotARealId',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
