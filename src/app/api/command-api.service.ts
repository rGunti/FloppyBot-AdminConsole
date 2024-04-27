import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { getUrl } from '../utils/api';

import { CommandInfo, CommandReport, CustomCommand } from './entities';

const COMMANDS: CommandInfo[] = [
  {
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
  },
  {
    name: 'clearalert',
    description: 'Clears the message to be sent when someone subscribes to the channel.',
    aliases: [],
    restrictedToInterfaces: ['Twitch'],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'clearshoutout',
    description: 'Clears the channels shoutout message, effectively disabling the shoutout command',
    aliases: [],
    restrictedToInterfaces: ['Twitch'],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'commands',
    description: 'Returns a list of all available commands',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'counter',
    description: 'Sets the counter for a custom command',
    aliases: ['count', 'c'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Administrator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Command Name> <Operation>|<Value>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'debugpriv',
    description: 'Returns the privilege level of the user running the command',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'dectime',
    description: 'What is the current decimal time',
    aliases: ['dt'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'define',
    description: '',
    aliases: ['urbandictionary'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'deletecmd',
    description: 'Deletes a custom text command',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Command Name>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'math',
    description: 'Calculate something using a calculator',
    aliases: ['calc'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Expression>',
        purpose: '',
        examples: [],
      },
      {
        syntax: '2+3',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'money',
    description:
      'Converts the given amount of money into another currency. The international three letter currency codes are to be provided.',
    aliases: ['currency'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Input> <Currency> [in|to] <Target Currency>',
        purpose: '',
        examples: [],
      },
      {
        syntax: '20 EUR in USD',
        purpose: '',
        examples: [],
      },
      {
        syntax: '15.90 CHF to NOK',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'newcmd',
    description: 'Creates a new custom text command',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Command Name> <Reply Text>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'ping',
    description: 'Returns a test message. Useful to check if FloppyBot responds to commands.',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'quote',
    description: 'Returns a random quote or a specific one, if a quote number is given',
    aliases: ['q'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Viewer',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '[<Quote No.>]',
        purpose: '',
        examples: [],
      },
      {
        syntax: '',
        purpose: '',
        examples: [],
      },
      {
        syntax: '123',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'quoteadd',
    description: 'Adds a new quote',
    aliases: ['q+'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Viewer',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Text>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'quoteconfirm',
    description:
      'Confirms the connection between this channel and another one, linking their quote databases together. This is to be executed after "quotejoin".',
    aliases: ['qc'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Channel ID> <Join Code>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'quotedel',
    description: 'Deletes an existing quote',
    aliases: ['q-'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Quote No.>',
        purpose: '',
        examples: [],
      },
      {
        syntax: '123',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'quoteedit',
    description: 'Edits the text of an existing quote',
    aliases: ['q*', 'qe'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Quote No.> <New Text>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'quoteeditcontext',
    description: 'Edits the context of an existing quote',
    aliases: ['q*c', 'qec'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Quote No.> <New Context>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'quoteinfo',
    description:
      'Returns administrative information about this channels quote database and information about how to link it with one from another channel.',
    aliases: ['qi'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'quotejoin',
    description: 'Starts the join process for the given channel.',
    aliases: ['qj'],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Channel ID>',
        purpose: '',
        examples: [],
      },
      {
        syntax: 'Twitch/pinsrltrex',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'setdefaultalert',
    description: 'Resets the sub alert message to the default message',
    aliases: [],
    restrictedToInterfaces: ['Twitch'],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'setshoutout',
    description:
      'Sets the shoutout template for the requesting channel. The following placeholders are supported, when surrounded by {}: AccountName, DisplayName, LastGame, Link',
    aliases: [],
    restrictedToInterfaces: ['Twitch'],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Message>',
        purpose: '',
        examples: [],
      },
      {
        syntax: 'Shoutout to {DisplayName} at {Link}. They last played {LastGame}!',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'shoutout',
    description: 'Shouts out a Twitch channel with a customized message defined for the channel',
    aliases: ['so'],
    restrictedToInterfaces: ['Twitch'],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Channel Name>',
        purpose: '',
        examples: [],
      },
      {
        syntax: 'Avinnus',
        purpose: '',
        examples: [],
      },
      {
        syntax: 'pinsrltrex',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'subalert',
    description: 'Sets the message to be sent when someone subscribes to the channel.',
    aliases: [],
    restrictedToInterfaces: ['Twitch'],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [
      {
        syntax: '<Sub Alert Message>',
        purpose: '',
        examples: [],
      },
    ],
    obsolete: false,
  },
  {
    name: 'time',
    description: 'What is the current time',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'timer',
    description: 'Creates a timer that sends a message when the given time is elapsed',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'timeset',
    description: 'Set your default timezone',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Viewer',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'translate',
    description: 'Translates a given text from one language to another',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'unit',
    description: '',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Unknown',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
  {
    name: 'unitdebug',
    description: '',
    aliases: [],
    restrictedToInterfaces: [],
    requiredPrivilegeLevel: 'Moderator',
    customCommand: false,
    cooldown: {
      cooldownMode: 'None',
    },
    syntax: [],
    obsolete: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class CommandApiService {
  private readonly http = inject(HttpClient);

  getCommandsForChannel(channelId: string): Observable<CommandInfo[]> {
    console.log('Calling fake API CommandApiService.getCommandsForChannel', channelId);
    return of(COMMANDS);
  }

  getCommandConfigsForChannel(channelId: string): Observable<CommandReport[]> {
    return this.http.get<CommandReport[]>(getUrl(`/api/v2/commands/config/${channelId}`));
  }

  getCommandReport(channelId: string, commandName: string): Observable<CommandReport> {
    return this.http.get<CommandReport>(getUrl(`/api/v2/commands/config/${channelId}/${commandName}`));
  }

  disableCommandForChannel(channelId: string, commandName: string, isDisabled: boolean): Observable<void> {
    return this.http.post<void>(
      getUrl(`/api/v2/commands/config/${channelId}/${commandName}/disable?isDisabled=${isDisabled}`),
      null,
    );
  }

  getCustomCommandsForChannel(channelId: string): Observable<CustomCommand[]> {
    return this.http.get<CustomCommand[]>(getUrl(`/api/v2/custom-commands/${channelId}`));
  }

  getCustomCommandForChannel(channelId: string, commandName: string): Observable<CustomCommand> {
    return this.http.get<CustomCommand>(getUrl(`/api/v2/custom-commands/${channelId}/${commandName}`));
  }

  createCustomCommand(channelId: string, command: CustomCommand): Observable<void> {
    return this.http.post<void>(getUrl(`/api/v2/custom-commands/${channelId}`), command);
  }

  updateCustomCommand(channelId: string, command: CustomCommand): Observable<void> {
    return this.http.put<void>(getUrl(`/api/v2/custom-commands/${channelId}/${command.name}`), command);
  }

  deleteCustomCommand(channelId: string, commandName: string): Observable<void> {
    return this.http.delete<void>(getUrl(`/api/v2/custom-commands/${channelId}/${commandName}`));
  }
}
