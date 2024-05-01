import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommandInfo } from '../../api/entities';

import { DeleteCommandDialogComponent } from './delete-command-dialog.component';

const COMMAND: CommandInfo = {
  name: 'notarealcommand',
  aliases: [],
  description: 'This command does not exist',
  requiredPrivilegeLevel: 'Moderator',
  restrictedToInterfaces: ['Twitch'],
  syntax: [],
  customCommand: true,
  cooldown: {
    cooldownMode: 'Unknown',
  },
  obsolete: false,
};

describe('DeleteCommandDialogComponent', () => {
  let component: DeleteCommandDialogComponent;
  let fixture: ComponentFixture<DeleteCommandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCommandDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: COMMAND,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component.command).toEqual(COMMAND);
  });

  it('should show the selected command in title', () => {
    const nativeElement = fixture.nativeElement;
    const titleElement: HTMLElement = nativeElement.querySelector('[data-test=command-name]');
    expect(titleElement.textContent).toContain(COMMAND.name);
  });

  it('"No" button to be present', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    const noButton: HTMLButtonElement = nativeElement.querySelector('button[data-test-button=no]')!;
    expect(noButton).toBeTruthy();
  });

  it('"Yes" button to be present', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    const yesButton: HTMLButtonElement = nativeElement.querySelector('button[data-test-button=yes]')!;
    expect(yesButton).toBeTruthy();
  });
});
