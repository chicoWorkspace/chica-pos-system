/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type React from 'react';
import { useEffect, useState } from 'react';
import type { SetterAndValue } from '@repo/lib';

export function useLocalStorageState<T>(defaultValue: T, key: string) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stickyValue = window.localStorage.getItem(key);
      if (stickyValue && stickyValue !== "undefined") {
        return JSON.parse(stickyValue);
      }
    } catch {
      // 解析錯誤就回 default
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to save ${key} to localStorage`);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function useSetterAndValueStorage<T>(defaultValue: T, key: string) {
  const [value, setValue] = useLocalStorageState(defaultValue, key);
  const result: SetterAndValue<T> = {
    set: (data) => {
      setValue(data);
    },
    value,
  };
  return result;
}

export function useSessionStorageState<T>(
  defaultValue: T,
  key: string,
  clearFirst = false,
) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!clearFirst) {
      const stickyValue = window.sessionStorage.getItem(key);

      if (
        stickyValue !== null &&
        stickyValue &&
        stickyValue !== 'undefined' &&
        stickyValue.length > 0
      ) {
        setValue(JSON.parse(stickyValue));
      }
    }
  }, [key, clearFirst]);

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const result: [T, React.Dispatch<React.SetStateAction<T>>] = [
    value,
    setValue,
  ];
  return result;
}

export function useSetterAndValueSession<T>(defaultValue: T, key: string) {
  const [value, setValue] = useSessionStorageState(defaultValue, key);
  const result: SetterAndValue<T> = {
    set: (data) => {
      setValue(data);
    },
    value,
  };
  return result;
}
