# exp-cloudlab

<img src="icons/icon192.png" alt="exp-cloudlab icon" width="100"/>

**exp-cloudlab** is a lightweight Chrome extension that enhances the [CloudLab](https://www.cloudlab.us/) experiment status page by adding a "Remind Me 📅" button next to your experiment's expiration date.

When clicked, it creates a **Google Calendar reminder** set **1 hour before the experiment ends**, helping you avoid accidental shutdowns.


## 🚀 Features

- ✅ Automatically detects the expiration date on `status.php`
- 📅 Adds a styled **"Remind Me"** button for quick calendar integration
- 🧠 Supports **multiple Google accounts** via a configurable user index
- 💾 Remembers your preferred account using `chrome.storage.sync`
- 🛠 Includes a configuration page for user settings


## 🛠 Setup Instructions

1. Clone or download the repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder
5. Visit an experiment status page to test


## ⚙️ Configuration

To configure your preferred Google account index:

1. Go to `chrome://extensions`
2. Find **exp-cloudlab** and click **"Details"**
3. Click **"Extension options"**
4. Set your **Google account index** (e.g., `0`, `1`, `2`) and click **Save**

This ensures calendar links open in the correct Google account.

## 🛣️ Roadmap

- [x] Experiment calendar event
- [ ] Reservation calendar event
- [ ] Configurable time and message

