import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CommandAbstract, CommandInfo, CommandReport, CustomCommand } from '../../api/entities';
import { FAKE_DATA_HOST } from '../../interceptors/fake-data.interceptor';

import { CommandService } from './command.service';

const CHANNEL_ID = 'Twitch/NotARealChannel';

const COMMAND_ABOUT: CommandAbstract = {
  name: 'about',
  aliases: ['about'],
  description: 'Returns FloppyBots current version',
  minPrivilegeLevel: 'Unknown',
  availableOnInterfaces: [],
  syntax: [],
  noParameters: true,
  hidden: false,
  parameters: [],
  allMetadata: {
    Cooldown: 'Viewer,30000,True',
    Category: 'Diagnostics',
    Description: 'Returns FloppyBots current version',
    PrimaryName: 'about',
    NoParameters: '1',
  },
};
const COMMAND_QUOTE_EDIT: CommandAbstract = {
  name: 'quoteedit',
  aliases: ['q*', 'qe', 'quoteedit'],
  description: 'Edits the text of an existing quote',
  minPrivilegeLevel: 'Moderator',
  availableOnInterfaces: ['Twitch'],
  syntax: ['<Quote No.> <New Text>'],
  noParameters: false,
  hidden: false,
  parameters: [
    {
      order: 1,
      name: 'id',
      type: 'Number',
      required: true,
      description: null,
      possibleValues: [],
    },
    {
      order: 2,
      name: 'newText',
      type: 'String',
      required: true,
      description: null,
      possibleValues: [],
    },
  ],
  allMetadata: {
    Category: 'Quotes',
    Description: 'Edits the text of an existing quote',
    PrimaryName: 'quoteedit',
    MinPrivilege: 'Moderator',
    ParameterHints: '1|id|Number|1||\n\n2|newText|String|1||',
    Syntax: '<Quote No.> <New Text>',
  },
};
const COMMAND_UNIT_DEBUG: CommandAbstract = {
  name: 'unitdebug',
  aliases: ['unitdebug'],
  description: null,
  minPrivilegeLevel: 'Moderator',
  availableOnInterfaces: [],
  syntax: [],
  noParameters: false,
  hidden: false,
  parameters: [],
  allMetadata: {
    Category: 'Diagnostics',
    MinPrivilege: 'Moderator',
  },
};
const FAKE_COMMANDS: CommandReport[] = [
  {
    command: COMMAND_ABOUT,
    configuration: {
      id: `${CHANNEL_ID},about`,
      channelId: CHANNEL_ID,
      commandName: 'about',
      requiredPrivilegeLevel: null,
      disabled: false,
      customCooldown: false,
      customCooldownConfiguration: [],
    },
  },
  {
    command: COMMAND_QUOTE_EDIT,
    configuration: null,
  },
  {
    command: COMMAND_UNIT_DEBUG,
    configuration: {
      id: `${CHANNEL_ID},unitdebug`,
      channelId: CHANNEL_ID,
      commandName: 'unitdebug',
      requiredPrivilegeLevel: 'Administrator',
      disabled: true,
      customCooldown: true,
      customCooldownConfiguration: [{ privilegeLevel: 'Administrator', cooldownMs: 60_000 }],
    },
  },
];

describe('CommandService', () => {
  let service: CommandService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommandService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CommandService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBuiltInCommands', () => {
    it('should return built-in commands', () => {
      const expectedData: CommandInfo[] = [
        {
          name: 'about',
          description: 'Returns FloppyBots current version',
          aliases: [],
          restrictedToInterfaces: [],
          requiredPrivilegeLevel: 'Unknown',
          customCommand: false,
          cooldown: {
            cooldownMode: 'Unknown',
            defaultCooldown: 0,
            modCooldown: 0,
            adminCooldown: 0,
          },
          syntax: [],
          obsolete: false,
          disabled: false,
        },
        {
          name: 'quoteedit',
          description: 'Edits the text of an existing quote',
          aliases: ['q*', 'qe'],
          restrictedToInterfaces: ['Twitch'],
          requiredPrivilegeLevel: 'Moderator',
          customCommand: false,
          cooldown: {
            cooldownMode: 'Unknown',
            defaultCooldown: 0,
            modCooldown: 0,
            adminCooldown: 0,
          },
          syntax: [],
          obsolete: false,
          disabled: undefined,
        },
        {
          name: 'unitdebug',
          description: null,
          aliases: [],
          restrictedToInterfaces: [],
          requiredPrivilegeLevel: 'Administrator',
          customCommand: false,
          cooldown: {
            cooldownMode: 'Unknown',
            defaultCooldown: 0,
            modCooldown: 0,
            adminCooldown: 60_000,
          },
          syntax: [],
          obsolete: false,
          disabled: true,
        },
      ];

      service.getBuiltInCommands(CHANNEL_ID).subscribe((commands) => {
        expect(commands).toEqual(expectedData);
      });

      httpTestingController.expectOne(`${FAKE_DATA_HOST}/api/v2/commands/config/${CHANNEL_ID}`).flush(FAKE_COMMANDS);
    });
  });

  describe('getCustomCommands', () => {
    const cases: [string, CustomCommand[], CommandInfo[]][] = [
      [
        'single with 2 responses',
        [
          {
            id: '6605ad6c2440796b5e14f0f5',
            name: 'nlf',
            aliases: [],
            responses: [
              {
                type: 'Text',
                content: 'This is a command\n\nWith multiple messages',
                auxiliaryContent: null,
              },
              {
                type: 'Sound',
                content: `${CHANNEL_ID}/harmony.mp3`,
                auxiliaryContent: null,
              },
            ],
            limitations: {
              minLevel: 'Viewer',
              cooldown: [
                {
                  level: 'Unknown',
                  milliseconds: 1000,
                },
              ],
              limitedToUsers: [],
            },
            responseMode: 'All',
            allowCounterOperations: false,
          },
        ],
        [
          {
            name: 'nlf',
            description: '2 responses',
            aliases: [],
            restrictedToInterfaces: [],
            requiredPrivilegeLevel: 'Viewer',
            customCommand: true,
            cooldown: {
              cooldownMode: 'Unknown',
              defaultCooldown: undefined,
              modCooldown: undefined,
              adminCooldown: undefined,
            },
            syntax: [],
            obsolete: false,
            disabled: false,
          },
        ],
      ],
      [
        'single with 1 text responses',
        [
          {
            id: '6605ad6c2440796b5e14f0f5',
            name: 'nlf',
            aliases: [],
            responses: [
              {
                type: 'Text',
                content: 'This is a command\n\nWith multiple messages',
                auxiliaryContent: null,
              },
            ],
            limitations: {
              minLevel: 'Viewer',
              cooldown: [
                {
                  level: 'Viewer',
                  milliseconds: 1_000,
                },
              ],
              limitedToUsers: [],
            },
            responseMode: 'All',
            allowCounterOperations: false,
          },
        ],
        [
          {
            name: 'nlf',
            description: 'Text: This is a command\n\nWith multiple messages',
            aliases: [],
            restrictedToInterfaces: [],
            requiredPrivilegeLevel: 'Viewer',
            customCommand: true,
            cooldown: {
              cooldownMode: 'Unknown',
              defaultCooldown: 1_000,
              modCooldown: undefined,
              adminCooldown: undefined,
            },
            syntax: [],
            obsolete: false,
            disabled: false,
          },
        ],
      ],
      [
        'single with 1 text responses',
        [
          {
            id: '6605ad6c2440796b5e14f0f5',
            name: 'nlf',
            aliases: [],
            responses: [
              {
                type: 'Sound',
                content: `${CHANNEL_ID}/harmony.mp3`,
                auxiliaryContent: null,
              },
            ],
            limitations: {
              minLevel: 'Viewer',
              cooldown: [
                {
                  level: 'Viewer',
                  milliseconds: 1_000,
                },
                {
                  level: 'Moderator',
                  milliseconds: 0,
                },
              ],
              limitedToUsers: [],
            },
            responseMode: 'All',
            allowCounterOperations: true,
          },
        ],
        [
          {
            name: 'nlf',
            description: 'Sound: Twitch/NotARealChannel/harmony.mp3',
            aliases: [],
            restrictedToInterfaces: [],
            requiredPrivilegeLevel: 'Viewer',
            customCommand: true,
            cooldown: {
              cooldownMode: 'Unknown',
              defaultCooldown: 1_000,
              modCooldown: 0,
              adminCooldown: undefined,
            },
            syntax: [],
            obsolete: false,
            disabled: false,
          },
        ],
      ],
      ['empty', [], []],
    ];

    for (const [description, apiCommands, expectedData] of cases) {
      it(`should return custom commands "${description}"`, () => {
        service.getCustomCommands(CHANNEL_ID).subscribe((commands) => {
          expect(commands).toEqual(expectedData);
        });

        httpTestingController.expectOne(`${FAKE_DATA_HOST}/api/v2/custom-commands/${CHANNEL_ID}`).flush(apiCommands);
      });
    }
  });
});
