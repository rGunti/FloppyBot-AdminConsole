import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApiKeyDialogComponent } from './show-api-key-dialog.component';

describe('ShowApiKeyDialogComponent', () => {
  let component: ShowApiKeyDialogComponent;
  let fixture: ComponentFixture<ShowApiKeyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowApiKeyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowApiKeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
