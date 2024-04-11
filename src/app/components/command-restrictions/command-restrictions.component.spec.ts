import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandRestrictionsComponent } from './command-restrictions.component';

describe('CommandRestrictionsComponent', () => {
  let component: CommandRestrictionsComponent;
  let fixture: ComponentFixture<CommandRestrictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandRestrictionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
