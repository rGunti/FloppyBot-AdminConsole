import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FileApiService } from '../../api/file-api.service';

import { FilePickerDialogComponent, FilePickerDialogOptions } from './file-picker-dialog.component';

describe('FilePickerDialogComponent', () => {
  let component: FilePickerDialogComponent;
  let fixture: ComponentFixture<FilePickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePickerDialogComponent],
      providers: [
        FileApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            restrictToChannel: 'NotARealChannel',
            restrictToTypes: ['NotARealType'],
          } as FilePickerDialogOptions,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
