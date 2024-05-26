import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogLevelComponent } from './log-level.component';

describe('LogLevelComponent', () => {
  let component: LogLevelComponent;
  let fixture: ComponentFixture<LogLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
