import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ApiKeyReport } from '../../api/entities';
import { DialogService } from '../../utils/dialog.service';

import { ShowApiKeyDialogComponent } from './show-api-key-dialog.component';

describe('ShowApiKeyDialogComponent', () => {
  let component: ShowApiKeyDialogComponent;
  let fixture: ComponentFixture<ShowApiKeyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowApiKeyDialogComponent, NoopAnimationsModule],
      providers: [
        DialogService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            accessKey: 'NotARealAccessKey',
          } as ApiKeyReport,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowApiKeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
