import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAliasesComponent } from './channel-aliases.component';

describe('ChannelAliasesComponent', () => {
  let component: ChannelAliasesComponent;
  let fixture: ComponentFixture<ChannelAliasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAliasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelAliasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
