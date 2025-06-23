function formatDateForCalendar(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return date.getUTCFullYear()
        + pad(date.getUTCMonth() + 1)
        + pad(date.getUTCDate()) + 'T'
        + pad(date.getUTCHours())
        + pad(date.getUTCMinutes())
        + pad(date.getUTCSeconds()) + 'Z';
}

function getExperimentName() {
    const allTds = document.querySelectorAll("td.border-none");
    for (let i = 0; i < allTds.length; i++) {
        if (allTds[i].textContent.trim() === "Name:") {
            const nameTd = allTds[i + 1]; // The next <td> contains the name
            if (nameTd) {
                return nameTd.textContent.trim();
            }
        }
    }
    return null;
}

function createCalendarLink(startDate, expName, expLink, index = null) {
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 60 mins
    const start = formatDateForCalendar(startDate);
    const end = formatDateForCalendar(endDate);
    const title = `Exp [${expName}] Ends`;
    const details = "CloudLab experiment expires in 1 hour\n" + expLink;

    let baseUrl = "https://www.google.com/calendar";
    if (index !== null) {
        baseUrl += "/u/" + index;
    }
    return baseUrl + `/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}`;
}


function expExpiryInjectLink(dateSpan) {
    // return if it is not status.php page
    if (!window.location.href.includes("www.cloudlab.us/status.php")) {
        console.warn("Not on status.php page, skipping calendar link injection.");
        return;
    }

    const dateText = dateSpan.textContent.trim(); // e.g., "Jun 25, 2025 6:07 PM"
    const expiryDate = new Date(dateText);
    if (isNaN(expiryDate)) {
        console.warn("Invalid expiry date:", dateText);
        return;
    }

    const expName = getExperimentName();
    const expLink = window.location.href; // Current page URL
    const reminderTime = new Date(expiryDate.getTime() - 60 * 60 * 1000); // 1 hour before
    

    chrome.storage.sync.get(['googleUserIndex'], (result) => {
        const userIndex = result.googleUserIndex ?? null; // fallback to null
        const calendarUrl = createCalendarLink(reminderTime, expName, expLink, userIndex);
        
        const link = document.createElement("a");
        link.href = calendarUrl;
        link.textContent = "Remind Me 📅";
        link.target = "_blank";
        
        link.style.padding = "6px 12px";
        link.style.backgroundColor = "#1a73e8";
        link.style.color = "#ffffff";
        link.style.borderRadius = "4px";
        link.style.fontSize = "13px";
        link.style.fontWeight = "500";
        link.style.border = "none";
        link.style.textDecoration = "none";
        link.style.display = "inline-block";
        link.style.marginLeft = "10px";
        link.style.cursor = "pointer";
        link.style.transition = "background-color 0.3s ease";
        link.addEventListener("mouseenter", () => {
            link.style.backgroundColor = "#155ab6";
        });
        link.addEventListener("mouseleave", () => {
            link.style.backgroundColor = "#1a73e8";
        });

        dateSpan.parentElement.appendChild(link);
    });
}

// Observe for changes to the DOM
const expirationDateObserver = new MutationObserver(() => {
    const dateSpan = document.getElementById("quickvm_expires");
    if (dateSpan) {
        expirationDateObserver.disconnect(); // Stop observing once found
        expExpiryInjectLink(dateSpan);
    }
});

expirationDateObserver.observe(document.body, { childList: true, subtree: true });
