import { eDateTime } from './e-datetime';

describe('eDateTime tests', () => {
  test('first date the week(sun version)', function () {
    const theDate = eDateTime.createByString('2022-12-08') as eDateTime;
    const result = theDate.getThisWeekDayDate(0);
    expect(result.toDateString()).toEqual('2022-12-04'); //must be sunday.
  });

  test('get dates of the week(monday and sunday version)', function () {
    const theDate = eDateTime.createByString('2022-12-08') as eDateTime;
    const mondayVer = theDate.getThisWeekDates();
    const monday = mondayVer[0];
    expect(monday.toDateString()).toEqual('2022-12-05');
    expect(mondayVer.length).toEqual(7);
    const mondayLast = mondayVer[6];
    expect(mondayLast.toDateString()).toEqual('2022-12-11');

    const sundayVer = theDate.getThisWeekDates(true);
    const sunday = sundayVer[0];
    expect(sunday.toDateString()).toEqual('2022-12-04');
    expect(sundayVer.length).toEqual(7);

    const sundayLast = sundayVer[6];
    expect(sundayLast.toDateString()).toEqual('2022-12-10');
  });

  test('get dates of the week(sunday version when sunday)', function () {
    const theDate = eDateTime.createByString('2022-12-11') as eDateTime;
    const sundayVer = theDate.getThisWeekDates(true);
    const sunday = sundayVer[0];
    expect(sunday.toDateString()).toEqual('2022-12-11');
    expect(sundayVer.length).toEqual(7);

    const sundayLast = sundayVer[6];
    expect(sundayLast.toDateString()).toEqual('2022-12-17');
  });
});
