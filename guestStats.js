(function () {
  let savedAuthToken = null;

  // Intercept fetch to capture Authorization token
  const originalFetch = window.fetch;
  window.fetch = function (input, init = {}) {
    let method = 'GET';
    let url = '';
    let headers = {};

    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof Request) {
      url = input.url;
      method = input.method || 'GET';
      headers = input.headers || {};
    }

    if (init.method) method = init.method;
    if (init.headers) headers = init.headers;

    if (
      method.toUpperCase() === 'GET' &&
      url.includes('https://gapi.svc.krunker.io/guest/profile')
    ) {
      let authHeader = '';

      if (headers instanceof Headers) {
        authHeader = headers.get('Authorization');
      } else if (typeof headers === 'object') {
        authHeader = headers['Authorization'] || headers['authorization'];
      }

      if (authHeader) {
        savedAuthToken = authHeader;
        console.log('[Captured token]:', savedAuthToken);
      }
    }

    return originalFetch.apply(this, arguments);
  };

  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Wait 3 seconds to ensure #signedOutHeaderBar is loaded
    setTimeout(() => {
      const target = document.querySelector("#signedOutHeaderBar");
      if (!target) return alert("#signedOutHeaderBar not found.");

      const btn = document.createElement("div");
      btn.className = "button buttonB bigShadowT";
      btn.textContent = "Guest Stats";

      btn.style.display = "block";
      btn.style.paddingTop = "7px";
      btn.style.paddingBottom = "22px";
      btn.style.marginTop = "7px";
      btn.style.height = "21px";
      btn.style.lineHeight = "35px";
      btn.style.width = "162px";
      btn.style.marginLeft = "3px";
      btn.style.setProperty("font-size", "20px", "important");

      target.appendChild(btn);

      btn.addEventListener("click", async () => {
        if (!savedAuthToken) {
          return alert("Token not yet captured. Please reload or wait for a request to be sent.");
        }

        try {
          const response = await fetch("https://gapi.svc.krunker.io/guest/profile", {
            method: "GET",
            headers: { Authorization: savedAuthToken }
          });

          if (!response.ok) {
            return alert("HTTP error: " + response.status);
          }

          const json = await response.json();
          const stats = json?.data?.profile;
          if (!stats) return alert("Invalid data.");

          showPopup(stats);
        } catch (err) {
          alert("Error: " + err.message);
        }
      });

      function showPopup(stats) {
        // Remove existing popup if any
        const old = document.querySelector("#guestStatsPopup");
        if (old) old.remove();

        // Semi-transparent overlay (dark background)
        const overlay = document.createElement("div");
        overlay.id = "guestStatsOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
        overlay.style.zIndex = "9998";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        // Popup container
        const popup = document.createElement("div");
        popup.id = "guestStatsPopup";
        popup.style.background = "#222";
        popup.style.color = "#fff";
        popup.style.borderRadius = "12px";
        popup.style.padding = "30px 40px";
        popup.style.minWidth = "400px";
        popup.style.maxWidth = "90vw";
        popup.style.boxShadow = "0 0 30px rgba(0,0,0,0.9)";
        popup.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        popup.style.textAlign = "left";
        popup.style.position = "relative";

        // Title
        const title = document.createElement("h2");
        title.textContent = "📊 Guest Stats";
        title.style.color = "#fff";
        title.style.marginTop = 0;
        title.style.marginBottom = "20px";
        title.style.fontSize = "28px";

        // Formatted content (kills, deaths, etc.)
        const content = document.createElement("div");
        content.style.color = "#fff";
        content.style.fontSize = "18px";
        content.style.lineHeight = "1.6";

        const lines = [
          `Score: ${stats.score}`,
          `Funds: ${stats.funds}`,
          `Kills: ${stats.kills}`,
          `Deaths: ${stats.deaths}`,
          `Games: ${stats.games}`,
          `Wins: ${stats.wins}`,
        ];

        content.textContent = lines.join('\n');

        // Close button
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.marginTop = "25px";
        closeBtn.style.padding = "10px 25px";
        closeBtn.style.backgroundColor = "#007bff";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "6px";
        closeBtn.style.color = "white";
        closeBtn.style.fontSize = "16px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.transition = "background-color 0.3s ease";

        closeBtn.addEventListener("mouseenter", () => {
          closeBtn.style.backgroundColor = "#0056b3";
        });
        closeBtn.addEventListener("mouseleave", () => {
          closeBtn.style.backgroundColor = "#007bff";
        });

        closeBtn.onclick = () => {
          overlay.remove();
        };

        // Close popup if click outside popup (on overlay)
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.remove();
          }
        });

        popup.appendChild(title);
        popup.appendChild(content);
        popup.appendChild(closeBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
      }
    }, 3000); // 3 seconds delay
  });
})();
