/**
 * Main content script - orchestrates all functionality
 * This file serves as the entry point and coordinates all modules
 */

(function() {
    'use strict';
    
    console.log('exp-cloudlab extension loaded');

    /**
     * Main application class that coordinates all functionality
     */
    class CloudLabExtension {
        constructor() {
            this.observer = null;
            this.isInitialized = false;
            this.init();
        }

        /**
         * Initialize the extension
         */
        init() {
            if (this.isInitialized) return;
            
            // Check if we're on the right page
            if (!this.isCloudLabPage()) {
                console.log('Not on CloudLab page, extension inactive');
                return;
            }

            this.setupObserver();
            this.isInitialized = true;
            console.log('CloudLab extension initialized');
        }

        /**
         * Check if current page is a CloudLab page
         * @returns {boolean}
         */
        isCloudLabPage() {
            return window.location.href.includes('www.cloudlab.us');
        }

        /**
         * Set up DOM observer to watch for experiment elements
         */
        setupObserver() {
            this.observer = new MutationObserver((mutations) => {
                this.handleDOMChanges(mutations);
            });

            // Start observing
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Also check immediately in case the element is already present
            this.checkForExperimentElement();
        }

        /**
         * Handle DOM changes detected by observer
         * @param {MutationRecord[]} mutations
         */
        handleDOMChanges(mutations) {
            // Check if any new nodes contain our target element
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    this.checkForExperimentElement();
                }
            }
        }

        /**
         * Check for experiment expiration element and process it
         */
        checkForExperimentElement() {
            const dateElement = document.getElementById("quickvm_expires");
            
            if (dateElement && !dateElement.hasAttribute('data-reminder-processed')) {
                // Mark as processed to avoid duplicate processing
                dateElement.setAttribute('data-reminder-processed', 'true');
                
                // Stop observing once we've found and processed the element
                if (this.observer) {
                    this.observer.disconnect();
                }

                this.processExperimentExpiration(dateElement);
            }
        }

        /**
         * Process the experiment expiration element
         * @param {Element} dateElement - The element containing expiration date
         */
        async processExperimentExpiration(dateElement) {
            try {
                // Validate we're on the correct page
                if (!isStatusPage()) {
                    console.warn("Not on status.php page, skipping calendar link injection.");
                    return;
                }

                // Extract and validate the expiration date
                const dateText = dateElement.textContent.trim();
                const expiryDate = parseCloudLabDate(dateText);
                
                if (!expiryDate) {
                    console.warn("Invalid expiry date:", dateText);
                    return;
                }

                // Get experiment details
                const expName = getExperimentName();
                if (!expName) {
                    console.warn("Could not extract experiment name");
                    return;
                }

                // Create reminder
                await this.createReminder(dateElement, expiryDate, expName);
                
            } catch (error) {
                console.error("Failed to process experiment expiration:", error);
            }
        }

        /**
         * Create and inject reminder button
         * @param {Element} dateElement - Element to attach button to
         * @param {Date} expiryDate - Experiment expiration date
         * @param {string} expName - Experiment name
         */
        async createReminder(dateElement, expiryDate, expName) {
            try {
                const expLink = window.location.href;
                const reminderTime = createReminderDate(expiryDate, 1); // 1 hour before
                
                // Get user's Google account preference
                const userIndex = await getUserIndex();
                
                // Create calendar link
                const calendarUrl = createCalendarLink(reminderTime, expName, expLink, userIndex);
                
                // Create and inject button
                const button = createReminderButton(calendarUrl);
                dateElement.parentElement.appendChild(button);
                
                console.log(`Reminder button added for experiment: ${expName}`);
                
            } catch (error) {
                console.error("Failed to create reminder:", error);
            }
        }

        /**
         * Clean up resources
         */
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.isInitialized = false;
        }
    }

    // Initialize the extension when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new CloudLabExtension();
        });
    } else {
        // DOM is already ready
        new CloudLabExtension();
    }

    // Handle page navigation (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Page changed, reinitialize if needed
            setTimeout(() => {
                new CloudLabExtension();
            }, 100);
        }
    }).observe(document, { subtree: true, childList: true });

})();
