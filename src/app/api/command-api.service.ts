import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { CommandReport, CustomCommand, ShoutoutCommandConfig, TimerMessageConfig } from './entities';

@Injectable({
  providedIn: 'root',
})
export class CommandApiService {
  private readonly http = inject(HttpClient);

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

  getShoutoutCommandMessage(channelId: string): Observable<ShoutoutCommandConfig> {
    return this.http.get<ShoutoutCommandConfig>(getUrl(`/api/v2/commands/config/${channelId}/shoutout`));
  }

  setShoutoutCommandMessage(channelId: string, message: ShoutoutCommandConfig): Observable<void> {
    return this.http.post<void>(getUrl(`/api/v2/commands/config/${channelId}/shoutout`), message);
  }

  getTimerConfigForChannel(channelId: string): Observable<TimerMessageConfig> {
    return this.http.get<TimerMessageConfig>(getUrl(`/api/v2/commands/config/${channelId}/timer`));
  }

  setTimerConfigForChannel(channelId: string, config: TimerMessageConfig): Observable<void> {
    return this.http.post<void>(getUrl(`/api/v2/commands/config/${channelId}/timer`), config);
  }
}
