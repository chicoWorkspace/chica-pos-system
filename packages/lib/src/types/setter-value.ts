export interface SetterAndValue<T> {
  set(data: T): void;
  value: T;
}
