import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFileDialogComponent } from './delete-file-dialog.component';

describe('DeleteFileDialogComponent', () => {
  let component: DeleteFileDialogComponent;
  let fixture: ComponentFixture<DeleteFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
