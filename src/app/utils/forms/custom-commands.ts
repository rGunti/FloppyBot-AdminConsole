import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, take, throwError } from 'rxjs';

import { CommandApiService } from '../../api/command-api.service';
import { CommandResponseMode } from '../../api/entities';

const customCommandNameRegex = /^[a-zA-Z0-9]+$/;

export class CustomCommandValidators {
  static readonly invalidCustomCommandName = 'invalidCustomCommandName' as const;
  static readonly customCommandNameAlreadyInUse = 'uniqueCommandName' as const;
  static readonly invalidResponseMode = 'invalidResponseMode' as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static readonly errors: { [errorKey: string]: string | ((errorValue: any) => string) } = {
    [CustomCommandValidators.invalidCustomCommandName]: 'Invalid custom command name. Only use a-z, A-Z and 0-9.',
    [CustomCommandValidators.customCommandNameAlreadyInUse]: (commandName: string) =>
      `Command "${commandName}" already exists.`,
    [CustomCommandValidators.invalidResponseMode]: 'Invalid response mode.',
  } as const;
  static readonly errorKeys = Object.keys(CustomCommandValidators.errors);

  static getErrorMessage(form: AbstractControl): string | null {
    return CustomCommandValidators.errorKeys
      .filter((key) => form.hasError(key))
      .map((key) => {
        const error = CustomCommandValidators.errors[key];
        return typeof error === 'function' ? error(form.getError(key)) : error;
      })
      .join(', ');
  }

  static customCommandName(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    if (!customCommandNameRegex.test(value)) {
      return { [CustomCommandValidators.invalidCustomCommandName]: true };
    }

    return null;
  }

  static customCommandNameList(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string[];
    if (!value) {
      return null;
    }
    if (value.some((v) => !customCommandNameRegex.test(v))) {
      return { [CustomCommandValidators.invalidCustomCommandName]: true };
    }
    return null;
  }

  static uniqueCommandName(
    channelId: Observable<string>,
    objectId: string,
    commandApi: CommandApiService,
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const commandName = control.value as string;
      return channelId.pipe(
        take(1),
        switchMap((channelId) => commandApi.getCustomCommandForChannel(channelId, commandName)),
        map((command) => {
          return command && command.id !== objectId
            ? { [CustomCommandValidators.customCommandNameAlreadyInUse]: commandName }
            : null;
        }),
        catchError((err) => {
          if (err.status === 404) {
            return of(null);
          }
          return throwError(() => err);
        }),
      );
    };
  }

  static validResponseMode(control: AbstractControl): ValidationErrors | null {
    const value = control.value as CommandResponseMode;
    if (!value) {
      return null;
    }

    if (!['First', 'PickOneRandom', 'All'].includes(value)) {
      return { [CustomCommandValidators.invalidResponseMode]: true };
    }

    return null;
  }
}
