export default class eMap<T> {
  private map: { [key: string]: T };

  constructor(map?: { [key: string]: T }) {
    this.map = map ?? {};
  }

  public getMap() {
    return { ...this.map };
  }

  public set(key: string, value: T) {
    this.map[key] = value;
  }

  public get(key: string): T {
    return this.map[key];
  }

  public has(key: string) {
    const result = Object.prototype.hasOwnProperty.call(this.map, key);
    return result;
  }

  public delete(key: string) {
    delete this.map[key];
  }

  public forEach(fun: (key: string, value: T) => void) {
    for (const key in this.map) {
      if (this.has(key)) {
        fun(key, this.get(key));
      }
    }
  }
  public getKeys() {
    return Object.keys(this.map);
  }

  public toMapArray<ArrayT>(fun: (key: string, value: T) => ArrayT): ArrayT[] {
    let result: ArrayT[] = [];
    this.forEach((key, value) => {
      result.push(fun(key, value));
    });
    return result;
  }
}
