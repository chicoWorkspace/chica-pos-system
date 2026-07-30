export default class eObject {
  public static removePropertiesIfUndefined(obj: any) {
    Object.keys(obj).forEach(
      (key) => obj[key] === undefined && delete obj[key]
    );
    return obj;
  }
}
