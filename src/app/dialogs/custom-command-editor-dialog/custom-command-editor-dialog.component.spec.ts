import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NEVER } from 'rxjs';

import { CustomCommand } from '../../api/entities';

import { CustomCommandEditorDialogComponent } from './custom-command-editor-dialog.component';

describe('CustomCommandEditorDialogComponent', () => {
  let component: CustomCommandEditorDialogComponent;
  let fixture: ComponentFixture<CustomCommandEditorDialogComponent>;

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
    allowCounterOperations: false,
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
