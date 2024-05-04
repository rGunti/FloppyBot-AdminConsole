import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuiltInCommandEditorDialogComponent } from './built-in-command-editor-dialog.component';

describe('BuiltInCommandEditorDialogComponent', () => {
  let component: BuiltInCommandEditorDialogComponent;
  let fixture: ComponentFixture<BuiltInCommandEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuiltInCommandEditorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuiltInCommandEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
