/**
 * Formats a phone number by adding a leading zero if it doesn't have one
 * @param {string} phone - The phone number to format
 * @returns {string} - The formatted phone number with a leading zero, or "Not available" if no phone
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "Not available";
  
  // If the phone number doesn't start with 0, add it
  return phone.startsWith('0') ? phone : `0${phone}`;
}; 