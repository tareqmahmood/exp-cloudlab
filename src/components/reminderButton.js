/**
 * Reminder button component for CloudLab experiments
 */

/**
 * Button styling configuration
 */
const BUTTON_STYLES = {
    padding: "6px 12px",
    backgroundColor: "#1a73e8",
    color: "#ffffff",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "500",
    border: "none",
    textDecoration: "none",
    display: "inline-block",
    marginLeft: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
};

const BUTTON_HOVER_COLOR = "#155ab6";

/**
 * Creates and styles a reminder button
 * @param {string} calendarUrl - Google Calendar URL
 * @returns {HTMLAnchorElement} Styled button element
 */
function createReminderButton(calendarUrl) {
    const link = document.createElement("a");
    link.href = calendarUrl;
    link.textContent = "Remind Me 📅";
    link.target = "_blank";
    
    // Apply styles
    Object.assign(link.style, BUTTON_STYLES);
    
    // Add hover effects
    link.addEventListener("mouseenter", () => {
        link.style.backgroundColor = BUTTON_HOVER_COLOR;
    });
    link.addEventListener("mouseleave", () => {
        link.style.backgroundColor = BUTTON_STYLES.backgroundColor;
    });

    return link;
}

/**
 * Injects reminder button next to expiration date
 * @param {Element} dateSpan - Element containing expiration date
 */
async function injectReminderButton(dateSpan) {
    if (!isStatusPage()) {
        console.warn("Not on status.php page, skipping calendar link injection.");
        return;
    }

    const dateText = dateSpan.textContent.trim();
    const expiryDate = parseCloudLabDate(dateText);
    
    if (!expiryDate) {
        console.warn("Invalid expiry date:", dateText);
        return;
    }

    const expName = getExperimentName();
    if (!expName) {
        console.warn("Could not extract experiment name");
        return;
    }

    const expLink = window.location.href;
    const reminderTime = createReminderDate(expiryDate);
    
    try {
        const userIndex = await getUserIndex();
        const calendarUrl = createCalendarLink(reminderTime, expName, expLink, userIndex);
        const button = createReminderButton(calendarUrl);
        dateSpan.parentElement.appendChild(button);
    } catch (error) {
        console.error("Failed to inject reminder button:", error);
    }
}