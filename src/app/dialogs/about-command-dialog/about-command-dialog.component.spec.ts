import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AboutCommandDialogComponent } from './about-command-dialog.component';

describe('AboutCommandDialogComponent', () => {
  let component: AboutCommandDialogComponent;
  let fixture: ComponentFixture<AboutCommandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCommandDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            command: {
              name: 'NotARealCommandName',
              description: 'NotARealCommandDescription',
              usage: 'NotARealCommandUsage',
              examples: ['NotARealCommandExample'],
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
