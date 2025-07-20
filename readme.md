# Guest Stats Fetcher

This script captures the Authorization token from Krunker.io guest profile requests and adds a **Guest Stats** button to the page. Clicking the button fetches your guest profile stats and displays them in a popup.

## How it works

- Intercepts outgoing GET requests to `https://gapi.svc.krunker.io/guest/profile` to save the Authorization token.
- Adds a **Guest Stats** button after page load.
- Clicking the button uses the saved token to request your guest profile data.
- Displays stats like Score, Funds, Kills, Deaths, Games, and Wins in a popup.

## Usage

1. Run the script on glorp client.
2. Wait a few seconds for the button to appear.
3. Click **Guest Stats** to see your profile stats.
4. Close the popup by clicking outside it or the Close button.

## Privacy

- The token is only used to fetch your profile.
- No data is sent outside or stored permanently.

---
![Guest Stats Popup](https://i.imgur.com/kdRLND1.png)

Feel free to customize the script for your needs.
