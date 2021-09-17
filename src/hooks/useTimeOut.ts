import { useEffect, useRef } from 'react';

export const useTimeout = <T extends () => void>(
  callback: T,
  delay: number
): void => {
  const savedCallback = useRef<T>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
};
