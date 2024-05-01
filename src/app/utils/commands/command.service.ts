import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CommandApiService } from '../../api/command-api.service';
import {
  CommandInfo,
  CommandLimitation,
  CommandReport,
  CooldownConfiguration,
  CooldownInfo,
  CustomCommand,
  PrivilegeLevel,
} from '../../api/entities';

function pickFirst(array: number[], defaultValue: number = 0): number {
  return array.length > 0 ? array[0] : defaultValue;
}

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private readonly commandApi = inject(CommandApiService);

  getBuiltInCommands(channelId: string): Observable<CommandInfo[]> {
    return this.commandApi
      .getCommandConfigsForChannel(channelId)
      .pipe(map((commandConfigs) => commandConfigs.map((c) => this.convertCommandToCommandInfo(c))));
  }

  getCustomCommands(channelId: string): Observable<CommandInfo[]> {
    return this.commandApi
      .getCustomCommandsForChannel(channelId)
      .pipe(map((commandConfigs) => commandConfigs.map((c) => this.convertCustomCommandToCommandInfo(c))));
  }

  private convertCommandToCommandInfo(report: CommandReport): CommandInfo {
    return {
      name: report.command.name,
      description: report.command.description,
      aliases: report.command.aliases.filter((n) => n !== report.command.name),
      restrictedToInterfaces: report.command.availableOnInterfaces,
      requiredPrivilegeLevel: this.convertPrivilegeLevel(
        report.command.minPrivilegeLevel,
        report.configuration?.requiredPrivilegeLevel,
      ),
      customCommand: false,
      cooldown: this.convertCooldown(report.configuration?.customCooldownConfiguration || []),
      syntax: [],
      obsolete: false,
      disabled: report.configuration?.disabled,
    };
  }

  private convertPrivilegeLevel(
    defaultPrivilegeLevel?: PrivilegeLevel,
    overridePrivilegeLevel?: PrivilegeLevel | null,
  ): PrivilegeLevel {
    if (overridePrivilegeLevel) {
      return overridePrivilegeLevel;
    }
    if (defaultPrivilegeLevel) {
      return defaultPrivilegeLevel;
    }
    return 'Unknown';
  }

  private convertCooldown(cooldown: CooldownConfiguration[]): CooldownInfo {
    return {
      cooldownMode: 'Unknown',
      defaultCooldown: pickFirst(cooldown.filter((c) => c.privilegeLevel === 'Viewer').map((c) => c.cooldownMs)),
      modCooldown: pickFirst(cooldown.filter((c) => c.privilegeLevel === 'Moderator').map((c) => c.cooldownMs)),
      adminCooldown: pickFirst(cooldown.filter((c) => c.privilegeLevel === 'Administrator').map((c) => c.cooldownMs)),
    };
  }

  private convertCustomCommandToCommandInfo(command: CustomCommand): CommandInfo {
    return {
      name: command.name,
      description: this.createDescriptionForCommandInfo(command),
      aliases: command.aliases,
      restrictedToInterfaces: [],
      requiredPrivilegeLevel: command.limitations.minLevel || 'Unknown',
      customCommand: true,
      cooldown: this.convertLimitationsToCooldown(command.limitations),
      syntax: [],
      obsolete: false,
      disabled: false,
    };
  }

  private createDescriptionForCommandInfo(command: CustomCommand): string {
    if (command.responses.length === 0) {
      return 'No responses';
    }
    if (command.responses.length === 1) {
      const response = command.responses[0];
      return `${response.type}: ${response.content}`;
    }
    return `${command.responses.length} responses`;
  }

  private convertLimitationsToCooldown(limitations: CommandLimitation): CooldownInfo {
    const cooldown: CooldownInfo = {
      cooldownMode: 'Unknown',
      defaultCooldown: undefined,
      modCooldown: undefined,
      adminCooldown: undefined,
    };

    for (const cd of limitations.cooldown) {
      switch (cd.level) {
        case 'Viewer':
          cooldown.defaultCooldown = cd.milliseconds;
          break;
        case 'Moderator':
          cooldown.modCooldown = cd.milliseconds;
          break;
        case 'Administrator':
          cooldown.adminCooldown = cd.milliseconds;
          break;
      }
    }

    return cooldown;
  }

  private convertLimitationsToPrivilegeLevel(limitations: CommandLimitation): PrivilegeLevel {
    return limitations.minLevel || 'Unknown';
  }
}
