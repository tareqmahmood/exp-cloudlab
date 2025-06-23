/**
 * Google Calendar integration service
 */

/**
 * Configuration for calendar events
 */
const CALENDAR_CONFIG = {
    REMINDER_DURATION_HOURS: 1,
    EVENT_DURATION_MINUTES: 60,
    BASE_URL: "https://www.google.com/calendar"
};

/**
 * Creates a Google Calendar link for experiment reminder
 * @param {Date} startDate - When the reminder should trigger
 * @param {string} expName - Experiment name
 * @param {string} expLink - Link to experiment page
 * @param {number|null} userIndex - Google account index
 * @returns {string} Google Calendar URL
 */
function createCalendarLink(startDate, expName, expLink, userIndex = null) {
    const endDate = new Date(startDate.getTime() + CALENDAR_CONFIG.EVENT_DURATION_MINUTES * 60 * 1000);
    const start = formatDateForCalendar(startDate);
    const end = formatDateForCalendar(endDate);
    
    const title = `⏲️ Exp [${expName}] Ends`;
    const details = `CloudLab experiment expires in ${CALENDAR_CONFIG.REMINDER_DURATION_HOURS} hour\n${expLink}`;

    let baseUrl = CALENDAR_CONFIG.BASE_URL;
    if (userIndex !== null) {
        baseUrl += "/u/" + userIndex;
    }
    
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${start}/${end}`,
        details: details
    });
    
    return `${baseUrl}/render?${params.toString()}`;
}