/**
 * DOM manipulation utilities for CloudLab pages
 */

/**
 * Extracts experiment name from CloudLab status page
 * @returns {string|null} Experiment name or null if not found
 */
function getExperimentName() {
    const allTds = document.querySelectorAll("td.border-none");
    for (let i = 0; i < allTds.length; i++) {
        if (allTds[i].textContent.trim() === "Name:") {
            const nameTd = allTds[i + 1];
            if (nameTd) {
                return nameTd.textContent.trim();
            }
        }
    }
    return null;
}

/**
 * Checks if current page is CloudLab status page
 * @returns {boolean} True if on status.php page
 */
function isStatusPage() {
    return window.location.href.includes("www.cloudlab.us/status.php");
}

/**
 * Finds the expiration date element on the page
 * @returns {Element|null} The expiration date element or null
 */
function findExpirationDateElement() {
    return document.getElementById("quickvm_expires");
}