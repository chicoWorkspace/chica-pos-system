/* eslint-disable new-cap */
import { useState } from "react";
import {eMap} from "@repo/lib";
import { useSessionStorageState } from "./use-storage-and-session";

export interface MapStateResult<T> {
  getMap: () => eMap<T>;
  get: (key?: string) => T | undefined;
  set: (key: string, value: T) => void;
  delete: (key: string) => void;
  resetDefault: () => void;
}

export function useMapState<T>(defaultMap?: eMap<T>) {
  const map = defaultMap ?? new eMap<T>();
  const [mapValue, setMapValue] = useState(map.getMap());
  const result: MapStateResult<T> = {
    resetDefault() {
      setMapValue(map.getMap());
    },
    getMap() {
      return new eMap(mapValue);
    },
    get(key?: string) {
      if (!key) {
        return undefined;
      }
      const getResult = new eMap(mapValue);
      if (getResult.has(key)) {
        return getResult.get(key);
      }
      return undefined;
    },
    set(key: string, value: T) {
      setMapValue((prev) => {
        const setResult = new eMap(prev);
        setResult.set(key, value);
        return setResult.getMap();
      });
    },
    delete(key: string) {
      setMapValue((prev) => {
        const newMap = new eMap(prev);
        newMap.delete(key);
        return newMap.getMap();
      });
    },
  };
  return result;
}

export function useSessionMapState<T>(
  key: string,
  defaultMap?: eMap<T>,
  clearFirst = false
) {
  const map = defaultMap ?? new eMap<T>();
  const [mapValue, setMapValue] = useSessionStorageState(
    map.getMap(),
    key,
    clearFirst
  );
  const result: MapStateResult<T> = {
    resetDefault() {
      setMapValue(map.getMap());
    },
    getMap() {
      return new eMap(mapValue);
    },
    get(getKey?: string) {
      if (!getKey) {
        return undefined;
      }
      const getResult = new eMap(mapValue);
      if (getResult.has(getKey)) {
        return getResult.get(getKey);
      }
      return undefined;
    },
    set(setKey: string, value: T) {
      setMapValue((prev) => {
        const setResult = new eMap(prev);
        setResult.set(setKey, value);
        return setResult.getMap();
      });
    },
    delete(delKey: string) {
      setMapValue((prev) => {
        const newMap = new eMap(prev);
        newMap.delete(delKey);
        return newMap.getMap();
      });
    },
  };
  return result;
}
