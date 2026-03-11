const dashboardData = {
  sites: [
    {
      name: "siteofcastronomia.site",
      status: "online",
      ping: 120,
      http: 200,
      uptime: 99.98,
      visitorsToday: 842,
      lastUpdate: "Hoje, 20:08",
      lastCheck: "20:14",
      downtime: "Nenhuma queda nas últimas 48h"
    },
    {
      name: "ztrcompany.site",
      status: "online",
      ping: 96,
      http: 200,
      uptime: 99.92,
      visitorsToday: 523,
      lastUpdate: "Hoje, 19:55",
      lastCheck: "20:14",
      downtime: "Queda de 3 min ontem às 22:11"
    },
    {
      name: "painelztr.github.io",
      status: "offline",
      ping: 0,
      http: 503,
      uptime: 96.41,
      visitorsToday: 138,
      lastUpdate: "Hoje, 18:22",
      lastCheck: "20:14",
      downtime: "Indisponível desde 20:10"
    },
    {
      name: "galeria-love.site",
      status: "online",
      ping: 143,
      http: 200,
      uptime: 99.70,
      visitorsToday: 214,
      lastUpdate: "Hoje, 19:40",
      lastCheck: "20:14",
      downtime: "Nenhuma queda nas últimas 24h"
    }
  ],
  access7d: [420, 610, 540, 860, 940, 1100, 1320],
  visits7d: [1800, 2100, 1960, 2330, 2570, 2810, 3090],
  alerts: [
    { type: "danger", title: "painelztr.github.io offline", desc: "O sistema detectou falha HTTP 503 e indisponibilidade.", time: "Agora" },
    { type: "warning", title: "Aumento no tempo de resposta", desc: "siteofcastronomia.site chegou a 220ms no pico.", time: "Há 14 min" },
    { type: "success", title: "SSL validado", desc: "ztrcompany.site com certificado ativo e seguro.", time: "Há 27 min" }
  ],
  updates: [
    { title: "Deploy concluído em ztrcompany.site", desc: "Nova atualização visual aplicada com sucesso.", time: "Hoje, 19:55" },
    { title: "Backup automático executado", desc: "Cópia de segurança salva localmente.", time: "Hoje, 18:00" },
    { title: "Cache limpo no painel", desc: "Dados temporários removidos para melhor desempenho.", time: "Hoje, 16:30" }
  ],
  topPages: [
    { name: "/inicio", value: 1850 },
    { name: "/nossa-historia", value: 1260 },
    { name: "/quiz", value: 913 },
    { name: "/album", value: 772 },
    { name: "/contato", value: 504 }
  ],
  countries: [
    { name: "Brasil", value: 82 },
    { name: "Portugal", value: 8 },
    { name: "Estados Unidos", value: 5 },
    { name: "Argentina", value: 3 },
    { name: "Canadá", value: 2 }
  ],
  devices: [
    { name: "Mobile", value: 64 },
    { name: "Desktop", value: 29 },
    { name: "Tablet", value: 7 }
  ],
  security: {
    sslStatus: "Seguro",
    loginAttempts: 42,
    suspiciousIps: [
      "185.221.77.91 • Tentativa de login inválida",
      "201.19.88.14 • Requisições excessivas",
      "45.172.22.19 • Acesso fora do padrão"
    ],
    malwareStatus: "Nenhuma ameaça"
  },
  accessLogs: [
    "[20:01] LOGIN admin",
    "[20:02] GET /dashboard 200",
    "[20:04] GET /analytics 200",
    "[20:08] POST /refresh-monitor 200",
    "[20:10] GET /painelztr.github.io 503"
  ],
  systemLogs: [
    "[19:41] INFO SITE ONLINE siteofcastronomia.site",
    "[19:48] WARN LATÊNCIA ELEVADA ztrcompany.site 188ms",
    "[19:52] ERROR 404 /pagina-x",
    "[19:55] INFO DEPLOY CONCLUÍDO ztrcompany.site",
    "[20:01] LOGIN admin",
    "[20:07] INFO BACKUP EXECUTADO",
    "[20:10] ERROR SITE OFFLINE painelztr.github.io",
    "[20:12] INFO SSL VALIDADO"
  ],
  projects: [
    {
      name: "Site OFC Astronomia",
      status: "Online",
      progress: 84,
      desc: "Portal com monitoramento, eventos astronômicos e artigos.",
      links: ["https://siteofcastronomia.site", "#"]
    },
    {
      name: "ZTR Company",
      status: "Em produção",
      progress: 72,
      desc: "Site principal da empresa com portfólio, serviços e projetos.",
      links: ["https://ztrcompany.site", "#"]
    },
    {
      name: "Jogos Unity",
      status: "Desenvolvimento",
      progress: 58,
      desc: "Área para acompanhar builds, ideias e progresso dos games.",
      links: ["#", "#"]
    },
    {
      name: "Canal do YouTube",
      status: "Ativo",
      progress: 61,
      desc: "Organização de vídeos, thumbnails, metas e calendário de conteúdo.",
      links: ["#", "#"]
    }
  ],
  events: [
    { title: "Chuva de meteoros", meta: "12/03 • 22:00", desc: "Evento astronômico destacado para publicação no site." },
    { title: "Atualização da home", meta: "14/03 • 18:00", desc: "Nova versão do layout principal." },
    { title: "Revisão de SEO", meta: "16/03 • 15:30", desc: "Ajustes de performance e indexação." }
  ],
  tasks: [
    { title: "Adicionar novo card de projeto", meta: "Pendente", desc: "Inserir projeto novo no gerenciador." },
    { title: "Revisar página de segurança", meta: "Em andamento", desc: "Melhorar logs e monitoramento de IP." },
    { title: "Publicar atualização de analytics", meta: "Concluído", desc: "Novos dados visuais adicionados ao painel." }
  ]
};

const sectionMeta = {
  dashboard: {
    title: "Dashboard Principal",
    subtitle: "Visão geral do seu ecossistema digital"
  },
  monitoramento: {
    title: "Monitoramento de Sites",
    subtitle: "Status, ping, uptime e histórico de quedas"
  },
  analytics: {
    title: "Analytics do Site",
    subtitle: "Visitantes, páginas mais acessadas e tráfego"
  },
  seguranca: {
    title: "Segurança",
    subtitle: "SSL, logins, IPs suspeitos e verificação"
  },
  logs: {
    title: "Sistema de Logs",
    subtitle: "Eventos do sistema e erros monitorados"
  },
  projetos: {
    title: "Gerenciador de Projetos",
    subtitle: "Acompanhe progresso, status e links"
  },
  eventos: {
    title: "Eventos / Atualizações",
    subtitle: "Próximas ações, eventos e novidades"
  },
  automacao: {
    title: "Automação",
    subtitle: "Rotinas automáticas do painel"
  }
};

const automationDefault = {
  backup: true,
  autoUpdate: true,
  uptimeCheck: true,
  cacheClean: false
};

let automationState = JSON.parse(localStorage.getItem("ztr_automation")) || automationDefault;

const navButtons = document.querySelectorAll(".nav-btn");
const contents = document.querySelectorAll(".content");
const sectionTitle = document.getElementById("sectionTitle");
const sectionSubtitle = document.getElementById("sectionSubtitle");
const refreshBtn = document.getElementById("refreshBtn");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

function formatNumber(num) {
  return new Intl.NumberFormat("pt-BR").format(num);
}

function getStatusLabel(status) {
  return status === "online" ? "🟢 Online" : "🔴 Offline";
}

function getStatusClass(status) {
  return status === "online" ? "online" : "offline";
}

function renderDashboard() {
  const totalSites = dashboardData.sites.length;
  const onlineSites = dashboardData.sites.filter(site => site.status === "online").length;
  const offlineSites = totalSites - onlineSites;
  const avgPing = Math.round(
    dashboardData.sites.reduce((acc, site) => acc + site.ping, 0) /
    dashboardData.sites.filter(site => site.ping > 0).length
  );
  const avgUptime = (
    dashboardData.sites.reduce((acc, site) => acc + site.uptime, 0) / totalSites
  ).toFixed(2);
  const totalVisitors = dashboardData.sites.reduce((acc, site) => acc + site.visitorsToday, 0);

  document.getElementById("heroTotalSites").textContent = totalSites;
  document.getElementById("heroOnlineSites").textContent = onlineSites;
  document.getElementById("heroAlerts").textContent = dashboardData.alerts.length;

  document.getElementById("statusGeral").textContent = `${onlineSites} online / ${offlineSites} offline`;
  document.getElementById("tempoRespostaMedio").textContent = `${avgPing}ms`;
  document.getElementById("uptimeMedio").textContent = `${avgUptime}%`;
  document.getElementById("visitantesHoje").textContent = formatNumber(totalVisitors);

  const siteListDashboard = document.getElementById("siteListDashboard");
  siteListDashboard.innerHTML = dashboardData.sites.map(site => `
    <div class="site-item">
      <div class="site-item-top">
        <strong>${site.name}</strong>
        <span class="status ${getStatusClass(site.status)}">${getStatusLabel(site.status)}</span>
      </div>
      <div class="site-meta">
        <span class="chip">⚡ ${site.ping > 0 ? `${site.ping}ms` : "—"}</span>
        <span class="chip">📶 HTTP ${site.http}</span>
        <span class="chip">🕒 Uptime ${site.uptime}%</span>
        <span class="chip">👥 ${formatNumber(site.visitorsToday)} hoje</span>
      </div>
    </div>
  `).join("");

  const alertList = document.getElementById("alertList");
  alertList.innerHTML = dashboardData.alerts.map(item => `
    <div class="alert-item">
      <strong>${item.title}</strong>
      <div>${item.desc}</div>
      <div class="event-meta">
        <span class="chip">${item.time}</span>
      </div>
    </div>
  `).join("");

  const timeline = document.getElementById("timelineUpdates");
  timeline.innerHTML = dashboardData.updates.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <div>${item.desc}</div>
      <div class="event-meta">
        <span class="chip">${item.time}</span>
      </div>
    </div>
  `).join("");
}

function renderMonitoring() {
  const table = document.getElementById("monitorTable");
  table.innerHTML = dashboardData.sites.map(site => `
    <tr>
      <td>${site.name}</td>
      <td><span class="status ${getStatusClass(site.status)}">${getStatusLabel(site.status)}</span></td>
      <td>${site.http}</td>
      <td>${site.ping > 0 ? `${site.ping}ms` : "—"}</td>
      <td>${site.uptime}%</td>
      <td>${site.lastCheck}</td>
    </tr>
  `).join("");

  document.getElementById("downtimeHistory").innerHTML = dashboardData.sites.map(site => `
    <div class="event-item">
      <strong>${site.name}</strong>
      <div>${site.downtime}</div>
      <div class="event-meta">
        <span class="chip">Última atualização: ${site.lastUpdate}</span>
      </div>
    </div>
  `).join("");
}

function renderAnalytics() {
  const totalVisitors = dashboardData.visits7d.reduce((a, b) => a + b, 0);

  document.getElementById("analyticsVisitors").textContent = formatNumber(totalVisitors);
  document.getElementById("avgTimeSite").textContent = "4m 38s";
  document.getElementById("mainDevice").textContent = dashboardData.devices[0].name;
  document.getElementById("mainTraffic").textContent = "Orgânico";

  document.getElementById("topPages").innerHTML = dashboardData.topPages.map((page, i) => `
    <div class="rank-item">
      <div class="rank-item-top">
        <strong>${i + 1}. ${page.name}</strong>
        <span class="chip">${formatNumber(page.value)} visitas</span>
      </div>
    </div>
  `).join("");

  document.getElementById("countryList").innerHTML = dashboardData.countries.map(country => `
    <div class="rank-item">
      <div class="rank-item-top">
        <strong>${country.name}</strong>
        <span class="chip">${country.value}%</span>
      </div>
    </div>
  `).join("");

  document.getElementById("deviceList").innerHTML = dashboardData.devices.map(device => `
    <div class="rank-item">
      <div class="rank-item-top">
        <strong>${device.name}</strong>
        <span class="chip">${device.value}%</span>
      </div>
    </div>
  `).join("");
}

function renderSecurity() {
  document.getElementById("sslStatus").textContent = dashboardData.security.sslStatus;
  document.getElementById("loginAttempts").textContent = dashboardData.security.loginAttempts;
  document.getElementById("suspiciousIpsCount").textContent = dashboardData.security.suspiciousIps.length;
  document.getElementById("malwareStatus").textContent = dashboardData.security.malwareStatus;

  document.getElementById("suspiciousIpList").innerHTML = dashboardData.security.suspiciousIps.map(ip => `
    <div class="event-item">
      <strong>IP suspeito</strong>
      <div>${ip}</div>
    </div>
  `).join("");

  document.getElementById("accessLogs").innerHTML = dashboardData.accessLogs.map(log => `
    <div class="log-line">${log}</div>
  `).join("");
}

function renderLogs() {
  document.getElementById("systemLogs").innerHTML = dashboardData.systemLogs.map(log => `
    <div class="log-line">${log}</div>
  `).join("");
}

function renderProjects() {
  document.getElementById("projectGrid").innerHTML = dashboardData.projects.map(project => `
    <div class="project-card glass">
      <div class="project-top">
        <h4>${project.name}</h4>
        <span class="chip">${project.status}</span>
      </div>
      <p>${project.desc}</p>
      <div class="progress">
        <span style="width:${project.progress}%"></span>
      </div>
      <div class="project-bottom">
        <span class="chip">Progresso ${project.progress}%</span>
      </div>
      <div class="project-links">
        <a href="${project.links[0]}" target="_blank">Abrir</a>
        <a href="${project.links[1]}" target="_blank">Detalhes</a>
      </div>
    </div>
  `).join("");
}

function renderEvents() {
  document.getElementById("upcomingEvents").innerHTML = dashboardData.events.map(event => `
    <div class="event-item">
      <strong>${event.title}</strong>
      <div>${event.desc}</div>
      <div class="event-meta">
        <span class="chip">${event.meta}</span>
      </div>
    </div>
  `).join("");

  document.getElementById("tasksUpdates").innerHTML = dashboardData.tasks.map(task => `
    <div class="event-item">
      <strong>${task.title}</strong>
      <div>${task.desc}</div>
      <div class="event-meta">
        <span class="chip">${task.meta}</span>
      </div>
    </div>
  `).join("");
}

function renderAutomation() {
  document.querySelectorAll(".automation-toggle").forEach(toggle => {
    const key = toggle.dataset.key;
    toggle.checked = !!automationState[key];
  });

  const statuses = [
    { key: "backup", label: "Backup automático" },
    { key: "autoUpdate", label: "Atualização automática" },
    { key: "uptimeCheck", label: "Verificação de uptime" },
    { key: "cacheClean", label: "Limpeza de cache" }
  ];

  document.getElementById("automationStatus").innerHTML = statuses.map(item => `
    <div class="event-item">
      <strong>${item.label}</strong>
      <div>${automationState[item.key] ? "Ativado" : "Desativado"}</div>
      <div class="event-meta">
        <span class="chip">${automationState[item.key] ? "Em execução" : "Parado"}</span>
      </div>
    </div>
  `).join("");
}

function switchSection(sectionId) {
  contents.forEach(section => section.classList.remove("active"));
  navButtons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(sectionId).classList.add("active");
  document.querySelector(`[data-section="${sectionId}"]`).classList.add("active");

  sectionTitle.textContent = sectionMeta[sectionId].title;
  sectionSubtitle.textContent = sectionMeta[sectionId].subtitle;

  if (window.innerWidth <= 860) {
    sidebar.classList.remove("open");
  }
}

function setupNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      switchSection(btn.dataset.section);
    });
  });
}

function startClock() {
  const clock = document.getElementById("liveClock");
  const updateClock = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("pt-BR");
  };
  updateClock();
  setInterval(updateClock, 1000);
}

function drawLineChart(canvasId, data, labels) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = 260;

  ctx.clearRect(0, 0, width, height);

  const padding = 36;
  const maxValue = Math.max(...data) * 1.15;

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i++) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#59d0ff";

  data.forEach((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  data.forEach((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);

    ctx.beginPath();
    ctx.fillStyle = "#4fffb3";
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#9cb0cf";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[index], x, height - 14);
  });
}

function renderCharts() {
  drawLineChart("accessChart", dashboardData.access7d, ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]);
  drawLineChart("visitsChart", dashboardData.visits7d, ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]);
}

function setupRefresh() {
  refreshBtn.addEventListener("click", () => {
    randomizeData();
    rerenderAll();
  });
}

function randomizeData() {
  dashboardData.sites = dashboardData.sites.map(site => {
    const isOnline = Math.random() > 0.12;
    const ping = isOnline ? Math.floor(Math.random() * 110) + 70 : 0;
    const http = isOnline ? 200 : 503;
    const uptime = isOnline
      ? Number((99 + Math.random()).toFixed(2))
      : Number((95 + Math.random() * 3).toFixed(2));
    const visitorsToday = site.visitorsToday + Math.floor(Math.random() * 80);

    return {
      ...site,
      status: isOnline ? "online" : "offline",
      ping,
      http,
      uptime,
      visitorsToday,
      lastCheck: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      downtime: isOnline ? "Sem nova queda detectada" : "Falha detectada nesta última checagem"
    };
  });

  dashboardData.alerts.unshift({
    type: "warning",
    title: "Painel atualizado manualmente",
    desc: "Os dados de status e resposta foram recalculados visualmente.",
    time: "Agora"
  });

  dashboardData.alerts = dashboardData.alerts.slice(0, 5);

  dashboardData.updates.unshift({
    title: "Atualização de monitoramento executada",
    desc: "Novos dados renderizados no dashboard.",
    time: "Agora"
  });

  dashboardData.updates = dashboardData.updates.slice(0, 5);

  dashboardData.systemLogs.unshift(`[${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}] INFO DASHBOARD ATUALIZADO`);
  dashboardData.systemLogs = dashboardData.systemLogs.slice(0, 12);
}

function setupAutomation() {
  document.querySelectorAll(".automation-toggle").forEach(toggle => {
    toggle.addEventListener("change", () => {
      automationState[toggle.dataset.key] = toggle.checked;
      localStorage.setItem("ztr_automation", JSON.stringify(automationState));
      renderAutomation();
    });
  });
}

function setupSimulatedFailure() {
  const btn = document.getElementById("simulateFailureBtn");
  btn.addEventListener("click", () => {
    const target = dashboardData.sites[0];
    target.status = "offline";
    target.ping = 0;
    target.http = 503;
    target.lastCheck = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    target.downtime = "Queda simulada manualmente pelo painel";

    dashboardData.alerts.unshift({
      type: "danger",
      title: `${target.name} offline`,
      desc: "Falha simulada com alerta visual acionado.",
      time: "Agora"
    });

    dashboardData.systemLogs.unshift(`[${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}] ERROR SITE OFFLINE ${target.name}`);
    rerenderAll();
    switchSection("monitoramento");
  });
}

function rerenderAll() {
  renderDashboard();
  renderMonitoring();
  renderAnalytics();
  renderSecurity();
  renderLogs();
  renderProjects();
  renderEvents();
  renderAutomation();
  renderCharts();
}

function setupSidebarToggle() {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

function init() {
  setupNavigation();
  setupRefresh();
  setupSidebarToggle();
  setupSimulatedFailure();
  startClock();
  rerenderAll();
  setupAutomation();
}

window.addEventListener("resize", renderCharts);
window.addEventListener("load", init);