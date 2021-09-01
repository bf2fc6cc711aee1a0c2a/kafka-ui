import { useEffect, useRef } from 'react';

type ISavedCallback = {
  current: unknown;
};

export const useTimeout: any = (callback: unknown, delay: number) => {
  const savedCallback: { current: unknown | any } = useRef<ISavedCallback>();

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
