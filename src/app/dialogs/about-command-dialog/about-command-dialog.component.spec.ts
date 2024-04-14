import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCommandDialogComponent } from './about-command-dialog.component';

describe('AboutCommandDialogComponent', () => {
  let component: AboutCommandDialogComponent;
  let fixture: ComponentFixture<AboutCommandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCommandDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
