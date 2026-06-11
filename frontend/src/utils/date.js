import { formatDistanceToNow, format, isValid } from 'date-fns';

/**
 * Safely format distance to now without throwing errors.
 * @param {string|Date} dateString 
 * @returns {string} Relative formatted distance or fallback text
 */
export const safeFormatDistance = (dateString) => {
  if (!dateString) return 'some time';
  const d = new Date(dateString);
  return isValid(d) ? formatDistanceToNow(d) : 'some time';
};

/**
 * Safely format a date without throwing errors.
 * @param {string|Date} dateString 
 * @param {string} formatStr 
 * @returns {string} Formatted date or fallback text
 */
export const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
  if (!dateString) return 'unknown date';
  const d = new Date(dateString);
  return isValid(d) ? format(d, formatStr) : 'unknown date';
};
