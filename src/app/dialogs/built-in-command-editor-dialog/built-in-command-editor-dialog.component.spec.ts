import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BuiltInCommandEditorDialogComponent } from './built-in-command-editor-dialog.component';

describe('BuiltInCommandEditorDialogComponent', () => {
  let component: BuiltInCommandEditorDialogComponent;
  let fixture: ComponentFixture<BuiltInCommandEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuiltInCommandEditorDialogComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            channelId: 'Twitch/AFakeChannel',
            report: {
              command: {},
              configuration: {
                id: 'Twitch/AFakeChannel/!fakeCommand',
                channelId: 'Twitch/AFakeChannel',
                commandName: '!fakeCommand',
                disabled: false,
                customCooldown: false,
                customCooldownConfiguration: [],
                privilegeLevel: 'Moderator',
              },
            },
          },
        },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuiltInCommandEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
