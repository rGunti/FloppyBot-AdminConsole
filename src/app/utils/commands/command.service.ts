import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CommandApiService } from '../../api/command-api.service';
import { CommandInfo, CommandReport, CooldownConfiguration, CooldownInfo, PrivilegeLevel } from '../../api/entities';

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
    overridePrivilegeLevel?: PrivilegeLevel,
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
}
