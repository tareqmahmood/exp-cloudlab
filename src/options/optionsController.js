/**
 * Options page controller for managing user preferences
 */

class OptionsController {
    constructor() {
        this.elements = {
            input: null,
            saveBtn: null,
            status: null
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.loadSettings();
            this.attachEventListeners();
        });
    }

    initializeElements() {
        this.elements.input = document.getElementById('userIndex');
        this.elements.saveBtn = document.getElementById('saveBtn');
        this.elements.status = document.getElementById('status');
    }

    async loadSettings() {
        try {
            const userIndex = await getUserIndex();
            if (userIndex !== null) {
                this.elements.input.value = userIndex;
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    attachEventListeners() {
        this.elements.saveBtn.addEventListener('click', () => {
            this.saveSettings();
        });
    }

    async saveSettings() {
        const index = parseInt(this.elements.input.value, 10);
        
        if (isNaN(index) || index < 0) {
            this.showStatus("Please enter a valid number (0 or greater)", "error");
            return;
        }

        try {
            await saveUserIndex(index);
            this.showStatus("Saved!", "success");
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showStatus("Failed to save settings", "error");
        }
    }

    showStatus(message, type = "success") {
        this.elements.status.textContent = message;
        this.elements.status.style.color = type === "error" ? "red" : "green";
        
        setTimeout(() => {
            this.elements.status.textContent = "";
        }, 3000);
    }
}

// Initialize controller
new OptionsController();