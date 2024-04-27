import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Quote } from '../../api/entities';

import { DeleteQuoteDialogComponent } from './delete-quote-dialog.component';

describe('DeleteQuoteDialogComponent', () => {
  let component: DeleteQuoteDialogComponent;
  let fixture: ComponentFixture<DeleteQuoteDialogComponent>;
  const quote: Quote = {
    id: 'NotARealId',
    quoteId: 123,
    quoteText: 'Not A Real Quote',
    quoteContext: 'Not A Real Context',
    channelMappingId: 'Not A Real Channel Mapping Id',
    createdAt: new Date(),
    createdBy: 'Not A Real User',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteQuoteDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: quote,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
