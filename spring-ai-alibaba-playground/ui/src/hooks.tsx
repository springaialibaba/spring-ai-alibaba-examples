import { useEffect, useRef } from "react";
import { throttle } from "./utils";

export const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T => {
  const timeoutRef = useRef<number>();

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn as T;
};

export const useThrottle = (func: (...args: any[]) => void, time: number) => {
  const throttledFunc = throttle(func, time);
  return throttledFunc;
};
