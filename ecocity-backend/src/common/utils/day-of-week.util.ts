import { DayOfWeek } from '@prisma/client';

const JS_DAY_TO_DAY_OF_WEEK: DayOfWeek[] = [
  DayOfWeek.DIMANCHE,
  DayOfWeek.LUNDI,
  DayOfWeek.MARDI,
  DayOfWeek.MERCREDI,
  DayOfWeek.JEUDI,
  DayOfWeek.VENDREDI,
  DayOfWeek.SAMEDI,
];

/** Convertit `Date.getDay()` (0 = dimanche) en `DayOfWeek`. */
export function dayOfWeekFromDate(date: Date): DayOfWeek {
  return JS_DAY_TO_DAY_OF_WEEK[date.getDay()];
}

/** Minuit UTC du jour de `date`, utilisé comme clé de date pour `Collection.scheduledDate`. */
export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
