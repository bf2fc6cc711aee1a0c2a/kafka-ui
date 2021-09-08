import { useEffect, useRef } from 'react';

export const useTimeout: any = <T extends () => void>(
  callback: T,
  delay: number
) => {
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
    return;
  }, [callback, delay]);
};
