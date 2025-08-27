function extractStats() {
  const staminaElement = document.querySelector('.gtb-value');
  const staminaTimerElement = document.querySelector('#stamina_timer');
  const levelElement = document.querySelector('.gtb-level');
  const expElement = document.querySelector('.gtb-exp-top');
  const stamina = staminaElement ? staminaElement.innerText : 'N/A';
  const staminaTimer = staminaTimerElement ? staminaTimerElement.innerText : 'N/A'
  const level = levelElement ? levelElement.innerText.substring(3) : 'N/A';
  const exp = expElement ? expElement.innerText.substring(5) : 'N/A';
  return { stamina, staminaTimer, level, exp };
}

function sendStatsToBackground() {
  if(document.getElementsByClassName('game-topbar')[0]){
    const stats = extractStats();
    chrome.runtime.sendMessage({
      type: "EXT_STATS_UPDATE",
      data: stats
    });
  }
}

sendStatsToBackground();

const targetNode = document.body;
const config = { childList: true, subtree: true };
const observer = new MutationObserver((mutations) => {
  clearTimeout(window.statsTimeout);
  window.statsTimeout = setTimeout(sendStatsToBackground, 500);
});
observer.observe(targetNode, config);