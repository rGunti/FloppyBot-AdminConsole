import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { FileHeader } from '../../api/entities';
import { FileSizePipe } from '../../utils/files/file-size.pipe';

import { DeleteFileDialogComponent } from './delete-file-dialog.component';

describe('DeleteFileDialogComponent', () => {
  let component: DeleteFileDialogComponent;
  let fixture: ComponentFixture<DeleteFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFileDialogComponent, MatDialogModule, MatButtonModule, FileSizePipe],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 'file-id',
            fileName: 'file-name',
            fileSize: 100,
            mimeType: 'image/png',
          } as FileHeader,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
