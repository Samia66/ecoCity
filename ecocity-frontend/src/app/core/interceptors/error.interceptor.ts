import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status !== 401) {
        const message = Array.isArray(error.error?.message)
          ? error.error.message.join(', ')
          : error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';

        snackBar.open(message, 'Fermer', { duration: 4000, panelClass: 'eco-snack-error' });
      }
      return throwError(() => error);
    }),
  );
};
