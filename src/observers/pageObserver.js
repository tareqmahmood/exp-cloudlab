/**
 * DOM observer for detecting page changes and experiment elements
 */

/**
 * Observer configuration
 */
const OBSERVER_CONFIG = {
    childList: true,
    subtree: true
};

/**
 * Creates and manages DOM observer for expiration date element
 */
class ExpirationDateObserver {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new MutationObserver(() => {
            const dateSpan = findExpirationDateElement();
            if (dateSpan) {
                this.disconnect();
                injectReminderButton(dateSpan);
            }
        });

        this.observe();
    }

    observe() {
        if (this.observer) {
            this.observer.observe(document.body, OBSERVER_CONFIG);
        }
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize observer when script loads
new ExpirationDateObserver();