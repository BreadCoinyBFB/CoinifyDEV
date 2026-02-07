async function fetchAndRender() {
  const container = document.getElementById('userList');
  const serverId = '1380740300989010001';
  
  // 1. The Proxy is REQUIRED to get data into a browser
  const apiUrl = `https://api.lurkr.gg/v2/levels/${serverId}`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    const result = await res.json();
    
    // 2. DATA FINDER: Lurkr sometimes puts data in .levels, .data, or the root.
    // This line checks all three possibilities so you don't get "undefined".
    const users = (result.levels || result.data || result || []);
    
    if (!users.length || !Array.isArray(users)) {
        throw new Error("No user data found in response");
    }

    container.innerHTML = ''; // Clear the "Loading" text

    users.slice(0, 100).forEach((user, index) => {
      // 3. XP CHECK: Some versions of the API use 'xp', some use 'totalXp'
      const xpCount = user.xp || user.totalXp || 0;
      const username = user.user?.username || "Unknown User";
      const avatar = user.user?.avatar || "";
      const progress = user.progress || 0;

      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
        <span class="rank">#${index + 1}</span>
        <img class="avatar" src="${getAvatarURL(user.userId, avatar)}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png';" />
        <div class="user-info">
          <div class="username">${username}</div>
          <div class="odometer" id="xp-${user.userId}">0</div>
          <div class="xp-labels">
            <span>Level ${user.level}</span>
            <span>${xpCount.toLocaleString()} Total XP</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${progress}%"></div>
          </div>
        </div>
      `;
      container.appendChild(card);

      // Animate the numbers
      setTimeout(() => {
        const el = document.getElementById(`xp-${user.userId}`);
        if (el) el.innerHTML = xpCount;
      }, 250);
    });

  } catch (err) {
    console.error("Lurkr Error:", err);
    container.innerHTML = `<p style="text-align:center; color:red;">Failed to import XP counts. Check console (F12) for details.</p>`;
  }
}

