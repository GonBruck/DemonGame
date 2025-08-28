/*

// Establish a connection to the service worker
const port = chrome.runtime.connect({ name: "popup-connection" });

// Function to update the UI with stats
function updateStatsDisplay(stats) {
  if (stats) {
    document.getElementById('stamina-value').textContent = stats.stamina || 'N/A';
    document.getElementById('level-value').textContent = stats.level || 'N/A';
    document.getElementById('exp-value').textContent = stats.exp || 'N/A';
    document.getElementById('staminatimer-value').textContent = stats.staminaTimer || 'N/A';
  }
}

// Function to show a message when no game tab is found
function showNoGameTabMessage() {
  document.getElementById('stamina-value').textContent = 'N/A';
  document.getElementById('level-value').textContent = 'N/A';
  document.getElementById('exp-value').textContent = 'N/A';
  document.getElementById('staminatimer-value').textContent = 'N/A';
}

// Function to show a loading message
function showLoadingMessage() {
  document.getElementById('stamina-value').textContent = 'Loading...';
  document.getElementById('level-value').textContent = 'Loading...';
  document.getElementById('exp-value').textContent = 'Loading...';
  document.getElementById('staminatimer-value').textContent = 'Loading...';
}

// Show loading message initially
showLoadingMessage();

// Listen for messages from service worker
port.onMessage.addListener((msg) => {
  switch (msg.type) {
    case "EXT_STATS_UPDATED":
      updateStatsDisplay(msg.data);
      break;
    case "EXT_TAB_FOUND":
      console.log("Game tab found:", msg.tabId);
      // Request current stats
      chrome.runtime.sendMessage({ type: "EXT_GET_STATS" }, (response) => {
        updateStatsDisplay(response);
      });
      break;
    case "EXT_NO_GAME_TAB":
      console.log("No game tab found");
      showNoGameTabMessage();
      break;
    default:
      console.log("Unknown message type:", msg.type);
  }
});

// Also listen for storage changes as a backup
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.gameStats) {
    updateStatsDisplay(changes.gameStats.newValue);
  }
});

// Request initial stats
chrome.runtime.sendMessage({ type: "EXT_GET_STATS" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error("Error getting stats:", chrome.runtime.lastError);
    // If we can't get stats, try to find a game tab
    chrome.runtime.sendMessage({ type: "EXT_FIND_GAME_TAB" }, (response) => {
      if (!response.tabId) {
        showNoGameTabMessage();
      }
    });
    return;
  }
  
  if (response && Object.keys(response).length > 0) {
    updateStatsDisplay(response);
  } else {
    // If no stats are available, try to find a game tab
    chrome.runtime.sendMessage({ type: "EXT_FIND_GAME_TAB" }, (response) => {
      if (!response.tabId) {
        showNoGameTabMessage();
      }
    });
  }
});

// Add a refresh button handler (optional)
document.getElementById('refresh-btn')?.addEventListener('click', () => {
  showLoadingMessage();
  chrome.runtime.sendMessage({ type: "EXT_FIND_GAME_TAB" }, (response) => {
    if (!response.tabId) {
      showNoGameTabMessage();
    }
  });
});

// Clean up when popup closes
window.addEventListener('unload', () => {
  port.disconnect();
});
*/