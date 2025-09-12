// Automatic retrieval of userId from cookie
function getCookieExtension(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const userId = getCookieExtension('demon');
if(!userId){
  // Not logged in
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
  console.log('Not logged in')
}
var alarmInterval = null;
var monsterFiltersSettings = {"hideDead":true,"nameFilter":"","hideImg":false, "monsterAlarm":false,"battleLimitAlarm":false}
// Page-specific functionality mapping
// This would be usefull if i add stuff to specific pages
const extensionPageHandlers = {
  '/active_wave.php': initWaveMods,
  '/game_dash.php': initDashboardTools,
  '/battle.php': initBattleMods,
  '/chat.php': initChatMods,
  '/inventory.php': initInventoryMods,
  '/pets.php': initPetMods,
  '/stats.php': initStatMods,
  '/pvp.php': initPvPMods,
  // more pages here with their handlers
};

function initWaveMods() {
  initGateCollapse()
  initMonsterFilter()
  initInstaLoot()
  initContinueBattleFirst()
  //initAlternativeWaveView()
}

function initPvPMods(){
  initPvPBannerFix()
  initPvPHighlight()
  initPvPCollapsibles()
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

function initInventoryMods(){
  initAlternativeInventoryView()
  initItemTotalDmg()
}

function initPetMods(){
  initPetTotalDmg()
  initPetRequiredFood()
}

function initStatMods(){
  initPlayerAtkDamage()
}

function initFaviconFix() {
  // Test if a favicon already exists
  const existingFavicon = document.querySelector('link[rel*="icon"]');
  
  if (!existingFavicon) {
    // Create a new favicon element
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.href = chrome.runtime.getURL('demon-logo.png'); // Path to your extension logo

    // Add favicon to head
    document.head.appendChild(faviconLink);

    console.log('✅ Favicon successfully added:', faviconLink.href);
  } else {
    // Replace existing favicon with extension logo
    existingFavicon.href = chrome.runtime.getURL('demon-logo.png');
    console.log('✅ Replaced existing favicon with demon-logo.png');
  }

  // Optional: Also add apple-touch-icon for mobile devices
  const appleTouchIcon = document.createElement('link');
  appleTouchIcon.rel = 'apple-touch-icon';
  appleTouchIcon.href = chrome.runtime.getURL('demon-logo.png');
  document.head.appendChild(appleTouchIcon);
}


function initPvPBannerFix(){
  var contentArea = document.querySelector('.content-area');
  var seasonCountdown = document.querySelector('.season-cta');
  var pvpHero = document.querySelector('.pvp-hero');
  pvpHero.style.marginTop = "0px";
  if(seasonCountdown){
    contentArea.prepend(seasonCountdown)
  }
  contentArea.prepend(pvpHero)
  document.querySelector('br').remove()
}

function initPvPHighlight(){
  document.querySelector("table.table > thead > tr").insertAdjacentHTML('afterBegin',`<th style='text-align:center;'>Points</th>`)
  var total = 0;
  document.querySelector("table.table > tbody").querySelectorAll('tr').forEach( x => {
      var res = x.children[2].innerText;
      var role = x.children[0].innerText
      if(role == 'Defender'){
          x.style.background ='#1f2533'
      }
      
      if(res == 'Loss'){
          if(role == 'Defender'){
              x.insertAdjacentHTML('afterBegin',`<td class="" style="color:#ff9a9a;text-align:center">-5</td>`)
              total-=5
          } else {
              x.insertAdjacentHTML('afterBegin',`<td class="" style="color:#ff9a9a;text-align:center">-15</td>`)
              total-=15
          }
      } else if(res == 'Win'){
          if(role == 'Defender'){
              x.insertAdjacentHTML('afterBegin',`<td class="" style="color:#8ff0a4;text-align:center">+5</td>`)
              total+=5
          } else {
              x.insertAdjacentHTML('afterBegin',`<td class="" style="color:#8ff0a4;text-align:center">+10</td>`)
              total+=10
          }
      } else {
          if(role == 'Defender'){
              x.insertAdjacentHTML('afterBegin',`<td class="" style="color:#8ff0a4;text-align:center">+5</td>`)
              total+=5
          } else {
              x.insertAdjacentHTML('afterBegin',`<td class="" style="text-align:center">0</td>`)
          }
      }
  })
}

/*
base damage =((225 + ( equip atk * 20) + ( pet atk * 20) + skill damage)  + (1000 * ( user attack stat- active def) ^ 0.25)) *  stamina cost
*/
function initPlayerAtkDamage(){
  //1000 × max(0, (UserATK − MonsterDEF))^0.25
  /*
  <div class="row"><span>ATTACK</span><span id="v-attack">305</span></div>
  */
  var atkValue = Number.parseInt(document.getElementById('v-attack').innerText.replaceAll(',','').replaceAll('.',''))

  var statRow = document.createElement('div')
  statRow.title = 'Damage is calculated based on 0 DEF monster'
  statRow.classList.add('row')
  statRow.style.color = 'red'
  var statName = document.createElement('span')
  statName.innerText = 'ATTACK DMG VS 0 DEF'
  var statValue = document.createElement('span')
  var atkValue = Number.parseInt(document.getElementById('v-attack').innerText.replaceAll(',','').replaceAll('.',''))
  var playerTotalDmg = calcDmg(atkValue,0)
  statValue.innerText = playerTotalDmg;
  statRow.append(statName)
  statRow.append(statValue)
  document.querySelectorAll('.grid .card')[1].append(statRow)

  var statRow2=  document.createElement('div')
  statRow2.title = 'Damage is calculated based on 0 DEF monster'
  statRow2.classList.add('row')
  statRow2.style.color = 'red'
  var statName2 = document.createElement('span')
  statName2.innerText = 'ATTACK DMG VS 25 DEF'
  var statValue2 = document.createElement('span')
  playerTotalDmg = calcDmg(atkValue,25)
  statValue2.innerText = playerTotalDmg;
  statRow2.append(statName2)
  statRow2.append(statValue2)
  document.querySelectorAll('.grid .card')[1].append(statRow2)

  var statRow3=  document.createElement('div')
  statRow3.title = 'Damage is calculated based on 0 DEF monster'
  statRow3.classList.add('row')
  statRow3.style.color = 'red'
  var statName3 = document.createElement('span')
  statName3.innerText = 'ATTACK DMG VS 50 DEF'
  var statValue3 = document.createElement('span')
  playerTotalDmg = calcDmg(atkValue,50)
  statValue3.innerText = playerTotalDmg;
  statRow3.append(statName3)
  statRow3.append(statValue3)
  document.querySelectorAll('.grid .card')[1].append(statRow3)
  
}

function calcDmg(atkValue,def){
  return Math.round(1000*((atkValue-def)**0.25));
}

function initPetTotalDmg(){
  var petTotalDmg=0;
  document.querySelector('.section').querySelectorAll('.pet-atk').forEach(x=>{
    petTotalDmg += Number.parseInt(x.innerText)
  })
  var finalAmount = petTotalDmg*20
  var totalDmgContainer = document.createElement('span')
  totalDmgContainer.id = 'total-pet-damage'
  totalDmgContainer.innerText = 'Total pet damage: '+ finalAmount
  document.querySelector('.section-title').appendChild(totalDmgContainer)
}
function initPetRequiredFood(){
  document.querySelectorAll('.exp-top').forEach(x=>{
    var curExp = Number.parseInt(x.querySelector('.exp-current').innerText)
    var reqExp = Number.parseInt(x.querySelector('.exp-required').innerText)
    var needed = Math.ceil((reqExp - curExp) /300)
    x.insertAdjacentHTML('afterEnd',`<div style='margin-top:5px;'><span style='color:green;margin-top:5px'>Requires ${needed} (x300)</span></div>`)
  })
}

function initItemTotalDmg(){
  var itemsTotalDmg=0;
  document.querySelector('.section').querySelectorAll('.label').forEach(x=>{
    itemsTotalDmg += Number.parseInt(x.innerText.substring(x.innerText.indexOf('🔪')+3).split(' ATK')[0])
  })
  var finalAmount = itemsTotalDmg*20
  var totalDmgContainer = document.createElement('span')
  totalDmgContainer.id = 'total-item-damage'
  totalDmgContainer.innerText = 'Total item damage: '+ finalAmount
  document.querySelector('.section-title').appendChild(totalDmgContainer)
}

function initAlternativeInventoryView(){
  if (!window.location.pathname.includes('inventory.php')) return;
  
  // Add toggle functionality to the header
  const header = document.querySelector('h1');
  if (header) {
    header.style.cursor = 'pointer';
    header.title = 'Click to toggle between grid and table view';
    const viewIndicator = document.createElement('span');
    viewIndicator.id = 'view-indicator';
    viewIndicator.style.marginLeft = '10px';
    viewIndicator.style.fontSize = '14px';
    viewIndicator.style.color = '#cba6f7';
    header.appendChild(viewIndicator);
    
    // Load saved view preference
    chrome.storage.local.get(['inventoryView'], (result) => {
      const defaultView = result.inventoryView || 'grid';
      viewIndicator.textContent = `[${defaultView.toUpperCase()} VIEW]`;
      
      if (defaultView === 'table') {
        convertToTableView();
      }
    });
    
    header.addEventListener('click', toggleInventoryView);
  }
  

  function toggleInventoryView() {
    const viewIndicator = document.getElementById('view-indicator');
    const currentView = viewIndicator.textContent.includes('TABLE') ? 'table' : 'grid';
    const newView = currentView === 'table' ? 'grid' : 'table';
    
    viewIndicator.textContent = `[${newView.toUpperCase()} VIEW]`;
    
    // Save preference
    chrome.storage.local.set({ inventoryView: newView });
    
    if (newView === 'table') {
      convertToTableView();
    } else {
      convertToGridView();
    }
  }

  function convertToTableView() {
    // Remove any existing tables
    document.querySelectorAll('.inventory-table').forEach(table => table.remove());
    
    // Process each section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const title = section.querySelector('.section-title').textContent;
      const grid = section.querySelector('.grid');
      
      if (grid) {
        // Hide the grid
        grid.style.display = 'none';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'inventory-table';
        table.innerHTML = `
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        // Process each item
        const items = grid.querySelectorAll('.slot-box');
        items.forEach(item => {
          const row = document.createElement('tr');
          
          // Extract item image
          const img = item.querySelector('img');
          const imgSrc = img ? img.src : '';
          const imgAlt = img ? img.alt : '';
          
          // Extract item info
          const label = item.querySelector('.label');
          const labelText = label ? label.textContent : '';
          
          // Extract buttons
          const buttons = item.querySelectorAll('button');
          
          // Create table cells
          row.innerHTML = `
            <td class="table-item-image">
              <img src="${imgSrc}" alt="${imgAlt}" onerror="this.style.display='none'">
              <div class="table-item-name">${imgAlt}</div>
            </td>
            <td class="table-item-details">${labelText}</td>
            <td class="table-item-actions"></td>
          `;
          
          // Add buttons to actions cell
          const actionsCell = row.querySelector('.table-item-actions');
          buttons.forEach(button => {
            if (!button.classList.contains('info-btn')) {
              actionsCell.appendChild(button.cloneNode(true));
            }
          });
          
          // Add info button if exists
          const infoBtn = item.querySelector('.info-btn');
          if (infoBtn) {
            const infoClone = infoBtn.cloneNode(true);
            actionsCell.appendChild(infoClone);
          }
          
          tbody.appendChild(row);
        });
        
        // Insert table after the section title
        section.insertBefore(table, grid);
      }
    });
  }
  
  function convertToGridView() {
    // Remove all tables
    document.querySelectorAll('.inventory-table').forEach(table => table.remove());
    
    // Show all grids
    document.querySelectorAll('.grid').forEach(grid => {
      grid.style.display = 'flex';
    });
  }

}

// MAIN INIT AND CHECKS
// Check if we're on a page with the game topbar (it means we are in the game)
if (document.querySelector('.game-topbar')) {
  // We should wait for the DOM to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { 
      initSideBar(); 
      initDraggableFalse();
      initFaviconFix();
    });
  } else {
    // Sidebar always first so we dont mess the layout
    initSideBar();
    initDraggableFalse();
    initFaviconFix();
    //initChatPopup();
    // stats tracker was intended to be the popup with stats
    // and update live and always on top of any website, i left it out for now
    // since it was a little buggy, left it in as example
    //initStatsTracker();
    // same for this this styles, it injects a styles.css, not using it much
    // but left here as example
    //injectStyles();
    //injectWaveAltViewStyles()
    initPageSpecificFunctionality();
  }
}
function initDraggableFalse(){
  document.querySelectorAll('a').forEach(x=>x.draggable = false)
  document.querySelectorAll('button').forEach(x=>x.draggable = false)
}

function initChatPopup(){
  var chatPopup = document.createElement('div')
  chatPopup.classList.add('panel')

  fetch('chat.php', {
    method: 'GET'
  })
  .then(res => res.text())
  .then(data => {
    chatPopup.innerHTML = data;
    document.querySelector('.content-area').prepend(chatPopup)
  })
  .catch(() => showNotification('Server error. Please try again.', 'error'));


  
}


// Sidebar Initialization
function initSideBar(){
  // Create and inject the sidebar and layout structure
  // Create the main wrapper container (some pages dont have it and we have to create it)
  const noContainerPage = !document.querySelector('.container') && !document.querySelector('.wrap');
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'main-wrapper';
  
  // Create the sidebar
  const sidebar = document.createElement('aside');
  sidebar.id = 'game-sidebar';
  
  // Dynamically set Gate Grakthar link based on user level
  let gateLink = "active_wave.php?gate=3&wave=3";
  const levelEl = document.querySelector('.gtb-level');
  if (levelEl) {
    const levelText = levelEl.textContent.replace(/[^0-9]/g, '');
    const level = parseInt(levelText, 10);
    if (level >= 50) {
      gateLink = "active_wave.php?gate=3&wave=5";
    }
  }

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="game_dash.php" style="text-decoration:none;"><h2>Game Menu</h2></a>
    </div>
    <ul class="sidebar-menu">
      <li><a href="pvp.php?rank=3"><img src="/images/pvp/season_1/compressed_menu_pvp_season_1.webp" alt="PvP Arena"> PvP Arena</a></li>
      <li class="has-submenu">
        <a href="orc_cull_event.php">
          <img src="/images/events/orc_cull/banner.webp" alt="War Drums of GRAKTHAR"> Event
        </a>
        <span class="submenu-toggle"></span>
        <ul class="submenu">
          <li><a href="active_wave.php?event=2&wave=6"><img src="/images/events/orc_cull/banner.webp" alt="War Drums of GRAKTHAR"> Event Battlefield</a></li>
        </ul>
      </li>
      <li class="has-submenu">
        <a href="${gateLink}">
          <img src="images/gates/gate_688e438aba7f24.99262397.webp" alt="Gate"> Gate Grakthar
        </a>
        <span class="submenu-toggle"></span>
        <ul class="submenu">
          <li><a href="active_wave.php?gate=3&wave=3"><img src="images/gates/gate_688e438aba7f24.99262397.webp" alt="Gate"> Grakthar | Wave 1</a></li>
          <li><a href="active_wave.php?gate=3&wave=5"><img src="images/gates/gate_688e438aba7f24.99262397.webp" alt="Gate"> Grakthar | Wave 2</a></li>
        </ul>
      </li>
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
    
    <!-- Settings Section -->
    <div class="sidebar-settings">
      <div class="settings-header">
        <h3>Settings</h3>
      </div>
      <div class="settings-content">
        <div class="setting-item">
          <label for="timeFormatToggle">12H/24H</label>
          <div class="toggle-container">
            <input type="checkbox" id="timeFormatToggle" class="toggle-input">
            <span class="toggle-slider"></span>
            <span class="toggle-labels">
              <span class="toggle-label-12h">12</span>
              <span class="toggle-label-24h">24</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

/**********************************
 * Sidebar Submenu Initialization *
 **********************************/
  /**
   * How to add submenus to the sidebar:
   * 
   * 1. Create a list item with the "has-submenu" class
   * 2. Add the main menu link
   * 3. Add a span with class "submenu-toggle" for the dropdown arrow
   * 4. Include a nested <ul> with class "submenu" containing submenu items
   * 
   * Example:
   * <li class="has-submenu">
   *   <a href="main-link.php">
   *     <img src="/images/icon.webp" alt="Menu Item"> Menu Item
   *   </a>
   *   <span class="submenu-toggle"></span>
   *   <ul class="submenu">
   *     <li><a href="submenu-link.php"><img src="/images/icon.webp" alt="Submenu"> Submenu Item</a></li>
   *     <li><a href="another-link.php"><img src="/images/icon.webp" alt="Submenu"> Another Item</a></li>
   *   </ul>
   * </li>
  */

  // Initialize submenu toggle arrows and restore saved states from cookies
  sidebar.querySelectorAll('.submenu-toggle').forEach(toggle => {
    // Get parent menu item and its submenu
    const parentLi = toggle.closest('.has-submenu');
    const submenu = parentLi.querySelector('.submenu');
    const menuId = parentLi.querySelector('a').textContent.trim().replace(/\s+/g, '_');
    
    // Check if there's a saved state in cookie
    const savedState = getCookieExtension('submenu_' + menuId);
    if (savedState === 'open') {
      // Open the submenu
      submenu.classList.add('open');
      toggle.innerHTML = '<span style="display:inline-block;">⯅</span>'; // Arrow up
    } else {
      toggle.innerHTML = '<span style="display:inline-block; transform: translateY(-2px);">⯆</span>'; // Default arrow down
    }
  });
  
  // Modified click handler to save submenu state to cookie
  sidebar.addEventListener('click', function(e) {
    // Determine if the click was on a toggle element or its child span
    let toggleEl = null;
    if (e.target.classList.contains('submenu-toggle')) {
      toggleEl = e.target;
    } else if (
      e.target.tagName === 'SPAN' &&
      e.target.parentElement &&
      e.target.parentElement.classList.contains('submenu-toggle')
    ) {
      toggleEl = e.target.parentElement;
    }
    
    if (toggleEl) {
      e.preventDefault(); // Prevent default link behavior
      const parentLi = toggleEl.closest('.has-submenu');
      const submenu = parentLi.querySelector('.submenu');
      const menuId = parentLi.querySelector('a').textContent.trim().replace(/\s+/g, '_');
      
      if (submenu) {
        // Toggle the 'open' class to show/hide the submenu
        submenu.classList.toggle('open');
        
        // Save state to cookie (expires in 30 days)
        const isOpen = submenu.classList.contains('open');
        document.cookie = `submenu_${menuId}=${isOpen ? 'open' : 'closed'}; path=/; max-age=${60*60*24*30}; SameSite=Lax`;
        
        // Update the arrow direction based on submenu state
        if (isOpen) {
          // Arrow points up when submenu is open
          toggleEl.innerHTML = '<span style="display:inline-block;">⯅</span>';
        } else {
          // Arrow points down when submenu is closed, with slight vertical adjustment
          toggleEl.innerHTML = '<span style="display:inline-block; transform: translateY(-2px);">⯆</span>'; 
        }
        
        // Center the arrow in the toggle button
        toggleEl.style.display = 'flex';
        toggleEl.style.alignItems = 'center';
        toggleEl.style.justifyContent = 'center';
      }
    }
  });
  // The arrow initialization is now handled in the previous section

  // Add click event listener to the sidebar to handle submenu interactions
  sidebar.addEventListener('click', function(e) {
    // Determine if the click was on a toggle element or its child span
    let toggleEl = null;
    if (e.target.classList.contains('submenu-toggle')) {
      // Direct click on the toggle element
      toggleEl = e.target;
    } else if (
      e.target.tagName === 'SPAN' &&
      e.target.parentElement &&
      e.target.parentElement.classList.contains('submenu-toggle')
    ) {
      // Click on the span inside the toggle element
      toggleEl = e.target.parentElement;
    }
    
    if (toggleEl) {
      e.preventDefault(); // Prevent default link behavior
      const parentLi = toggleEl.closest('.has-submenu'); // Get the parent list item
      const submenu = parentLi.querySelector('.submenu'); // Find the submenu element
      
      if (submenu) {
        // Toggle the 'open' class to show/hide the submenu
        submenu.classList.toggle('open');
        
        // Update the arrow direction based on submenu state
        if (submenu.classList.contains('open')) {
          // Arrow points up when submenu is open
          toggleEl.innerHTML = '<span style="display:inline-block;">⯅</span>';
        } else {
          // Arrow points down when submenu is closed, with slight vertical adjustment
          toggleEl.innerHTML = '<span style="display:inline-block; transform: translateY(-2px);">⯆</span>'; 
        }
        
        // Center the arrow in the toggle button
        toggleEl.style.display = 'flex';
        toggleEl.style.alignItems = 'center';
        toggleEl.style.justifyContent = 'center';
        // Note: The frame stays centered while only the arrow symbol is adjusted
      }
    }
  });

  // Initialize time format toggle
  initTimeFormatToggle(sidebar);

/****************************
 * End Sidebar Submenu Init *
 ****************************/

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
  addSidebarStyles();
  
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
    link.href = chrome.runtime.getURL('popupstyles.css');
    document.head.appendChild(link);
  }
}

function injectWaveAltViewStyles(){
  if (!document.getElementById('demon-extension-wave-styles')) {
    const link = document.createElement('link');
    link.id = 'demon-extension-wave-styles';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('wavestyles.css');
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
      monsterFiltersSettings = settings;
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
    <label style="display: flex; align-items: center; gap: 5px;">
      <input type="checkbox" id="hide-img-monsters">
      Hide images
    </label>
    <label style="display: flex; align-items: center; gap: 5px;">
      <input type="checkbox" id="monster-alarm">
      Monster alarm
    </label>
    <label style="display: flex; align-items: center; gap: 5px;">
      <input type="checkbox" id="battle-limit-alarm">
      Battle limit alarm
    </label>
  `;
  
  // Insert before the monster list
  document.querySelector('.content-area').insertBefore(filterContainer, document.querySelector('.monster-container'));
  
  document.getElementById('monster-name-filter').addEventListener('input', applyMonsterFilters);
  document.getElementById('hide-dead-monsters').addEventListener('change', applyMonsterFilters);
  document.getElementById('hide-img-monsters').addEventListener('change', applyMonsterFilters);
  document.getElementById('monster-alarm').addEventListener('change', applyMonsterFilters);
  document.getElementById('battle-limit-alarm').addEventListener('change', applyMonsterFilters);
  // Apply saved settings
  if (settings.nameFilter) {
    document.getElementById('monster-name-filter').value = settings.nameFilter;
  }
  
  if (settings.hideDead) {
    document.getElementById('hide-dead-monsters').checked = settings.hideDead;
  }
  if(settings.hideImg){
    document.getElementById('hide-img-monsters').checked = settings.hideImg;
  }
  if(settings.monsterAlarm){
    document.getElementById('monster-alarm').checked = settings.monsterAlarm;
  }
  if(settings.battleLimitAlarm){
    document.getElementById('battle-limit-alarm').checked = settings.battleLimitAlarm;
  }
  
  // Apply filters immediately if settings exist
  if (settings.nameFilter || settings.hideDead || settings.hideImg || settings.monsterAlarm || settings.battleLimitAlarm) {
    applyMonsterFilters();
  }
}

function applyMonsterFilters() {
  const nameFilter = document.getElementById('monster-name-filter').value.toLowerCase();
  const hideDead = document.getElementById('hide-dead-monsters').checked;
  const hideImg = document.getElementById('hide-img-monsters').checked;
  const monsterAlarm = document.getElementById('monster-alarm').checked;
  const battleLimitAlarm = document.getElementById('battle-limit-alarm').checked;
  if(monsterFiltersSettings.altView){

  } else {

    if(monsterAlarm || battleLimitAlarm){
      alarmInterval = setInterval(() => {
          location.reload();
      }, 5000);
    } else {
      clearInterval(alarmInterval)
    }

    const monsters = document.querySelectorAll('.monster-card');
    var limitBattleCount = 0;
    
    monsters.forEach(monster => {
      const monsterName = monster.querySelector('h3').textContent.toLowerCase();
      const monsterImg = monster.querySelector('img')
      const isDead = monsterImg.classList.contains('grayscale');
      const hasLoot = monster.innerText.includes("Loot");
      
      const nameMatch = monsterName.includes(nameFilter);
      const shouldHideDead = hideDead && isDead && !hasLoot;

      // hides images
      if(hideImg){
        monsterImg.style.display = 'none'
      }else{
        monsterImg.style.removeProperty('display');
      }

      if(monster.innerText.includes('Continue the Battle')){
        limitBattleCount++
      }

      // name filter + dead filter
      if ((nameFilter && !nameMatch) || shouldHideDead) {
        monster.style.display = 'none';
      } else {
        monster.style.display = '';
        
        // after filter alarm when alive and still not in battle
        if(monsterAlarm){
          if(!monster.innerText.includes('❤️ 0 / ') && !monster.innerText.includes('Continue the Battle')){
            var volume = 0.2
            chrome.runtime.sendMessage({
              type: "PLAY_SOUND",
              //volume: volume
            });
          }
        }
      }
    });

    // if found less than 3 ongoing battles run the alarm
    if(battleLimitAlarm && limitBattleCount < 3){
      var volume = 0.2
      chrome.runtime.sendMessage({
        type: "PLAY_SOUND",
        //volume: volume
      });
    }

  }



  // Saving filter settings :D
  const settings = {
    nameFilter: document.getElementById('monster-name-filter').value,
    hideDead: document.getElementById('hide-dead-monsters').checked,
    hideImg: document.getElementById('hide-img-monsters').checked,
    monsterAlarm: document.getElementById('monster-alarm').checked,
    battleLimitAlarm: document.getElementById('battle-limit-alarm').checked
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
    if(x.innerText.includes('Join the Battle')){
      var instaJoinBtn = document.createElement('button');
      instaJoinBtn.onclick = function() {
        joinWave(x.href.split("id=")[1],x)
      };
      instaJoinBtn.className = "join-btn"
      instaJoinBtn.innerText = "⚔️ Insta"
      x.parentNode.append(instaJoinBtn)
    }
})
}

function joinWave(monsterId,x){
    fetch('user_join_battle.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'monster_id='+monsterId+'&user_id='+userId,
      referrer:'https://demonicscans.org/battle.php?id='+monsterId
    })
    .then(res => res.text())
    .then(data => {
      const msg = (data || '').trim();
      const ok = msg.toLowerCase().startsWith('you have successfully');
      showNotification(msg || 'Unknown response', ok ? 'success' : 'error');
      if (ok) {
        x.click()
      }
    })
    .catch(() => showNotification('Server error. Please try again.', 'error'));
      
}


//#region Hit from wave

// --- Cookie helpers + cooldown checks ---
function getCookie(name) {
  const m = document.cookie.split('; ').find(r => r.startsWith(name + '='));
  return m ? decodeURIComponent(m.split('=')[1]) : '';
}
function setCookie(name, value, maxAgeSeconds = 86400) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}
function canAttackNow() {
  const last = parseInt(getCookie('last_attack') || '0', 10) || 0;
  const now  = Date.now();
  if (last && now - last < 1000) {
    return { ok: false, waitMs: 1000 - (now - last) };
  }
  return { ok: true, now };
}
function lockAttackButtons(lock = true) {
  document.querySelectorAll('.attack-btn').forEach(b => {
    b.disabled = lock;
    if (lock) {
      b.classList.add('is-loading');
      b.setAttribute('aria-busy', 'true');
    } else {
      b.classList.remove('is-loading');
      b.removeAttribute('aria-busy');
    }
  });
}


function hitWave(monsterId){
  // Cooldown gate (3s) backed by a cookie
  const check = canAttackNow();
  if (!check.ok) {
    const secs = Math.ceil(check.waitMs / 1000);
    showNotification(`⏳ Take your time… ${secs}s`, 'error');
    return; // block the attack
  }
   // Record the attempt immediately and soft-lock buttons for 3s
  setCookie('last_attack', check.now);
  lockAttackButtons(true);
  setTimeout(() => lockAttackButtons(false), 1000);
  const skillId = btn.getAttribute('data-skill-id');
  const cost = (skillId === "-1") ? 10 
      : (skillId === "-2") ? 50 
      : 1;   // Slash = 1 stamina

  fetch('damage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'monster_id='+monsterId+'&user_id='+userId+'&skill_id=' + skillId + '&stamina_cost=' + cost,
      referrer:'https://demonicscans.org/battle.php?id='+monsterId
  })
  .then(res => res.json())
  .then(data => {
      if (data.status.trim() === 'success') {
          showNotification(data.message, 'success');
          animateMonster();
          document.getElementById('hpFill').style.width = data.hp.percent + '%';
          document.getElementById('stamina_span').innerHTML = data.stamina;
          document.getElementById('hpText').innerHTML = `❤️ ${new Intl.NumberFormat().format(data.hp.value)} / 1,000,000 HP`;

          if(Intl.NumberFormat().format(data.hp.value) <= 0) {
              location.reload();
          }

          // Leaderboard + logs update
          document.querySelector('.leaderboard-panel').innerHTML =
            '<strong>📊 Attackers Leaderboard</strong>' +
            '<div class="lb-list">' +
            data.leaderboard.map((row, i) => {
              const av = row.PICTURE && row.PICTURE.trim()
                ? row.PICTURE
                : 'images/default_avatar.png';
              return `
                <div class="lb-row">
                  <span class="lb-rank">#${i + 1}</span>
                  <img class="lb-avatar" src="${av}" alt="">
                  <span class="lb-name">
                    <a style="color:white;" href="player.php?pid=${row.ID}">${row.USERNAME}</a>
                  </span>
                  <span class="lb-dmg">${new Intl.NumberFormat().format(row.DAMAGE_DEALT)} DMG</span>
                </div>`;
            }).join('') +
            '</div>';

          document.querySelector('.log-panel').innerHTML =
            '<strong>📜 Attack Log</strong><br>' +
            data.logs.map(row => `⚔️ ${row.USERNAME} used ${row.SKILL_NAME} for ${new Intl.NumberFormat().format(row.DAMAGE)} DMG!<br>`).join('');

          if (typeof data.xp_delta === 'number') {
          addExpUI(data.xp_delta);
          } else {
              addExpUI(10);
          }
      } else {
          if (data.message && data.message.trim() === "Monster is already dead.") {
              location.reload();
          } else {
              showNotification(data.message || "An error occurred.", 'error');
          }
      }
  })
  .catch(() => showNotification("Server error", 'error'));

}

//#endregion

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

function initOrderByRemainingHP(){
  document.querySelectorAll('.monster-card').forEach(x=>{
    if(x.innerText.includes('Continue the Battle')){
        document.querySelector('.monster-container').prepend(x)
    }
  })
}

//#region Wave Alternative view table

function initAlternativeWaveView(){
  
  var monsterCards = document.querySelectorAll('.monster-card');
  var monstersInfoList = []
  monsterCards.forEach(x => {
    var monsterInfo = {}
    monsterInfo.fullcard = x;
    monsterInfo.img = x.querySelector('img')
    monsterInfo.name = x.querySelector('h3')
    monsterInfo.hpbar = x.querySelector('.hp-bar')
    monsterInfo.id = x.querySelector('a')?.href.split('?id=')[1]
    monsterInfo.join = x.querySelector('a')?? ''
    monsterInfo.joinlink = x.querySelector('a')?.href
    var innerdivs = x.querySelectorAll('div')
    monsterInfo.hp = innerdivs[2].innerText
    monsterInfo.playersjoined = innerdivs[3].innerText
     /*
      x.querySelectorAll('div').forEach(y=>{
        if(y.innerText.includes(' HP')){
          monsterInfo.hp = y.innerText
        }
        if(y.innerText.includes('Players Joined ')){
          monsterInfo.playersjoined = y.innerText
        }
      })
     */
    if(monsterInfo.id){
      monstersInfoList.push(monsterInfo)
    }  
  })

  var orderedMonsterList = monstersInfoList.toSorted( (a,b) => {
    return Number.parseInt(b.id) - Number.parseInt(a.id)
  })

  var tableBody = `<tbody>`
  orderedMonsterList.forEach( x => {/*
    x.join.firstChild.classList.add('ext-join-btn')
    x.hpbar.firstChild.classList.add('ext-hp-fill')*/
    x.join.firstChild.classList = ['ext-join-btn']
    var row = `<tr>`
    row += `<td class="ext-monster-name">${x.name.innerText}</td>`
    row += `<td><a href=${x.joinlink}>${x.join.getHTML()}</a></td>`
    row += `<td><div class="hp-bar">${x.hpbar.getHTML()}</div></td>`
    row += `<td class="ext-hp-text">${x.hp}</td>`
    row += `<td class="ext-players-text">${x.playersjoined}</td>`
    row += `</tr>`
    tableBody += row
  })
  tableBody += `</tbody>`
  var table = `<table>
  <thead>
    <tr>
    <th>Monster</th>
    <th>Actions</th>
    <th>HP Bar</th>
    <th>HP</th>
    <th>Players</th>
    </tr>
  </thead>`
  table += tableBody
  table += `</table>`
  document.querySelector('.monster-container').innerHTML = table
}

//#endregion

function initReducedImageSize(){
  document.getElementById('monsterImage').style.maxHeight="400px";
  document.querySelector('.content-area > .panel').style.justifyItems="center";
  document.querySelector('.content-area > .panel').style.textAlign="center";
  document.querySelector('.hp-bar').style.justifySelf="normal";
}
function initPossibleLootReached(){
  //TODO
}
function initTotalOwnDamage(){
  //TODO
  colorMyself();
  const observer = new MutationObserver((mutations) => {
    const shouldUpdate = mutations.some(mutation => 
      mutation.type === 'childList' && mutation.addedNodes.length > 0
    );
    
    if (shouldUpdate) {
      // Small delay to ensure DOM is fully updated
      setTimeout(colorMyself, 50);
    }
  });
  const config = {
    childList: true,
    subtree: true
  };
  const targetElement = document.querySelector('.leaderboard-panel');
  observer.observe(targetElement, config);
}
function colorMyself(){
  document.querySelectorAll('.lb-row a').forEach(x => {
    if(x.href.includes(userId)){
      var lbrow = x.parentElement.parentElement
      var exDamageDone =lbrow.querySelector('.lb-dmg').innerText;
      var exDamageNumber = Number.parseInt(exDamageDone.replaceAll(',','').replaceAll('.',''))

      // Color leaderboard row
      lbrow.style.backgroundColor = '#7a2020'

      // update "Your damage"
      document.querySelectorAll("div.stats-stack > span").forEach(x=>{
        if(x.innerText.includes('Your Damage: ')){
          x.innerText = "Your Damage: "+ exDamageDone
        }
      })

      // update loot requirements
      var lootContainer = document.createElement('div')
      lootContainer.id = 'extension-loot-container'
      lootContainer.style.display='ruby'
      lootContainer.style.maxWidth='50%'
      document.querySelectorAll('.loot-card').forEach(x=>lootContainer.append(x))
      var enemyAndLootContainer = document.createElement('div')
      enemyAndLootContainer.id = 'extension-enemy-loot-container'
      enemyAndLootContainer.style.display='inline-flex'
      enemyAndLootContainer.append(document.querySelector('.monster_image'))
      enemyAndLootContainer.append(lootContainer)
      document.querySelector("body > div.main-wrapper > div > .panel").prepend(enemyAndLootContainer)
      document.querySelectorAll('.loot-card').forEach( y => {
        y.style.margin='5px'
        y.querySelectorAll('.loot-stats .chip').forEach(x=>{
          x.parentElement.style.gap = '0px'
          if(x.innerText.includes('DMG req')){
            var lootReqNumber = Number.parseInt(x.innerText.substr(9).replaceAll(',','').replaceAll('.',''))
            if(lootReqNumber<=exDamageNumber){
              y.style.background = 'rgb(0 255 30 / 20%)'
              y.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)'
              try{
                y.classList.remove('locked')
                y.querySelector('.lock-badge').remove()
              } catch {}
            }
          }
        });
      });

    }
  })
}

function initAnyClickClosesModal(){
  document.getElementById('lootModal').addEventListener('click', function(event) {
    this.style.display = 'none';
  });
}

function initPvPCollapsibles(){
  // This function needs to be implemented
}

// Time format toggle initialization
function initTimeFormatToggle(sidebar) {
  const toggle = sidebar.querySelector('#timeFormatToggle');
  const toggleSlider = sidebar.querySelector('.toggle-slider');
  const label12h = sidebar.querySelector('.toggle-label-12h');
  const label24h = sidebar.querySelector('.toggle-label-24h');
  
  // Function to update label colors
  function updateLabelColors(is24h) {
    if (label12h && label24h) {
      if (is24h) {
        label12h.style.color = '#888';
        label24h.style.color = '#333';
      } else {
        label12h.style.color = '#333';
        label24h.style.color = '#999';
      }
    }
  }
  
  // Load saved setting
  chrome.storage.local.get(['timeFormat24h'], (result) => {
    const is24h = result.timeFormat24h || false;
    toggle.checked = is24h;
    updateLabelColors(is24h); // Set initial colors
    if (is24h) {
      toggleTimeFormat(true);
    }
  });
  
  // Add event listener for checkbox change
  toggle.addEventListener('change', function() {
    const is24h = this.checked;
    
    // Save setting
    chrome.storage.local.set({ timeFormat24h: is24h });
    
    // Update label colors
    updateLabelColors(is24h);
    
    // Apply time format
    toggleTimeFormat(is24h);
  });
  
  // Add click event listener for the toggle slider
  toggleSlider.addEventListener('click', function() {
    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event('change'));
  });
}

// Optimized time format toggle function
function toggleTimeFormat(use24h) {
  const originalElement = document.querySelector('#server_time');
  const existingNewElement = document.querySelector('#server_time_24h');

  // Clear any existing interval
  if (window.serverTimeInterval) {
    clearInterval(window.serverTimeInterval);
    window.serverTimeInterval = null;
  }

  // Remove the previously created new element if it exists
  if (existingNewElement) {
    existingNewElement.remove();
  }

  if (!originalElement) {
    console.error('Original element with id server_time not found.');
    return;
  }

  if (use24h) {
    // Hide the original element and create 24h version
    originalElement.style.display = 'none';

    // Create a new element for the 24-hour time
    const newTimeElement = document.createElement('span');
    newTimeElement.id = 'server_time_24h';
    newTimeElement.className = originalElement.className;
    
    if (originalElement.hasAttribute('title')) {
      newTimeElement.setAttribute('title', originalElement.getAttribute('title'));
    }

    // Insert the new element after the original element
    originalElement.parentNode.insertBefore(newTimeElement, originalElement.nextSibling);

    // Function to convert 12h to 24h format
    function updateServerTimeFromHidden() {
      const textContent = originalElement.textContent.trim();
      const match = textContent.match(/^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/);

      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const seconds = match[3];
        const period = match[4];

        if (period === 'PM' && hours < 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        const formattedHours = hours.toString().padStart(2, '0');
        newTimeElement.textContent = `${formattedHours}:${minutes}:${seconds}`;
      } else {
        console.warn('Could not parse time format from original element:', textContent);
      }
    }

    // Initial call and set up interval
    updateServerTimeFromHidden();
    window.serverTimeInterval = setInterval(updateServerTimeFromHidden, 1000);
  } else {
    // Show the original 12h format
    originalElement.style.display = '';
  }
}

// Enhanced CSS styles including settings section and toggle
function addSidebarStyles() {
  document.body.style.paddingTop = "55px";
  document.body.style.paddingLeft = "0px";
  document.body.style.margin = "0px";
  
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
      padding: 15px 0 0 0;
      overflow-y: auto;
      position: fixed;
      height: calc(100vh - 74px);
      display: flex;
      flex-direction: column;
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
      flex-grow: 1;
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
      line-height: 24px;
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
    
    /* Settings Section */
    .sidebar-settings {
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 15px 0;
    }
    
    .settings-header {
      padding: 0 20px 10px;
    }
    
    .settings-header h3 {
      color: #FFD369;
      margin: 0;
      font-size: 1.2rem;
    }
    
    .settings-content {
      padding: 0 20px;
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .setting-item label {
      color: #e0e0e0;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    /* Toggle Switch Styles */
    .toggle-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .toggle-input {
      display: none;
    }
    
    .toggle-slider {
      position: relative;
      width: 60px;
      height: 30px;
      background-color: #45475a;
      border-radius: 15px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      user-select: none;
    }
    
    .toggle-slider:before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 24px;
      height: 24px;
      background-color: #e0e0e0;
      border-radius: 50%;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .toggle-input:checked + .toggle-slider {
      background-color: #FFD369;
    }
    
    .toggle-input:checked + .toggle-slider:before {
      transform: translateX(30px);
    }
    
    .toggle-labels {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      pointer-events: none;
      font-size: 14px;
      font-weight: bold;
    }

    .toggle-label-12h,
    .toggle-label-24h {
      color: #666;
      transition: color 0.3s ease;
    }
    
    .toggle-label-12h {
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .toggle-label-24h {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }
    
    /* Content area */
    .content-area {
      flex: 1;
      padding: 20px;
      margin-left: 250px;
    }
    
    /* Submenu styles */
    .has-submenu {
      position: relative;
    }
    
    .has-submenu > a {
      padding-right: 40px;
      display: flex;
      align-items: center;
      position: relative;
    }
    
    .submenu-toggle {
      position: absolute;
      right: 10px;
      top: 12px;
      cursor: pointer;
      padding: 0;
      color: #e0e0e0;
      transition: color 0.2s ease;
      border: 1px solid #555;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.05);
      z-index: 1;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .submenu-toggle:hover {
      color: #FFD369;
      border-color: #FFD369;
      background: rgba(255, 211, 105, 0.1);
    }
    
    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      padding-left: 20px;
      list-style-type: none;
      background: rgba(15, 15, 15, 1);
    }
    
    .submenu.open {
      max-height: 200px;
    }
    
    .submenu li a {
      padding: 8px 20px;
      font-size: 0.9rem;
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
}