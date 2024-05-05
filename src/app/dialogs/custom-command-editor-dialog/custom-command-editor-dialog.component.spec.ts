import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NEVER, never, of } from 'rxjs';

import { CustomCommand } from '../../api/entities';
import { DialogService } from '../../utils/dialog.service';

import { CustomCommandEditorDialogComponent } from './custom-command-editor-dialog.component';

describe('CustomCommandEditorDialogComponent', () => {
  let component: CustomCommandEditorDialogComponent;
  let fixture: ComponentFixture<CustomCommandEditorDialogComponent>;
  let service: DialogService;

  const customCommand: CustomCommand = {
    id: 'NotARealId',
    name: 'NotARealName',
    aliases: [],
    limitations: {
      cooldown: [],
      limitedToUsers: [],
      minLevel: 'Viewer',
    },
    responseMode: 'First',
    responses: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCommandEditorDialogComponent, NoopAnimationsModule, MatDialogModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: customCommand,
        },
        {
          provide: MatDialogRef,
          useValue: {
            afterClosed: () => NEVER,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCommandEditorDialogComponent);
    service = TestBed.inject(DialogService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
