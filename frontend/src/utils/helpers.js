// Utility helpers for SWAAD platform

/**
 * Format a price in INR locale
 * @param {number} amount
 * @returns {string} e.g. "₹2,500"
 */
export const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

/**
 * Truncate text to a given length
 * @param {string} text
 * @param {number} max
 */
export const truncate = (text, max = 80) =>
  text.length > max ? text.slice(0, max) + '…' : text;

/**
 * Format a date to Indian locale short form
 * @param {Date|string} date
 */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Calculate savings between monthly and quarterly plans
 */
export const calcSavings = (monthly, quarterly) =>
  Math.round(monthly * 3 - quarterly);

/**
 * Get initials from a name for avatar fallback
 */
export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

/**
 * Debounce a function call
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Validate Indian mobile number
 */
export const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

/**
 * Validate email
 */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Storage helpers with JSON support
 */
export const storage = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
};
