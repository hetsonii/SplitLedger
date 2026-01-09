/**
 * Converts a string to title case (capitalizes first letter of each word)
 * Examples:
 * - "het soni" -> "Het Soni"
 * - "john doe" -> "John Doe"
 */
export const toTitleCase = (str) => {
  if (!str) return str;
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};