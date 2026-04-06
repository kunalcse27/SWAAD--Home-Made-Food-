import { useState, useEffect } from 'react';
import { debounce } from '../utils/helpers';

/**
 * Debounced search hook
 * @param {string} value - input value
 * @param {number} delay - debounce delay in ms
 * @returns {string} debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * Scroll lock hook — prevents body scroll when modal is open
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [locked]);
}

/**
 * useIntersection — trigger function when element enters viewport
 */
export function useIntersection(ref, callback, options = {}) {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);
}

/**
 * useLocalStorage — state synced with localStorage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) { console.error(error); }
  };
  return [storedValue, setValue];
}
