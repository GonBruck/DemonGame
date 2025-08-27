const port = chrome.runtime.connect({ name: "popup-connection" });

// Listen for messages from service worker
port.onMessage.addListener((msg) => {
  if (msg.type === "EXT_STATS_UPDATED") {
    document.getElementById('stamina-value').textContent = msg.data.stamina || 'N/A';
    document.getElementById('level-value').textContent = msg.data.level || 'N/A';
    document.getElementById('exp-value').textContent = msg.data.exp || 'N/A';
    document.getElementById('staminatimer-value').textContent = msg.data.staminaTimer || 'N/A';
  }
});

chrome.runtime.sendMessage({ type: "EXT_GET_STATS" }, (response) => {
  document.getElementById('stamina-value').textContent = response.stamina || 'N/A';
  document.getElementById('level-value').textContent = response.level || 'N/A';
  document.getElementById('exp-value').textContent = response.exp || 'N/A';
  document.getElementById('staminatimer-value').textContent = response.staminaTimer || 'N/A';
});

window.addEventListener('unload', () => {
  port.disconnect();
});