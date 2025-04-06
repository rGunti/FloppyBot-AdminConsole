import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';

import { ConfirmSnackComponent } from '../dialogs/confirm-snack/confirm-snack.component';
import { ErrorSnackComponent } from '../dialogs/error-snack/error-snack.component';
import { GenericQuestionDialogComponent } from '../dialogs/generic-question-dialog/generic-question-dialog.component';
import { NotImplementedDialogComponent } from '../dialogs/not-implemented-dialog/not-implemented-dialog.component';

export type DialogParameters = MatDialogConfig;

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);

  show<T>(component: ComponentType<unknown>, data?: unknown, params?: DialogParameters): Observable<T> {
    return this.dialog
      .open(component, { data, ...params })
      .afterClosed()
      .pipe(map((result) => result as T));
  }

  ask(title: string, content: string, isYesDangerous?: boolean): Observable<boolean> {
    return this.show<boolean>(GenericQuestionDialogComponent, { title, content, isYesDangerous });
  }

  success(text: string): void {
    this.snackbar.openFromComponent(ConfirmSnackComponent, {
      data: text,
      duration: 1_500,
    });
  }

  error(text: string): void {
    this.snackbar.openFromComponent(ErrorSnackComponent, {
      data: text,
      duration: 5_000,
    });
  }

  notImplemented(): void {
    this.dialog.open(NotImplementedDialogComponent);
  }
}
