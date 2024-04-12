import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandRestrictionsComponent } from './command-restrictions.component';
import { CommandInfo } from '../../api/entities';

describe('CommandRestrictionsComponent', () => {
  let component: CommandRestrictionsComponent;
  let fixture: ComponentFixture<CommandRestrictionsComponent>;

  const DEFAULT_COMMAND: CommandInfo = {
    name: 'about',
    description: 'Returns FloppyBots current version',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'SuperUser',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandRestrictionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandRestrictionsComponent);
    component = fixture.componentInstance;
    component.command = DEFAULT_COMMAND;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
