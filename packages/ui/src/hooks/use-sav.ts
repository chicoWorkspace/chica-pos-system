import { useState } from 'react';
import type { SetterAndValue } from '@repo/lib';

export function useSetterAndValue<T>(defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const result: SetterAndValue<T> = {
    set: (data) => {
      setValue(data);
    },
    value,
  };
  return result;
}
