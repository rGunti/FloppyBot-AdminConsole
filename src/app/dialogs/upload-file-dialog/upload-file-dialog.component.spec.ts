import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileApiService } from '../../api/file-api.service';
import { DialogService } from '../../utils/dialog.service';

import { UploadFileDialogComponent } from './upload-file-dialog.component';

describe('UploadFileDialogComponent', () => {
  let component: UploadFileDialogComponent;
  let fixture: ComponentFixture<UploadFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FileApiService,
        DialogService,
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: 'NotARealChannel',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
