import { useCallback, useState } from 'react';

/**
 * State backed by localStorage. Reads and writes are wrapped so the app keeps
 * working in private windows and when site data is blocked.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage unavailable — keep the value in memory for this session.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
