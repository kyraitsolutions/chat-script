/**
 * Date & Time Utilities
 * --------------------
 * All date-related helpers should live in this file.
 * Keep this file framework-agnostic and browser-safe.
 */

/**
 * Formats a timestamp into a short relative time string
 * Examples:
 *  - "now"
 *  - "5m"
 *  - "2h"
 *  - "3d"
 *  - "2w"
 *  - "4mo"
 *  - "1y"
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;

  if (diffMs <= 0) return "now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 30) return "now";
  if (minutes < 1) return "1m";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 4) return `${weeks}w`;
  if (months < 12) return `${months}mo`;
  return `${years}y`;
};

/**
 * Formats timestamp to a readable date
 * Example: "Jan 12, 2026"
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats timestamp to time
 * Example: "10:42 AM"
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Returns true if timestamp is today
 */
export const isToday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Returns "Today", "Yesterday", or formatted date
 */
export const formatSmartDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();

  const diffDays = Math.floor(
    (today.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return formatDate(timestamp);
};
