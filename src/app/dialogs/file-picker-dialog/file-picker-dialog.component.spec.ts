import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePickerDialogComponent } from './file-picker-dialog.component';

describe('FilePickerDialogComponent', () => {
  let component: FilePickerDialogComponent;
  let fixture: ComponentFixture<FilePickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePickerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
