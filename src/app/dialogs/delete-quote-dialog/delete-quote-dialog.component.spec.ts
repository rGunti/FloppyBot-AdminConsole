import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQuoteDialogComponent } from './delete-quote-dialog.component';

describe('DeleteQuoteDialogComponent', () => {
  let component: DeleteQuoteDialogComponent;
  let fixture: ComponentFixture<DeleteQuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteQuoteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
