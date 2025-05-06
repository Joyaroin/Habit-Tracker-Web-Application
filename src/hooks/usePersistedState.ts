import { useState, useEffect } from 'react';

/**
 * A custom hook that syncs state with localStorage.
 *
 * @param key - The key under which the state is stored in localStorage.
 * @param defaultValue - The default value to use if no stored value is found.
 * @returns A tuple with the state and a function to update the state.
 */
function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T;
      } catch (error) {
        console.error('Error parsing localStorage value', error);
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
