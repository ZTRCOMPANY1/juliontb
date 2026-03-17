const API_BASE_URL = "https://server-pcmonitor.onrender.com";

const token = localStorage.getItem("pc_monitor_token");
if (!token) {
  window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const machineId = params.get("id");

if (!machineId) {
  window.location.href = "index.html";
}

const machineTitle = document.getElementById("machineTitle");
const machineSubtitle = document.getElementById("machineSubtitle");
const summaryGrid = document.getElementById("summaryGrid");
const partitionsList = document.getElementById("partitionsList");
const processList = document.getElementById("processList");
const historyList = document.getElementById("historyList");
const eventsList = document.getElementById("eventsList");
const rangeSelect = document.getElementById("rangeSelect");
const eventSearch = document.getElementById("eventSearch");
const reloadBtn = document.getElementById("reloadBtn");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");
const jsonExport = document.getElementById("jsonExport");
const csvExport = document.getElementById("csvExport");

jsonExport.href = `${API_BASE_URL}/api/export/${encodeURIComponent(machineId)}.json`;
csvExport.href = `${API_BASE_URL}/api/export/${encodeURIComponent(machineId)}.csv`;

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

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("pc_monitor_token");
  window.location.href = "login.html";
});

reloadBtn.addEventListener("click", loadAll);
rangeSelect.addEventListener("change", loadHistory);
eventSearch.addEventListener("input", loadEvents);

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

function formatBytes(bytes) {
  if (bytes == null) return "--";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = Number(bytes);
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function formatPercent(value) {
  if (value == null) return "--";
  return `${Number(value).toFixed(0)}%`;
}

function formatDate(value) {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleString("pt-BR");
  } catch {
    return "--";
  }
}

function formatUptime(seconds) {
  if (seconds == null) return "--";

  const total = Number(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function renderSummary(machine, metric) {
  if (!machineTitle || !machineSubtitle || !summaryGrid) return;

  machineTitle.textContent = machine.name || machine.machine_id;
  machineSubtitle.textContent = `${machine.hostname || "--"} • ${machine.os || "--"} ${machine.os_version || ""}`;

  const items = [
    ["CPU", formatPercent(metric?.cpu_percent)],
    ["Temp CPU", metric?.cpu_temp != null ? `${metric.cpu_temp}°C` : "--"],
    ["GPU", formatPercent(metric?.gpu_percent)],
    ["Temp GPU", metric?.gpu_temp != null ? `${metric.gpu_temp}°C` : "--"],
    ["Cooler", metric?.fan_speed_rpm != null ? `${metric.fan_speed_rpm} RPM` : "--"],
    ["RAM", formatPercent(metric?.memory_percent)],
    ["RAM usada", formatBytes(metric?.memory_used_bytes)],
    ["RAM total", formatBytes(metric?.memory_total_bytes)],
    ["Disco", formatPercent(metric?.disk_percent)],
    ["Disco usado", formatBytes(metric?.disk_used_bytes)],
    ["Disco livre", formatBytes(metric?.disk_free_bytes)],
    ["Leitura disco", formatBytes(metric?.disk_read_bytes)],
    ["Escrita disco", formatBytes(metric?.disk_write_bytes)],
    ["Upload total", formatBytes(metric?.bytes_sent)],
    ["Download total", formatBytes(metric?.bytes_recv)],
    ["Ping", metric?.ping_ms != null ? `${metric.ping_ms} ms` : "--"],
    ["Perda de pacote", metric?.packet_loss_percent != null ? `${metric.packet_loss_percent}%` : "--"],
    ["Bateria", metric?.battery_percent != null ? `${metric.battery_percent}%` : "--"],
    ["Carregando", metric?.battery_plugged == null ? "--" : (Number(metric.battery_plugged) ? "Sim" : "Não")],
    ["Uptime", formatUptime(metric?.uptime_seconds)],
    ["Boot", formatDate(metric?.boot_time)],
    ["IP Local", machine.local_ip || "--"],
    ["IP Público", machine.public_ip || "--"],
    ["Usuário", machine.username || "--"]
  ];

  summaryGrid.innerHTML = items.map(([label, value]) => `
    <div class="summary-card">
      <div class="muted">${label}</div>
      <h3>${value}</h3>
    </div>
  `).join("");
}

function renderPartitions(partitions) {
  if (!partitionsList) return;

  if (!partitions || !partitions.length) {
    partitionsList.innerHTML = `<div class="list-item">Nenhuma partição encontrada.</div>`;
    return;
  }

  partitionsList.innerHTML = `
    <div class="list-stack">
      ${partitions.map((p) => `
        <div class="list-item">
          <div class="row"><span>Dispositivo</span><strong>${p.device || "--"}</strong></div>
          <div class="row"><span>Montagem</span><strong>${p.mountpoint || "--"}</strong></div>
          <div class="row"><span>FS</span><strong>${p.filesystem || "--"}</strong></div>
          <div class="row"><span>Total</span><strong>${formatBytes(p.total_bytes)}</strong></div>
          <div class="row"><span>Usado</span><strong>${formatBytes(p.used_bytes)}</strong></div>
          <div class="row"><span>Livre</span><strong>${formatBytes(p.free_bytes)}</strong></div>
          <div class="row"><span>Uso</span><strong>${p.percent != null ? `${Number(p.percent).toFixed(0)}%` : "--"}</strong></div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProcesses(processes) {
  if (!processList) return;

  if (!processes || !processes.length) {
    processList.innerHTML = `<div class="list-item">Nenhum processo encontrado.</div>`;
    return;
  }

  processList.innerHTML = `
    <div class="list-stack">
      ${processes.map((p) => `
        <div class="list-item">
          <div class="row"><span>Processo</span><strong>${p.process_name || "--"}</strong></div>
          <div class="row"><span>PID</span><strong>${p.pid || "--"}</strong></div>
          <div class="row"><span>CPU</span><strong>${p.cpu_percent != null ? `${Number(p.cpu_percent).toFixed(1)}%` : "--"}</strong></div>
          <div class="row"><span>RAM</span><strong>${p.memory_percent != null ? `${Number(p.memory_percent).toFixed(1)}%` : "--"}</strong></div>
          <div class="row"><span>Status</span><strong>${p.status || "--"}</strong></div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderHistory(metrics) {
  if (!historyList) return;

  if (!metrics || !metrics.length) {
    historyList.innerHTML = `<div class="list-item">Sem histórico para este período.</div>`;
    return;
  }

  historyList.innerHTML = `
    <div class="list-stack">
      ${metrics.slice(-20).reverse().map((m) => `
        <div class="list-item">
          <div class="row"><span>Data</span><strong>${formatDate(m.created_at)}</strong></div>
          <div class="row"><span>CPU</span><strong>${formatPercent(m.cpu_percent)}</strong></div>
          <div class="row"><span>RAM</span><strong>${formatPercent(m.memory_percent)}</strong></div>
          <div class="row"><span>Disco</span><strong>${formatPercent(m.disk_percent)}</strong></div>
          <div class="row"><span>Ping</span><strong>${m.ping_ms != null ? `${m.ping_ms} ms` : "--"}</strong></div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEvents(events) {
  if (!eventsList) return;

  if (!events || !events.length) {
    eventsList.innerHTML = `<div class="list-item">Nenhum evento encontrado.</div>`;
    return;
  }

  eventsList.innerHTML = `
    <div class="list-stack">
      ${events.map((event) => `
        <div class="list-item">
          <div class="row">
            <span class="level-${event.level === "error" ? "error" : event.level === "warn" ? "warn" : "info"}">
              ${event.level}
            </span>
            <strong>${event.event_type}</strong>
          </div>
          <div>${event.message}</div>
          <div class="muted" style="margin-top:8px">${formatDate(event.created_at)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

async function loadDetails() {
  const data = await api(`/api/machines/${encodeURIComponent(machineId)}`);
  if (!data) return;

  renderSummary(data.machine, data.latestMetric);
  renderPartitions(data.partitions || []);
  renderProcesses(data.processes || []);
}

async function loadHistory() {
  const data = await api(`/api/machines/${encodeURIComponent(machineId)}/history?range=${encodeURIComponent(rangeSelect.value)}`);
  if (!data) return;

  renderHistory(data.metrics || []);
}

async function loadEvents() {
  const q = eventSearch.value.trim();
  const data = await api(`/api/machines/${encodeURIComponent(machineId)}/events?q=${encodeURIComponent(q)}`);
  if (!data) return;

  renderEvents(data.events || []);
}

async function loadAll() {
  await Promise.all([
    loadDetails(),
    loadHistory(),
    loadEvents()
  ]);
}

const socket = io(API_BASE_URL, {
  transports: ["websocket", "polling"]
});

socket.on("monitor-update", (payload) => {
  if (!payload || payload.machineId !== machineId) return;

  if (payload.machine && payload.latestMetric) {
    renderSummary(payload.machine, payload.latestMetric);
  }

  if (payload.partitions) {
    renderPartitions(payload.partitions);
  }

  if (payload.processes) {
    renderProcesses(payload.processes);
  }

  loadHistory();
  loadEvents();
});

loadAll();