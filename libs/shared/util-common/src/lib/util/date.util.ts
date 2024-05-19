type YearString = `${number}`;
type MonthString = `${number}`;
type DayString = `${number}`;
export type DateAsString = `${YearString}-${MonthString}-${DayString}`;

function isDateValid(day: number, month: number, year: number): boolean {
  
  const tempDate = new Date(year, month - 1, day);

  // Check if the date is valid
  if (tempDate.getFullYear()!== year || tempDate.getMonth()!== month - 1 || tempDate.getDate()!== day) {
    return false
  }

  return true;
}

export function dateToString(date: Date): DateAsString {
  const year: YearString = `${date.getFullYear()}`;
  const month: MonthString = `${date.getMonth() + 1}`;
  const day: DayString = `${date.getDate()}`;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` as DateAsString;
}

function is29FebruaryWithoutYear(day: number, month: number, year?: number | null): boolean {
  return day === 29 && month === 2 && !year;
}

export function dateExists(day: number, month: number, year?: number | null): boolean | null {
  
  if(is29FebruaryWithoutYear(day, month, year)) {
    return null;
  }
  
  if (!year) {
    return isDateValid(day, month, 2024);
  }

  return isDateValid(day, month, year);
}

export function getAgeInYears(today: Date, startYear: number): number {
  return today.getFullYear() - startYear;
}

export function daysToNexDue(today: Date, due: Date): number {
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
}

export function getNextYearlyDue(today: Date, month: number, day: number): Date {
  
  let year = today.getFullYear();
  const maybeNextDue: Date = new Date(year, month - 1, day);
  const maybeDaysToDue: number = Math.ceil((maybeNextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  if(is29FebruaryWithoutYear(day, month)) { 
    // We have due in the nex leap year 
    // if we are not in the leap year of we are 
    // over 29.02 in a leap year
    if ( year % 4 !== 0 || maybeDaysToDue < 0) {      
      year += (4 - year % 4);
    }
  }
  
  const nextDue: Date = new Date(year, month - 1, day);
  const daysToDue: number = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
  return daysToDue < 0 ? new Date(today.getFullYear() + 1, month - 1, day) : nextDue;
}
