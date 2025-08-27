const connectedPopups = new Set();
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup-connection") {
    // Add this popup to our connected set
    connectedPopups.add(port);
    
    // Remove when disconnected
    port.onDisconnect.addListener(() => {
      connectedPopups.delete(port);
    });
  }
});

// Function to notify all connected popups of new stats
function notifyPopups(stats) {
  connectedPopups.forEach(port => {
    try {
      port.postMessage({ type: "EXT_STATS_UPDATED", data: stats });
    } catch (error) {
      // Remove disconnected ports
      connectedPopups.delete(port);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "EXT_STATS_UPDATE") {
    
    chrome.storage.local.set({ gameStats: request.data }, () => {
      console.log('Stats saved!', request.data);
    });
    notifyPopups(request.data);
  }

  if (request.type === "EXT_GET_STATS") {
    chrome.storage.local.get(['gameStats'], (result) => {
      sendResponse(result.gameStats || {});
    });
    return true;
  }
});