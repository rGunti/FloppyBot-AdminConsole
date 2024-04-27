import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCommandDialogComponent } from './delete-command-dialog.component';

describe('DeleteCommandDialogComponent', () => {
  let component: DeleteCommandDialogComponent;
  let fixture: ComponentFixture<DeleteCommandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCommandDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
