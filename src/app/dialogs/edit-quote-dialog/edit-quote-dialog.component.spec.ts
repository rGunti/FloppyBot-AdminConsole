import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuoteDialogComponent } from './edit-quote-dialog.component';

describe('EditQuoteDialogComponent', () => {
  let component: EditQuoteDialogComponent;
  let fixture: ComponentFixture<EditQuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuoteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
