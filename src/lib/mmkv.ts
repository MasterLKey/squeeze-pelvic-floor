import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'squeeze-storage' });

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (value === undefined) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export function setItem<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  storage.delete(key);
}

export function getBool(key: string, defaultValue = false): boolean {
  const stored = storage.getBoolean(key);
  return stored ?? defaultValue;
}

export function setBool(key: string, value: boolean): void {
  storage.set(key, value);
}
