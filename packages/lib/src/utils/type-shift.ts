export default class TypeShift {
  public static toInt(input: number | string | undefined) {
    if (typeof input === 'string') {
      return parseInt(input);
    }
    return input as number | undefined;
  }
}
