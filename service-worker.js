/*
const connectedPopups = new Set();

// Function to check if a tab has the game topbar
async function checkTabForTopbar(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!document.getElementsByClassName('game-topbar')[0]
    });
    return results[0]?.result;
  } catch (error) {
    console.error(`Error checking tab ${tabId} for topbar:`, error);
    return false;
  }
}

// Function to inject content script into a tab
async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-script.js']
    });
    console.log(`Content script injected into tab ${tabId}`);
    return true;
  } catch (error) {
    console.error(`Error injecting content script into tab ${tabId}:`, error);
    return false;
  }
}

// Find and inject into the active game tab
async function findAndInjectIntoGameTab() {
  try {
    // First, check the active tab
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (activeTabs.length > 0) {
      const activeTab = activeTabs[0];
      
      // Check if the active tab is a game page with topbar
      if (activeTab.url && activeTab.url.includes('demonicscans.org')) {
        const hasTopbar = await checkTabForTopbar(activeTab.id);
        
        if (hasTopbar) {
          await injectContentScript(activeTab.id);
          return activeTab.id;
        }
      }
    }
    
    // If active tab doesn't have topbar, check all tabs
    const allTabs = await chrome.tabs.query({ url: "https://demonicscans.org/*" });
    
    for (const tab of allTabs) {
      if (tab.id === activeTabs[0]?.id) continue; // Skip already checked active tab
      
      const hasTopbar = await checkTabForTopbar(tab.id);
      if (hasTopbar) {
        await injectContentScript(tab.id);
        return tab.id;
      }
    }
    
    console.log("No tab with game topbar found");
    return null;
  } catch (error) {
    console.error("Error in findAndInjectIntoGameTab:", error);
    return null;
  }
}

// Listen for connection from popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup-connection") {
    connectedPopups.add(port);
    
    // When popup connects, try to find and inject into a game tab
    findAndInjectIntoGameTab().then(tabId => {
      if (tabId) {
        port.postMessage({ type: "EXT_TAB_FOUND", tabId });
      } else {
        port.postMessage({ type: "EXT_NO_GAME_TAB" });
      }
    });
    
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
*/

// Listen for messages
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
  
  if (request.type === "EXT_FIND_GAME_TAB") {
    findAndInjectIntoGameTab().then(tabId => {
      sendResponse({ tabId });
    });
    return true;
  }

  if (request.type === "EXT_SAVE_FILTER_SETTINGS") {
    chrome.storage.local.set({ 
      monsterFilters: request.data 
    }, () => {
      console.log('Filter settings saved', request.data);
    });
  }
  
  if (request.type === "EXT_GET_FILTER_SETTINGS") {
    chrome.storage.local.get(['monsterFilters'], (result) => {
      sendResponse(result.monsterFilters || {});
    });
    return true; 
  }
});

/*
// Inject into relevant tabs when they update
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('demonicscans.org')) {
    const hasTopbar = await checkTabForTopbar(tabId);
    if (hasTopbar) {
      await injectContentScript(tabId);
    }
  }
});

// Inject into existing tabs on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ url: "https://demonicscans.org/*" }, (tabs) => {
    tabs.forEach(tab => {
      checkTabForTopbar(tab.id).then(hasTopbar => {
        if (hasTopbar) {
          injectContentScript(tab.id);
        }
      });
    });
  });
});

*/