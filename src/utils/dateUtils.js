/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a Date object for Google Calendar API
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string in ISO format
 */
function formatDateForCalendar(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return date.getUTCFullYear()
        + pad(date.getUTCMonth() + 1)
        + pad(date.getUTCDate()) + 'T'
        + pad(date.getUTCHours())
        + pad(date.getUTCMinutes())
        + pad(date.getUTCSeconds()) + 'Z';
}

/**
 * Parses CloudLab date string and validates it
 * @param {string} dateText - Date string from CloudLab page
 * @returns {Date|null} Parsed date or null if invalid
 */
function parseCloudLabDate(dateText) {
    const date = new Date(dateText);
    return isNaN(date) ? null : date;
}

/**
 * Creates a reminder date by subtracting specified hours
 * @param {Date} expiryDate - Original expiry date
 * @param {number} hoursBeforeDefaults to 1 hour
 * @returns {Date} Reminder date
 */
function createReminderDate(expiryDate, hoursBefore = 1) {
    return new Date(expiryDate.getTime() - hoursBefore * 60 * 60 * 1000);
}