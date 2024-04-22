import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommandEditorDialogComponent } from './custom-command-editor-dialog.component';

describe('CustomCommandEditorDialogComponent', () => {
  let component: CustomCommandEditorDialogComponent;
  let fixture: ComponentFixture<CustomCommandEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCommandEditorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomCommandEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
