import { useEffect, useRef } from 'react';

export const useTimeout: any = (callback: any, delay: number) => {
  const savedCallback = useRef<any>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
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
