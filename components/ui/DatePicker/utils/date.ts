import type { DateRange, MonthView } from "../types";

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return stripTime(a).getTime() < stripTime(b).getTime();
}

export function isAfterDay(a: Date, b: Date): boolean {
  return stripTime(a).getTime() > stripTime(b).getTime();
}

export function addMonths(view: MonthView, delta: number): MonthView {
  const d = new Date(view.year, view.month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function formatDate(date: Date): string {
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** Builds a 7-column grid of the month. Leading/trailing filler cells are `null`. */
export function buildMonthCells(
  year: number,
  month: number,
  weekStartsOn: 0 | 1,
): (Date | null)[] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function rangeFromDaysBack(daysBack: number): DateRange {
  const to = stripTime(new Date());
  const from = new Date(to);
  from.setDate(from.getDate() - daysBack);
  return { from, to };
}

export function rangeFromMonthsBack(monthsBack: number): DateRange {
  const to = stripTime(new Date());
  const from = new Date(to);
  from.setMonth(from.getMonth() - monthsBack);
  return { from, to };
}
