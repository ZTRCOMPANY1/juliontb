async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const avatar = document.getElementById("registerAvatar").value.trim();
  const message = document.getElementById("registerMessage");

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, avatar })
  });

  const data = await res.json();
  message.textContent = data.message || data.error || "";

  if (res.ok) {
    document.getElementById("registerUsername").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("registerAvatar").value = "";
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const message = document.getElementById("loginMessage");

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  message.textContent = data.message || data.error || "";

  if (res.ok) {
    localStorage.setItem("gamerProfileUser", JSON.stringify(data.user));
    location.href = "/dashboard";
  }
}

function createListItems(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.textContent = item;
    container.appendChild(div);
  });
}

function createStats(stats) {
  const container = document.getElementById("stats");
  if (!container) return;
  container.innerHTML = "";

  const labels = {
    hoursPlayed: "Horas jogadas",
    completedGames: "Jogos zerados",
    rareAchievements: "Conquistas raras",
    badgesCount: "Total de badges"
  };

  Object.entries(stats).forEach(([key, value]) => {
    const div = document.createElement("div");
    div.className = "stat-box";
    div.innerHTML = `<strong>${value}</strong><span>${labels[key] || key}</span>`;
    container.appendChild(div);
  });
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("gamerProfileUser") || "null");
  if (!user) {
    location.href = "/login";
    return;
  }

  const avatar = document.getElementById("avatar");
  const username = document.getElementById("username");
  const level = document.getElementById("level");
  const profileLink = document.getElementById("profileLink");

  if (avatar) avatar.src = user.avatar;
  if (username) username.textContent = user.username;
  if (level) level.textContent = `Nível ${user.level}`;
  if (profileLink) {
    profileLink.textContent = `${location.origin}/u/${user.slug}`;
  }

  createListItems("games", user.gamesPlayed);
  createListItems("achievements", user.achievements);
  createListItems("badges", user.badges);
  createStats(user.stats);
}

async function loadPublicProfile() {
  const parts = location.pathname.split("/");
  const slug = parts[parts.length - 1];
  if (!slug) return;

  const res = await fetch(`/api/profile/${slug}`);
  const data = await res.json();

  if (!res.ok) {
    document.body.innerHTML = `<div class="container"><div class="card"><h1>Perfil não encontrado</h1></div></div>`;
    return;
  }

  document.getElementById("avatar").src = data.avatar;
  document.getElementById("username").textContent = data.username;
  document.getElementById("level").textContent = `Nível ${data.level}`;

  createListItems("games", data.gamesPlayed);
  createListItems("achievements", data.achievements);
  createListItems("badges", data.badges);
  createStats(data.stats);
}

if (location.pathname === "/dashboard") {
  loadDashboard();
}

if (location.pathname.startsWith("/u/")) {
  loadPublicProfile();
}