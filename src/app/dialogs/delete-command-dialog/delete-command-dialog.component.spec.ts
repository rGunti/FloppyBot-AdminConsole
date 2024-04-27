import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteCommandDialogComponent } from './delete-command-dialog.component';

describe('DeleteCommandDialogComponent', () => {
  let component: DeleteCommandDialogComponent;
  let fixture: ComponentFixture<DeleteCommandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCommandDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            command: {
              id: 'NotARealId',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
