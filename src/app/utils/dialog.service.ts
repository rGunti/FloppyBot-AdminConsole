import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';

import { ConfirmSnackComponent } from '../dialogs/confirm-snack/confirm-snack.component';
import { ErrorSnackComponent } from '../dialogs/error-snack/error-snack.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);

  show(component: ComponentType<unknown>, data: unknown): Observable<boolean> {
    return this.dialog
      .open(component, { data })
      .afterClosed()
      .pipe(map((returnValue) => !!returnValue));
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
}
