const socket = io();

const elements = {
  agentStatus: document.getElementById('agentStatus'),
  onlineBadge: document.getElementById('onlineBadge'),
  lastUpdate: document.getElementById('lastUpdate'),
  cpuPercent: document.getElementById('cpuPercent'),
  ramPercent: document.getElementById('ramPercent'),
  diskPercent: document.getElementById('diskPercent'),
  uptimeText: document.getElementById('uptimeText'),
  bootTime: document.getElementById('bootTime'),
  cpuExtra: document.getElementById('cpuExtra'),
  ramExtra: document.getElementById('ramExtra'),
  diskExtra: document.getElementById('diskExtra'),
  networkUpload: document.getElementById('networkUpload'),
  networkDownload: document.getElementById('networkDownload'),
  localIp: document.getElementById('localIp'),
  hostname: document.getElementById('hostname'),
  osName: document.getElementById('osName'),
  osVersion: document.getElementById('osVersion'),
  architecture: document.getElementById('architecture'),
  cpuCores: document.getElementById('cpuCores'),
  cpuThreads: document.getElementById('cpuThreads'),
  cpuBar: document.getElementById('cpuBar'),
  ramBar: document.getElementById('ramBar'),
  diskBar: document.getElementById('diskBar'),
  cpuChart: document.getElementById('cpuChart'),
  eventsList: document.getElementById('eventsList')
};

const state = {
  cpuHistory: [],
  events: []
};

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '--';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = Number(bytes);
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(0)}%`;
}

function formatDateTime(dateInput) {
  if (!dateInput) return '--';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('pt-BR');
}

function formatUptime(seconds) {
  const total = Math.floor(Number(seconds || 0));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function setOnlineState(isOnline) {
  elements.onlineBadge.textContent = isOnline ? 'Online' : 'Offline';
  elements.onlineBadge.classList.toggle('is-online', isOnline);
  elements.agentStatus.textContent = isOnline
    ? 'Agente conectado e enviando métricas'
    : 'Sem comunicação recente com o agente';
}

function renderEvents() {
  if (!state.events.length) {
    elements.eventsList.innerHTML = '<div class="event-item">Nenhum evento registrado.</div>';
    return;
  }

  elements.eventsList.innerHTML = state.events
    .slice(0, 6)
    .map((item) => `
      <div class="event-item">
        <strong>${item.title}</strong>
        <small>${item.time}</small>
      </div>
    `)
    .join('');
}

function addEvent(title) {
  state.events.unshift({
    title,
    time: new Date().toLocaleString('pt-BR')
  });
  state.events = state.events.slice(0, 6);
  renderEvents();
}

function renderChart() {
  elements.cpuChart.innerHTML = '';

  if (!state.cpuHistory.length) {
    elements.cpuChart.innerHTML = '<div class="event-item" style="width:100%">Sem histórico ainda.</div>';
    return;
  }

  state.cpuHistory.forEach((value, index) => {
    const column = document.createElement('div');
    column.className = 'chart-column';

    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = `${Math.max(20, value * 2.1)}px`;

    const label = document.createElement('div');
    label.className = 'chart-label';
    label.textContent = `${index + 1}`;

    column.appendChild(bar);
    column.appendChild(label);
    elements.cpuChart.appendChild(column);
  });
}

function updateMetrics(data) {
  const cpu = Number(data.cpu?.percent || 0);
  const ram = Number(data.memory?.percent || 0);
  const disk = Number(data.disk?.percent || 0);

  elements.cpuPercent.textContent = formatPercent(cpu);
  elements.ramPercent.textContent = formatPercent(ram);
  elements.diskPercent.textContent = formatPercent(disk);
  elements.uptimeText.textContent = formatUptime(data.system?.uptime_seconds);
  elements.bootTime.textContent = `Ligado desde ${formatDateTime(data.system?.boot_time)}`;

  elements.cpuExtra.textContent = `${data.cpu?.physical_cores || '--'} núcleos físicos / ${data.cpu?.logical_cores || '--'} threads`;
  elements.ramExtra.textContent = `${formatBytes(data.memory?.used_bytes)} / ${formatBytes(data.memory?.total_bytes)}`;
  elements.diskExtra.textContent = `${formatBytes(data.disk?.used_bytes)} / ${formatBytes(data.disk?.total_bytes)}`;

  elements.networkUpload.textContent = `${formatBytes(data.network?.bytes_sent)} enviados`;
  elements.networkDownload.textContent = `${formatBytes(data.network?.bytes_recv)} recebidos`;
  elements.localIp.textContent = data.system?.local_ip || '--';
  elements.hostname.textContent = data.system?.hostname || '--';

  elements.osName.textContent = data.system?.os || '--';
  elements.osVersion.textContent = data.system?.os_version || '--';
  elements.architecture.textContent = data.system?.architecture || '--';
  elements.cpuCores.textContent = data.cpu?.physical_cores || '--';
  elements.cpuThreads.textContent = data.cpu?.logical_cores || '--';

  elements.cpuBar.style.width = `${cpu}%`;
  elements.ramBar.style.width = `${ram}%`;
  elements.diskBar.style.width = `${disk}%`;

  state.cpuHistory.push(cpu);
  if (state.cpuHistory.length > 12) {
    state.cpuHistory.shift();
  }

  elements.lastUpdate.textContent = `Última atualização: ${formatDateTime(data.server_received_at || data.collected_at)}`;
  renderChart();
}

socket.on('connect', () => {
  addEvent('Painel conectado ao servidor Socket.IO');
});

socket.on('initial-data', (payload) => {
  if (payload?.monitor) {
    setOnlineState(true);
    updateMetrics(payload.monitor);
    addEvent(`Dados iniciais carregados de ${payload.monitor.system?.hostname || 'uma máquina'}`);
  } else {
    setOnlineState(false);
  }
});

socket.on('monitor-update', (payload) => {
  setOnlineState(true);
  updateMetrics(payload);
  addEvent(`Nova leitura recebida de ${payload.system?.hostname || 'uma máquina'}`);
});

socket.on('agent-offline', () => {
  setOnlineState(false);
  addEvent('Agente ficou offline ou parou de enviar dados');
});

setOnlineState(false);
renderChart();
renderEvents();
