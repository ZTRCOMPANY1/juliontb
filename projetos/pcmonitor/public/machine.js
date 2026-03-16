const API_BASE_URL = "https://server-pcmonitor.onrender.com";

const token = localStorage.getItem("pc_monitor_token");
if (!token) {
  window.location.href = "login.html";
}

const machinesGrid = document.getElementById("machinesGrid");
const machineCount = document.getElementById("machineCount");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("pc_monitor_token");
  window.location.href = "login.html";
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "pc_monitor_theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

if (localStorage.getItem("pc_monitor_theme") === "light") {
  document.body.classList.add("light");
}

async function api(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    localStorage.removeItem("pc_monitor_token");
    window.location.href = "login.html";
    return null;
  }

  return response.json();
}

function formatDate(value) {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleString("pt-BR");
  } catch {
    return "--";
  }
}

function renderMachines(machines) {
  machineCount.textContent = machines.length;

  if (!machines.length) {
    machinesGrid.innerHTML = `
      <div class="machine-card">
        <h3>Nenhuma máquina encontrada</h3>
        <div class="muted">O agente ainda não enviou dados para o servidor.</div>
      </div>
    `;
    return;
  }

  machinesGrid.innerHTML = machines.map((machine) => `
    <div class="machine-card">
      <div class="row">
        <h3>${machine.name || machine.machine_id}</h3>
        <span class="${machine.is_online ? "online-badge" : "offline-badge"}">
          ${machine.is_online ? "Online" : "Offline"}
        </span>
      </div>

      <div class="muted">${machine.hostname || "--"}</div>

      <div class="row">
        <span>Sistema</span>
        <strong>${machine.os || "--"} ${machine.os_version || ""}</strong>
      </div>

      <div class="row">
        <span>Usuário</span>
        <strong>${machine.username || "--"}</strong>
      </div>

      <div class="row">
        <span>IP local</span>
        <strong>${machine.local_ip || "--"}</strong>
      </div>

      <div class="row">
        <span>IP público</span>
        <strong>${machine.public_ip || "--"}</strong>
      </div>

      <div class="row">
        <span>Última atividade</span>
        <strong>${formatDate(machine.last_seen_at)}</strong>
      </div>

      <div style="margin-top:12px">
        <a class="btn-link" href="machine.html?id=${encodeURIComponent(machine.machine_id)}">Abrir detalhes</a>
      </div>
    </div>
  `).join("");
}

async function loadMachines() {
  const data = await api("/api/machines");
  if (!data) return;
  renderMachines(data.machines || []);
}

const socket = io(API_BASE_URL, {
  transports: ["websocket", "polling"]
});

socket.on("connect", () => {
  console.log("Socket conectado");
});

socket.on("monitor-update", () => {
  loadMachines();
});

socket.on("disconnect", () => {
  console.log("Socket desconectado");
});

loadMachines();