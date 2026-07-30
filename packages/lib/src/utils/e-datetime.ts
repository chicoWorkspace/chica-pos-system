import { eNumber } from './e-number';

export class eDateTime {
  date: Date;
  constructor(date: Date) {
    this.date = date;
  }

  public static createByString(value?: string) {
    if (!value) {
      return undefined;
    }
    const result = new eDateTime(new Date(value));
    return result;
  }
  public static now() {
    const date = new Date();
    const result = new eDateTime(date);
    return result;
  }

  public isWeekend() {
    const weekDay = this.getWeekDay();
    return weekDay === 6 || weekDay === 7;
  }

  public getWeekDay() {
    const defaultDay = this.date.getDay();
    if (defaultDay === 0) return 7;
    return defaultDay;
  }

  public getTimestamp() {
    return Math.floor(this.date.getTime() / 1000);
  }

  public static createByTimestamp(ts: number) {
    const date = new Date(ts * 1000);
    const result = new eDateTime(date);
    return result;
  }

  public getFirstDateStringOfThisMonth() {
    return `${this.getYear()}-${this.getMonthString()}-01`;
  }

  public getFirsteDateTimeOfThisMonth() {
    const dateStr = this.getFirstDateStringOfThisMonth();
    const result = eDateTime.createByString(dateStr);
    return result;
  }

  public addSecondes(seconds: number) {
    const current = this.getTimestamp();
    const addedTs = seconds;
    const newTs = current + addedTs;
    this.date = new Date(newTs * 1000);
    return this;
  }

  public addMinutes(minutes: number) {
    this.addSecondes(minutes * 60);
    return this;
  }

  public addHours(hours: number) {
    this.addMinutes(hours * 60);
    return this;
  }

  public addDays(days: number) {
    this.addHours(days * 24);
    return this;
  }

  public getYear() {
    return this.date.getFullYear();
  }

  public getMonth() {
    return this.date.getMonth() + 1;
  }
  public getMonthString() {
    const month = this.getMonth();
    const result = `${month}`.padStart(2, '0');
    return result;
  }

  public getDayOfMonth() {
    const dayOfMonth = this.date.getDate();
    return dayOfMonth;
  }

  public getDayOfMonthString() {
    const dayOfMonth = this.getDayOfMonth();
    const result = `${dayOfMonth}`.padStart(2, '0');
    return result;
  }

  public getHour() {
    return this.date.getHours();
  }
  public getHourString() {
    const hour = this.getHour();
    const result = `${hour}`.padStart(2, '0');
    return result;
  }

  public getMinutes() {
    return this.date.getMinutes();
  }
  public getMinutesString() {
    const minutes = this.getMinutes();
    const result = `${minutes}`.padStart(2, '0');
    return result;
  }

  public getSeconds() {
    return this.date.getSeconds();
  }
  public getSecondsString() {
    const value = this.getSeconds();
    const result = `${value}`.padStart(2, '0');
    return result;
  }

  public toDateString() {
    const year = this.getYear();
    const month = this.getMonthString();
    const day = this.getDayOfMonthString();
    return `${year}-${month}-${day}`;
  }

  public toYearMonth() {
    const year = this.getYear();
    const month = this.getMonthString();
    return `${year}-${month}`;
  }

  public toYYYYmm() {
    const year = this.getYear();
    const month = this.getMonthString();
    return `${year}${month}`;
  }

  public toDateTimeString(withSeconds: boolean = true) {
    const date = this.toDateString();
    const time = this.toTimeString(withSeconds);
    return `${date} ${time}`;
  }

  public toStringForDateTimeInput() {
    const date = this.toDateString();
    const time = this.toTimeString(false);
    return `${date}T${time}`;
  }

  public toTimeString(withSeconds: boolean = true) {
    const hour = this.getHourString();
    const minutes = this.getMinutesString();

    if (withSeconds) {
      const seconds = this.getSecondsString();
      return `${hour}:${minutes}:${seconds}`;
    }
    return `${hour}:${minutes}`;
  }

  public getYearEndDate() {
    const result = new Date(this.getYear(), 11, 31);
    return result;
  }
  public getYearStartDate() {
    const result = new Date(this.getYear(), 0, 1);
    return result;
  }

  public static createByTime(time: string) {
    const result = new eDateTime(eDateTime.getDateByTime(time));
    return result;
  }

  public static getDateByTime(time: string) {
    const date = new Date(`2000-01-01 ${time}`);
    return date;
  }

  public static getSecondesByTime(time: string) {
    const seconds = eDateTime.createByTime(time).getTimestamp();
    const zero = eDateTime.createByTime('00:00:00').getTimestamp();
    return seconds - zero;
  }

  public static getHowLongBetweenTwoTimes(time1: string, time2: string) {
    const time1Seconds = eDateTime.getSecondesByTime(time1);
    let time2Seconds = eDateTime.getSecondesByTime(time2);
    if (time2Seconds < time1Seconds) {
      time2Seconds += 24 * 60 * 60;
    }
    return time2Seconds - time1Seconds;
  }

  public getClone() {
    return eDateTime.createByTimestamp(this.getTimestamp());
  }

  public getThisWeekDayDate(weekDayeNumber: number) {
    const weekDay = this.getWeekDay();
    let result = this.getClone();
    result.addDays(weekDayeNumber - weekDay);
    return result;
  }

  public getThisWeekDates(startFromSunday: boolean = false) {
    let dates: eDateTime[] = [];
    if (startFromSunday) {
      const isSunday = this.getWeekDay() === 7;
      let datetime = this.getClone();
      if (isSunday) {
        datetime.addDays(1);
      }
      eNumber.getNumbersByMinToMax(0, 6).forEach((x) => {
        dates.push(datetime.getThisWeekDayDate(x));
      });
    } else {
      eNumber.getNumbersByMinToMax(1, 7).forEach((x) => {
        dates.push(this.getThisWeekDayDate(x));
      });
    }

    return dates;
  }

  public getPrevMonthFirst() {
    const currentFirst = this.getFirsteDateTimeOfThisMonth() as eDateTime;
    currentFirst.addDays(-1);
    const result = currentFirst?.getFirsteDateTimeOfThisMonth() as eDateTime;
    return result;
  }

  public getNextMonthFirst() {
    let year = this.getYear();
    let nextMonths = this.getMonth() + 1;
    if (nextMonths === 13) {
      nextMonths = 1;
      year += 1;
    }
    const monthStr = nextMonths.toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-01`;
    const result = eDateTime.createByString(dateStr) as eDateTime;
    return result;
  }

  public getChineseWeekday() {
    const map = [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期日',
    ];
    return map[this.getWeekDay() - 1];
  }

  public getChineseMonth() {
    const map = [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月',
    ];
    return map[this.getMonth() - 1];
  }

  public getThisWeekIndex() {
    const dayOfMonth = this.getDayOfMonth();
    const firstDate = this.getFirsteDateTimeOfThisMonth() as eDateTime;
    const totalDaysOfMonth = dayOfMonth + firstDate.getWeekDay() - 1;
    let weekIndex = Math.ceil(totalDaysOfMonth / 7);

    return weekIndex;
  }

  public getDatesByThisMonthWeekIndex(weekIndex: number) {
    const datetime = this.getFirsteDateTimeOfThisMonth() as eDateTime;
    datetime.addDays(7 * (weekIndex - 1));
    const result = datetime.getThisWeekDates();
    return result;
  }

  public geteDateTimesByThisMonth() {
    let max = this.getNextMonthFirst() as eDateTime;
    max.addDays(-1);
    const result = eNumber
      .getNumbersByMinToMax(1, max.getDayOfMonth())
      .map((x) => {
        const yearMonth = this.toYearMonth();
        const dateStr = x.toString().padStart(2, '0');
        const datetimeStr = `${yearMonth}-${dateStr}`;

        return eDateTime.createByString(datetimeStr) as eDateTime;
      });
    return result;
  }

  public static getRangeDiffYears(range: DateTimeRange) {
    const yearDiff = range.to.getYear() - range.from.getYear();
    const monthGreater = range.to.getMonth() >= range.from.getMonth();
    const dayGreater = range.to.getDayOfMonth() >= range.from.getDayOfMonth();
    const timeGreater = range.to.toTimeString() >= range.from.toTimeString();
    if (monthGreater && dayGreater && timeGreater) {
      return yearDiff;
    }
    return yearDiff - 1;
  }

  public static getRangeDiffSeconds(range: DateTimeRange) {
    const from = range.from.getTimestamp();
    const to = range.to.getTimestamp();
    return to - from;
  }

  public static getRangeDiffHours(
    range: DateTimeRange,
    outputType?: 'ceil' | 'floor',
  ) {
    const seconds = eDateTime.getRangeDiffSeconds(range);
    const result = eDateTime.outputType(seconds / 60.0 / 60.0, outputType);
    return result;
  }

  private static outputType(result: number, outputType?: 'ceil' | 'floor') {
    if (outputType && outputType === 'ceil') {
      return Math.ceil(result);
    }
    if (outputType && outputType === 'floor') {
      return Math.floor(result);
    }
    return result;
  }
}
export interface DateTimeRange {
  from: eDateTime;
  to: eDateTime;
}
