<h1 align="left">Demonicscans game extension</h1>

###

<h2 align="left">Instructions</h2>

###

- Clone project
- Open content-script.js
- First lines has variable "userId" replace with your own user id
  - To find your user id click on your name on the leaderboard of a battle or any other place
  - Once you are on your "profile page"
  - You have to check the url and copy the "pid" value
  - Example: https://demonicscans.org/player.php?pid=40923
- Go to browser extensions
- Enable developer mode
- Load Unpacked
- Select folder containing the manifest
- If not enabled, enable the extension


###

<h2 align="left">Features</h2>

###

- Sidebar
- Wave page
  - Claim Loot from Waves with "Insta" (requires the user id)
  - "Continue the battle" monsters first in list
  - Notification on loot error,etc
  - Gate info hidden by default and clicking Gate Header shows it
- Battle page
  - Reduced monster size and centered text
  - TODO: Total own damage dealt (client side tracking)
  - TODO: Possible loot dinamic unlock (currently game requires refresh to show if you unlocked it)

###

<h2 align="left">Tested on</h2>

###

- Opera GX

###
