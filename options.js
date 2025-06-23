document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('userIndex');
    const status = document.getElementById('status');
  
    chrome.storage.sync.get(['googleUserIndex'], (result) => {
      if (result.googleUserIndex !== undefined) {
        input.value = result.googleUserIndex;
      }
    });
  
    document.getElementById('saveBtn').addEventListener('click', () => {
      const index = parseInt(input.value, 10);
      if (!isNaN(index)) {
        chrome.storage.sync.set({ googleUserIndex: index }, () => {
          status.textContent = "Saved!";
          setTimeout(() => status.textContent = "", 2000);
        });
      }
    });
  });
  