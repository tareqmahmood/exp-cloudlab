/**
 * Chrome storage service for managing user preferences
 */

/**
 * Storage keys configuration
 */
const STORAGE_KEYS = {
    GOOGLE_USER_INDEX: 'googleUserIndex'
};

/**
 * Gets user's Google account index from storage
 * @returns {Promise<number|null>} User index or null
 */
function getUserIndex() {
    return new Promise((resolve) => {
        chrome.storage.sync.get([STORAGE_KEYS.GOOGLE_USER_INDEX], (result) => {
            resolve(result[STORAGE_KEYS.GOOGLE_USER_INDEX] ?? null);
        });
    });
}

/**
 * Saves user's Google account index to storage
 * @param {number} index - Account index to save
 * @returns {Promise<void>}
 */
function saveUserIndex(index) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [STORAGE_KEYS.GOOGLE_USER_INDEX]: index }, resolve);
    });
}