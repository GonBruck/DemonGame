// Automatic retrieval of userId from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const userId = getCookie('demon');
if(!userId){
  console.log("Error retrieving user id, check if you are logged in")
  console.log("Error retrieving user id, check if you are logged in")
  console.log("Error retrieving user id, check if you are logged in")
}

// Page-specific functionality mapping
// This would be usefull if i add stuff to specific pages
const extensionPageHandlers = {
  '/active_wave.php': initWaveMods,
  '/game_dash.php': initDashboardTools,
  '/battle.php': initBattleMods,
  '/chat.php': initChatMods,
  // more pages here with their handlers
};

function initWaveMods() {
  initGateCollapse()
  initMonsterFilter()
  initInstaLoot()
  initContinueBattleFirst()
}

function initDashboardTools() {
  console.log("Initializing dashboard tools");
}

// TODO
function initBattleMods(){
  initReducedImageSize()
  initPossibleLootReached()
  initTotalOwnDamage()
  initAnyClickClosesModal()
}

function initChatMods(){
    const logEl = document.getElementById("chatLog");
    if (logEl) {
      logEl.scrollTop = logEl.scrollHeight;
    }
}

// MAIN INIT AND CHECKS
// Check if we're on a page with the game topbar (it means we are in the game)
if (document.querySelector('.game-topbar')) {
  // We should wait for the DOM to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSideBar);
  } else {
    // Sidebar always first so we dont mess the layout
    initSideBar();
    // stats tracker was intended to be the popup with stats
    // and update live and always on top of any website, i left it out for now
    // since it was a little buggy, left it in as example
    //initStatsTracker();
    // same for this this styles, it injects a styles.css, not using it much
    // but left here as example
    injectStyles();
    initPageSpecificFunctionality()
  }
}


function initSideBar(){
  // Create and inject the sidebar and layout structure
  // Create the main wrapper container (some pages dont have it and we have to create it)
  const noContainerPage = !document.querySelector('.container') && !document.querySelector('.wrap');
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'main-wrapper';
  
  // Create the sidebar
  const sidebar = document.createElement('aside');
  sidebar.id = 'game-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="game_dash.php" style="text-decoration:none;"><h2>Game Menu</h2></a>
    </div>
    <ul class="sidebar-menu">
      <li><a href="event_goblin_feast.php"><img src="/images/events/goblin_fest/compressed_goblin_feast.webp" alt="Goblin Feast"> Goblin Feast</a></li>
      <li><a href="active_wave.php?gate=3&wave=3"><img src="images/gates/gate_688e438aba7f24.99262397.webp" alt="Gate"> Gate Grakthar</a></li>
      <li><a href="inventory.php"><img src="images/menu/compressed_chest.webp" alt="Inventory"> Inventory & Equipment</a></li>
      <li><a href="pets.php"><img src="images/menu/compressed_eggs_menu.webp" alt="Pets"> Pets & Eggs</a></li>
      <li><a href="stats.php"><img src="images/menu/compressed_stats_menu.webp" alt="Stats"> Stats</a></li>
      <li><a href="blacksmith.php"><img src="images/menu/compressed_crafting.webp" alt="Blacksmith"> Blacksmith</a></li>
      <li><a href="merchant.php"><img src="images/menu/compressed_merchant.webp" alt="Merchant"> Merchant</a></li>
      <li><a href="achievements.php"><img src="images/menu/compressed_achievments.webp" alt="Achievements"> Achievements</a></li>
      <li><a href="collections.php"><img src="images/menu/compressed_collections.webp" alt="Collections"> Collections</a></li>
      <li><a href="guide.php"><img src="images/menu/compressed_guide.webp" alt="Guide"> How To Play</a></li>
      <li><a href="weekly.php"><img src="images/menu/weekly_leaderboard.webp" alt="Leaderboard"> Weekly Leaderboard</a></li>
      <li><a href="chat.php"><img src="images/menu/compressed_chat.webp" alt="Chat"> Global Chat</a></li>
      <li><a href="patches.php"><img src="images/menu/compressed_patches.webp" alt="PatchNotes"> Patch Notes</a></li>
      <li><a href="index.php"><img src="images/menu/compressed_manga.webp" alt="Manga"> Manga-Manhwa-Manhua</a></li>
    </ul>
  `;
  
  const contentArea = document.createElement('div');
  contentArea.className = 'content-area';
  if(noContainerPage){
    const topbar = document.querySelector('.game-topbar');
    const allElements = Array.from(document.body.children);
    const topbarIndex = allElements.indexOf(topbar);
    
    for (let i = topbarIndex + 1; i < allElements.length; i++) {
      if (!allElements[i].classList.contains('main-wrapper') && 
          !allElements[i].id !== 'sidebarToggle') {
        contentArea.appendChild(allElements[i]);
      }
    }
  } else {
    // Move existing container to content area
    const existingContainer = document.querySelector('.container') || document.querySelector('.wrap');
    if (existingContainer) {
      contentArea.appendChild(existingContainer);
    }

  }
  
  // Add sidebar and content area to wrapper
  mainWrapper.appendChild(sidebar);
  mainWrapper.appendChild(contentArea);
  
  /*
  // Create mobile toggle button ** TODO ** since i dont play on mobile i probably wont fix this
  const toggleButton = document.createElement('button');
  toggleButton.className = 'menu-toggle';
  toggleButton.id = 'sidebarToggle';
  toggleButton.textContent = '☰';
  toggleButton.style.display = 'none';
  */
  // Add everything to the body
  document.body.appendChild(mainWrapper);
  //document.body.appendChild(toggleButton);
  
  // Add the necessary CSS
  document.body.style.paddingTop = "55px";
  document.body.style.paddingLeft = "0px";
  document.body.style.margin="0px";
  const style = document.createElement('style');
  style.textContent = `
    /* Main layout with sidebar */
    .main-wrapper {
      display: flex;
      min-height: calc(100vh - 74px);
    }
    
    /* Sidebar styles */
    #game-sidebar {
      width: 250px;
      background: rgba(18,18,18,0.95);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      flex-shrink: 0;
      padding: 15px 0;
      overflow-y: auto;
      position: fixed;
      height: calc(100vh - 74px);
    }
    
    .sidebar-header {
      padding: 0 20px 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      margin-bottom: 15px;
    }
    
    .sidebar-header h2 {
      color: #FFD369;
      margin: 0;
      font-size: 1.4rem;
    }
    
    .sidebar-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar-menu li {
      /*border-bottom: 1px solid #2a2a2a;*/
    }
    
    .sidebar-menu li:last-child {
      border-bottom: none;
    }
    
    .sidebar-menu a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: #e0e0e0;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .sidebar-menu a:hover {
      background-color: #252525;
      color: #FFD369;
    }
    
    .sidebar-menu img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    /* Content area */
    .content-area {
      flex: 1;
      padding: 20px;
      margin-left: 250px;
    }
    
    
    /* Mobile styles */
    /*
    @media (max-width: 900px) {
      .main-wrapper {
        flex-direction: column;
      }
      
      #game-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #333;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      #game-sidebar.sidebar-open {
        max-height: 400px;
      }
      
      .menu-toggle {
        display: block;
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1e1e1e;
        border: 1px solid #333;
        color: #FFD369;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }
    }
    */
  `;
  document.head.appendChild(style);
  
  /*
  // *** MOBILE ***
  toggleButton.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-open');
  });
  function checkMobile() {
    if (window.innerWidth <= 900) {
      toggleButton.style.display = 'block';
    } else {
      toggleButton.style.display = 'none';
      sidebar.classList.remove('sidebar-open');
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);
  // *** END MOBILE ***
  */
}

function initStatsTracker() {  
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
    const stats = extractStats();
    try {
      chrome.runtime.sendMessage({
        type: "EXT_STATS_UPDATE",
        data: stats
      });
    } catch (error) {
      if (error.message.includes("Extension context invalidated")) {
        console.warn("Extension context invalidated. Stats not sent.");
      } else {
        console.error("Error sending stats to background:", error);
      }
    }
  }

  // Send initial stats
  sendStatsToBackground();

  // Set up MutationObserver to watch for changes
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver((mutations) => {
    clearTimeout(window.statsTimeout);
    window.statsTimeout = setTimeout(sendStatsToBackground, 500);
  });
  observer.observe(targetNode, config);
}

// Function that injects the styles
// not in use
function injectStyles() {
  if (!document.getElementById('demon-extension-styles')) {
    const link = document.createElement('link');
    link.id = 'demon-extension-styles';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('styles.css');
    document.head.appendChild(link);
  }
}

function initPageSpecificFunctionality() {
  const currentPath = window.location.pathname;
  
  for (const [path, handler] of Object.entries(extensionPageHandlers)) {
    if (currentPath.includes(path)) {
      console.log(`Initializing ${path} functionality`);
      handler();
      break;
    }
  }
}


//#region Monster filters
async function loadFilterSettings() {
  //minimizeCards()
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: "EXT_GET_FILTER_SETTINGS" },
      (settings) => {
        resolve(settings || {});
      }
    );
  });
}

// not sure why use an observer since now I wait for DOM to load
async function initMonsterFilter() {
  const observer = new MutationObserver(async (mutations, obs) => {
    const monsterList = document.querySelectorAll('.monster-card');
    if (monsterList) {
      obs.disconnect();
      const settings = await loadFilterSettings();
      createFilterUI(monsterList,settings);
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function createFilterUI(monsterList, settings) {
  // Create filter controls
  const filterContainer = document.createElement('div');
  filterContainer.style.cssText = `
    padding: 10px;
    background: #2d2d3d;
    border-radius: 5px;
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  `;
  
  // Add filter HTML
  filterContainer.innerHTML = `
    <input type="text" id="monster-name-filter" placeholder="Filter by name" 
           style="padding: 5px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a;">
    <label style="display: flex; align-items: center; gap: 5px;">
      <input type="checkbox" id="hide-dead-monsters">
      Hide defeated
    </label>
  `;
  
  // Insert before the monster list
  document.querySelector('.content-area').insertBefore(filterContainer, document.querySelector('.monster-container'));
  
  document.getElementById('monster-name-filter').addEventListener('input', applyMonsterFilters);
  document.getElementById('hide-dead-monsters').addEventListener('change', applyMonsterFilters);
  // Apply saved settings
  if (settings.nameFilter) {
    document.getElementById('monster-name-filter').value = settings.nameFilter;
  }
  
  if (settings.hideDead) {
    document.getElementById('hide-dead-monsters').checked = settings.hideDead;
  }
  
  // Apply filters immediately if settings exist
  if (settings.nameFilter || settings.hideDead) {
    applyMonsterFilters();
  }
}

function applyMonsterFilters() {
  const nameFilter = document.getElementById('monster-name-filter').value.toLowerCase();
  const hideDead = document.getElementById('hide-dead-monsters').checked;
  
  const monsters = document.querySelectorAll('.monster-card');
  
  monsters.forEach(monster => {
    const monsterName = monster.querySelector('h3').textContent.toLowerCase();
    const isDead = monster.querySelector('img').classList.contains('grayscale');
    const hasLoot = monster.innerText.includes("Loot");
    
    const nameMatch = monsterName.includes(nameFilter);
    const shouldHideDead = hideDead && isDead && !hasLoot;
    
    if ((nameFilter && !nameMatch) || shouldHideDead) {
      monster.style.display = 'none';
    } else {
      monster.style.display = '';
    }
  });

  // Saving filter settings :D
  const settings = {
    nameFilter: document.getElementById('monster-name-filter').value,
    hideDead: document.getElementById('hide-dead-monsters').checked
  };
  chrome.runtime.sendMessage({
    type: "EXT_SAVE_FILTER_SETTINGS",
    data: settings
  });
}

// reduces monster cards size and removes useless information
// not in use, needs to add more styling to look good
function minimizeCards(){
  document.querySelectorAll('.monster-card > :nth-child(5)').forEach(x => x.remove());
  document.querySelectorAll('.monster-card > :nth-child(4)').forEach(x => x.remove());
  document.querySelector('.monster-container').style.gap = "4px";
  document.querySelectorAll('.monster-card').forEach(x=> {
    x.style.padding = '4px';
    x.style.width="150px";
    x.querySelector('br').remove()
    x.querySelector('h3').style.margin = "1px"
  })
}
//#endregion

//#region Loot in wave page
function initInstaLoot(){
  if(!document.getElementById('lootModal')){
    
    var modal = document.createElement('div');
    modal.innerHTML = `<div id="lootModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center;">
    <div style="background:#2a2a3d; border-radius:12px; padding:20px; max-width:90%; width:400px; text-align:center; color:white; overflow-y:auto; max-height:80%;">
        <h2 style="margin-bottom:15px;">🎁 Loot Gained</h2>
        <div id="lootItems" style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;"></div>
        <br>
        <button class="join-btn" onclick="document.getElementById('lootModal').style.display='none'" style="margin-top:10px;">Close</button>
    </div>
</div>`
    var notif = document.createElement('div');
    notif.style = `position: fixed; top: 50vh; right: 40vw;background: #2ecc71;color: white;padding: 12px 20px;border-radius: 10px;box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);font-size: 15px;display: none;z-index: 9999;`
    notif.id = "notification";
    document.querySelector('.content-area').appendChild(modal.firstElementChild).parentNode.appendChild(notif)
    document.getElementById('lootModal').addEventListener('click', function(event) {
      this.style.display = 'none';
    });
  }

  document.querySelectorAll('.monster-card > a').forEach(x=>{ 
    if(x.innerText.includes('Loot')){
        var instaBtn = document.createElement('button');
        instaBtn.onclick = function() {
          lootWave(x.href.split("id=")[1])
        };
        instaBtn.className = "join-btn"
        instaBtn.innerText = "Insta 💰"
        x.parentNode.append(instaBtn)
    }
})
}
function lootWave(monsterId){
  
  fetch('loot.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'monster_id='+monsterId+'&user_id='+ userId
})
.then(res => res.json())
.then(data => {
    if (data.status === 'success') {
        const lootContainer = document.getElementById('lootItems');
        lootContainer.innerHTML = '';

        data.items.forEach(item => {
            const div = document.createElement('div');
            div.style = 'background:#1e1e2f; border-radius:8px; padding:10px; text-align:center; width:80px;';
            div.innerHTML = `
                <img src="${item.IMAGE_URL}" alt="${item.NAME}" style="width:64px; height:64px;"><br>
                <small>${item.NAME}</small>
            `;
            lootContainer.appendChild(div);
        });

        document.getElementById('lootModal').style.display = 'flex';
    } else {
        showNotification(data.message || 'Failed to loot.', 'error');
    }
})
.catch(() => showNotification("Server error", 'error'));
}
function showNotification2(err){
  console.log('Error:',err);
}
function showNotification(msg, type = 'success') {
  const note = document.getElementById('notification');
  note.innerHTML = msg;
  note.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
  note.style.display = 'block';
  setTimeout(() => {
      note.style.display = 'none';
  }, 3000);
}
//#endregion

//#region Gate info collapsed
function initGateCollapse() {
  const gateInfo = document.querySelector('.gate-info');
  const header = gateInfo.querySelector('.gate-info-header');
  const scrollContent = gateInfo.querySelector('.gate-info-scroll');
  
  if (!header || !scrollContent) return;
  
  header.classList.add('collapsible-header');
  scrollContent.classList.add('collapsible-content');
  scrollContent.classList.toggle('collapsed')
  
  header.addEventListener('click', function() {
    scrollContent.classList.toggle('collapsed');
    
    /*
    // Save the collapsed state
    const isCollapsed = scrollContent.classList.contains('collapsed');
    chrome.storage.local.set({ 
      gateInfoCollapsed: isCollapsed 
    });
    */
  });
  
  /*
  // Load saved collapsed state
  chrome.storage.local.get(['gateInfoCollapsed'], (result) => {
    if (result.gateInfoCollapsed) {
      scrollContent.classList.add('collapsed');
    }
  });
  */
}
//#endregion

function initContinueBattleFirst(){
  document.querySelectorAll('.monster-card').forEach(x=>{
    if(x.innerText.includes('Continue the Battle')){
        document.querySelector('.monster-container').prepend(x)
    }
  })
}

function initReducedImageSize(){
  document.getElementById('monsterImage').style.maxHeight="400px";
  document.querySelector('.content-area > .panel').style.justifyItems="center";
  document.querySelector('.hp-bar').style.justifySelf="normal";
}
function initPossibleLootReached(){
  //TODO
}
function initTotalOwnDamage(){
  //TODO
}

function initAnyClickClosesModal(){
  document.getElementById('lootModal').addEventListener('click', function(event) {
    this.style.display = 'none';
  });
}
