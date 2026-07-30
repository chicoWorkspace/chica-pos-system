export class eNumber {
  public static toPercentage(value: number) {
    return Math.round(value * 100) + '%';
  }

  public static getNumbersByMinToMax(min: number, max: number) {
    let result: number[] = [];
    for (let index = min; index <= max; index++) {
      result.push(index);
    }
    return result;
  }
}
