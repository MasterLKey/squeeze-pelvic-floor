import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory cache so all reads remain synchronous (identical API to MMKV).
// Call loadStorage() once at app startup to seed the cache from disk.
const cache = new Map<string, string>();

export async function loadStorage(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length === 0) return;
    const pairs = await AsyncStorage.multiGet(keys);
    for (const [key, value] of pairs) {
      if (value !== null) cache.set(key, value);
    }
  } catch {
    // non-fatal: app works from empty cache
  }
}

export function getItem<T>(key: string): T | null {
  const value = cache.get(key);
  if (value === undefined) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export function setItem<T>(key: string, value: T): void {
  const str = JSON.stringify(value);
  cache.set(key, str);
  AsyncStorage.setItem(key, str).catch(() => {});
}

export function removeItem(key: string): void {
  cache.delete(key);
  AsyncStorage.removeItem(key).catch(() => {});
}

export function getBool(key: string, defaultValue = false): boolean {
  const value = cache.get(key);
  if (value === undefined) return defaultValue;
  try {
    return JSON.parse(value) as boolean;
  } catch {
    return defaultValue;
  }
}

export function setBool(key: string, value: boolean): void {
  setItem(key, value);
}
