import { 
  getAgeInYears,
  daysToNexDue, 
  dateExists,
  dateToString,
  getNextYearlyDue,
} from "./date.util";

describe('getAgeInYears', () => {
  it('should return the correct age in years ON any BY any', () => {
    const today = new Date(2022, 0, 1); // January 1, 2022
    const startYear = 2000;
    const expectedAge = 22;
    expect(getAgeInYears(today, startYear)).toEqual(expectedAge);
  });
});

describe('dateToString', () => {
  it('should pad single digit month and day with 0 ON any BY February 1, 2022', () => {
    const date = new Date(2022, 1, 1); // February 1, 2022
    expect(dateToString(date)).toBe('2022-02-01');
  });

  it('should pad single digit month and day with 0 ON any BY January 1, 2022', () => {
    const date = new Date(2022, 0, 1); // January 1, 2022
    expect(dateToString(date)).toBe('2022-01-01');
  });

  it('should not pad double digit month and day ON any BY December 12, 2022', () => {
    const date = new Date(2022, 11, 12); // December 12, 2022
    expect(dateToString(date)).toBe('2022-12-12');
  });
});

describe('daysToNexDue', () => {
  it('should return number of days ON any BY same year', () => {
    const today = new Date(2022, 1, 1);
    const due = new Date(2022, 1, 5);
    expect(daysToNexDue(today, due)).toBe(4);
  });

  it('should return number of days ON any BY next year lower month', () => {
    const today = new Date(2022, 11, 1);
    const due = new Date(2023, 1, 5);
    expect(daysToNexDue(today, due)).toBe(66);
  });

  it('should return 0 ON any BY same date', () => {
    const today = new Date(2022, 1, 1);
    const due = new Date(2022, 1, 1);
    expect(daysToNexDue(today, due)).toBe(0);
  });

  it('should return negative number ON any BY overdue', () => {
    const today = new Date(2023, 1, 1);
    const due = new Date(2022, 1, 5); 
    expect(daysToNexDue(today, due)).toBe(-361);
  });
});

describe('getNextYearlyDue', () => {
  it('should return date in this year ON any BY same year', () => {
    const today = new Date(2022, 1, 1);
    const month = 2;
    const day = 5;
    expect(getNextYearlyDue(today, month, day))
      .toEqual(new Date(2022, month - 1, day));
  });

  it('should return date in next year ON any BY overdue this year', () => {
    const today = new Date(2022, 11, 1);
    const month = 1;
    const day = 5;
    expect(getNextYearlyDue(today, month, day))
      .toEqual(new Date(2023, month - 1, day));
  });

  it('should return same date ON any BY same date', () => {
    const today = new Date(2022, 1, 1);
    const month = 2;
    const day = 1;
    expect(getNextYearlyDue(today, month, day)).toEqual(today);
  });

  it('should return next leap year ON any BY overdue of 29 Feabruary in a leap year', () => {
    const today = new Date(2024, 6, 15);
    const month = 2;
    const day = 29;
    expect(getNextYearlyDue(today, month, day)).toEqual(new Date(2028, month - 1, day));
  });

  it('should return current year ON any BY due of 29 Feabruary in a leap year', () => {
    const today = new Date(2024, 1, 2);
    const month = 2;
    const day = 29;    
    expect(getNextYearlyDue(today, month, day)).toEqual(new Date(2024, month - 1, day));
  });

  it('should return next leap year ON any BY overdue of 29 Feabruary in a non-leap year', () => {
    const today = new Date(2025, 6, 15);
    const month = 2;
    const day = 29;
    expect(getNextYearlyDue(today, month, day)).toEqual(new Date(2028, month - 1, day));
  });

  it('should return next leap year ON any BY due of 29 Feabruary in a non-leap year', () => {
    const today = new Date(2025, 1, 2);
    const month = 2;
    const day = 29;
    expect(getNextYearlyDue(today, month, day)).toEqual(new Date(2028, month - 1, day));
  });

});

describe('dateExists', () => {
  it('should return null ON 29th February BY no year provided', () => {
    const day = 29;
    const month = 2;
    expect(dateExists(day, month)).toBeNull();
  });

  it('should return true ON any BY valid date and year', () => {
    const day = 1;
    const month = 1;
    const year = 2022;
    expect(dateExists(day, month, year)).toBe(true);
  });

  it('should return false ON any BY invalid date and year', () => {
    const day = 31;
    const month = 2;
    const year = 2022;
    expect(dateExists(day, month, year)).toBe(false);
  });

  it('should return true ON any BY valid date and no year', () => {
    const day = 1;
    const month = 1;
    expect(dateExists(day, month)).toBe(true);
  });

  it('should return false ON any BY invalid date and no year', () => {
    const day = 31;
    const month = 4;
    expect(dateExists(day, month)).toBe(false);
  });

  it('should return true ON 29th February BY leap year', () => {
    const day = 29;
    const month = 2;
    const year = 2024;
    expect(dateExists(day, month, year)).toBe(true);
  });
  
  it('should return false ON 29th February BY non-leap year', () => {
    const day = 29;
    const month = 2;
    const year = 2023;
    expect(dateExists(day, month, year)).toBe(false);
  });

  it('should return false ON 29th February BY non-leap year', () => {
    const day = 29;
    const month = 2;
    const year = 2021;
    expect(dateExists(day, month, year)).toBe(false);
  });

  it('should return true ON 29th February BY leap year', () => {
    const day = 29;
    const month = 2;
    const year = 2020;
    expect(dateExists(day, month, year)).toBe(true);
  });
  
});
