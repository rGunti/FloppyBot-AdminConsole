import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegenerateApiKeyDialogComponent } from './regenerate-api-key-dialog.component';

describe('RegenerateApiKeyDialogComponent', () => {
  let component: RegenerateApiKeyDialogComponent;
  let fixture: ComponentFixture<RegenerateApiKeyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegenerateApiKeyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegenerateApiKeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
