const UPTIMEROBOT_API_KEY = "ur3360004-10ca3da10a0bddcb527812d2";

// Domínios que você quer verificar na segurança:
const SECURITY_DOMAINS = [
  "juliontb.site",
  "ztrcompany.site",
  "juliontb.site/projetos/2%20meses/",
  "ztrcompany.site"
];

// ===== Navegação =====
const navButtons = document.querySelectorAll(".nav-btn");
const contents = document.querySelectorAll(".content");
const sectionTitle = document.getElementById("sectionTitle");
const sectionSubtitle = document.getElementById("sectionSubtitle");
const refreshBtn = document.getElementById("refreshBtn");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

const sectionMeta = {
  dashboard: { title: "Dashboard", subtitle: "Dados reais de monitoramento" },
  monitoramento: { title: "Monitoramento", subtitle: "Status real via API" },
  seguranca: { title: "Segurança", subtitle: "Análise real de headers e SSL" },
  integracoes: { title: "Integrações", subtitle: "Configuração das APIs reais" }
};

function switchSection(sectionId) {
  contents.forEach(section => section.classList.remove("active"));
  navButtons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(sectionId).classList.add("active");
  document.querySelector(`[data-section="${sectionId}"]`).classList.add("active");

  sectionTitle.textContent = sectionMeta[sectionId].title;
  sectionSubtitle.textContent = sectionMeta[sectionId].subtitle;

  if (window.innerWidth <= 860) sidebar.classList.remove("open");
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => switchSection(btn.dataset.section));
});

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

function startClock() {
  const clock = document.getElementById("liveClock");
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString("pt-BR");
  };
  tick();
  setInterval(tick, 1000);
}

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat("pt-BR").format(num);
}

function getStatusInfo(statusCode) {
  // UptimeRobot status codes comuns:
  // 0 paused, 1 not checked yet, 2 up, 8 seems down, 9 down
  if (statusCode === 2) return { text: "🟢 Online", className: "online" };
  return { text: "🔴 Offline", className: "offline" };
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ===== UptimeRobot real =====
async function loadUptimeRobotData() {
  if (!UPTIMEROBOT_API_KEY || UPTIMEROBOT_API_KEY === "u3360004-835ddf630377a084ee4bcb05") {
    renderMissingApiKey();
    return;
  }

  try {
    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        api_key: UPTIMEROBOT_API_KEY,
        format: "json",
        logs: "1",
        response_times: "1",
        response_times_average: "30",
        all_time_uptime_ratio: "1"
      })
    });

    const data = await response.json();

    if (!data.monitors) {
      throw new Error("Resposta inválida da API");
    }

    renderUptimeData(data.monitors);
  } catch (error) {
    console.error(error);
    renderApiError("Erro ao carregar monitoramento real.");
  }
}

function renderMissingApiKey() {
  const html = `
    <div class="event-item">
      <strong>API Key não configurada</strong>
      <div>Edite o arquivo <code>app.js</code> e coloque sua chave do UptimeRobot.</div>
    </div>
  `;

  document.getElementById("siteList").innerHTML = html;
  document.getElementById("monitorTable").innerHTML = `
    <tr><td colspan="5">Configure a API Key do UptimeRobot para ver dados reais.</td></tr>
  `;
}

function renderApiError(message) {
  document.getElementById("siteList").innerHTML = `
    <div class="event-item">
      <strong>Falha</strong>
      <div>${message}</div>
    </div>
  `;
  document.getElementById("monitorTable").innerHTML = `
    <tr><td colspan="5">${message}</td></tr>
  `;
}

function renderUptimeData(monitors) {
  const online = monitors.filter(m => m.status === 2).length;
  const offline = monitors.length - online;

  const responseTimes = monitors
    .map(m => Number(m.average_response_time || 0))
    .filter(n => n > 0);

  const uptimeRatios = monitors
    .map(m => Number(m.all_time_uptime_ratio || 0))
    .filter(n => !Number.isNaN(n));

  document.getElementById("onlineCount").textContent = online;
  document.getElementById("offlineCount").textContent = offline;
  document.getElementById("avgResponse").textContent = responseTimes.length ? `${Math.round(avg(responseTimes))}ms` : "—";
  document.getElementById("avgUptime").textContent = uptimeRatios.length ? `${avg(uptimeRatios).toFixed(2)}%` : "—";

  document.getElementById("siteList").innerHTML = monitors.map(m => {
    const status = getStatusInfo(m.status);
    return `
      <div class="site-item">
        <div class="site-item-top">
          <strong>${m.friendly_name}</strong>
          <span class="status ${status.className}">${status.text}</span>
        </div>
        <div class="site-meta">
          <span class="chip">⚡ ${m.average_response_time ? `${m.average_response_time}ms` : "—"}</span>
          <span class="chip">🕒 ${m.all_time_uptime_ratio ? `${m.all_time_uptime_ratio}%` : "—"}</span>
          <span class="chip">🔗 ${m.url || "—"}</span>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("monitorTable").innerHTML = monitors.map(m => {
    const status = getStatusInfo(m.status);
    return `
      <tr>
        <td>${m.friendly_name}</td>
        <td><span class="status ${status.className}">${status.text}</span></td>
        <td>${m.type === 1 ? "HTTP(s)" : m.type}</td>
        <td>${m.average_response_time ? `${m.average_response_time}ms` : "—"}</td>
        <td>${m.all_time_uptime_ratio ? `${m.all_time_uptime_ratio}%` : "—"}</td>
      </tr>
    `;
  }).join("");
}

// ===== Segurança real =====
// Observação: dependendo do plano/limite/CORS da API usada, pode ser necessário proxy/serverless.
async function loadSecurityData() {
  const container = document.getElementById("securityList");
  container.innerHTML = "";

  for (const domain of SECURITY_DOMAINS) {
    const card = document.createElement("div");
    card.className = "site-item";
    card.innerHTML = `
      <div class="site-item-top">
        <strong>${domain}</strong>
        <span class="chip">Carregando...</span>
      </div>
    `;
    container.appendChild(card);

    try {
      const response = await fetch(`https://api.securityheaders.com/?q=${encodeURIComponent(domain)}&followRedirects=on`);
      const data = await response.json();

      const grade = data.grade || "—";
      const https = data.headers && data.headers["strict-transport-security"] ? "Ativo" : "Não detectado";

      card.innerHTML = `
        <div class="site-item-top">
          <strong>${domain}</strong>
          <span class="chip">Nota ${grade}</span>
        </div>
        <div class="site-meta">
          <span class="chip">SSL/HSTS: ${https}</span>
          <span class="chip">Referrer-Policy: ${data.headers?.["referrer-policy"] ? "OK" : "Ausente"}</span>
          <span class="chip">CSP: ${data.headers?.["content-security-policy"] ? "OK" : "Ausente"}</span>
        </div>
      `;
    } catch (error) {
      card.innerHTML = `
        <div class="site-item-top">
          <strong>${domain}</strong>
          <span class="chip">Falha</span>
        </div>
        <div class="site-meta">
          <span class="chip">Essa checagem pode precisar de proxy/backend.</span>
        </div>
      `;
    }
  }
}

// ===== Init =====
refreshBtn.addEventListener("click", async () => {
  await loadUptimeRobotData();
  await loadSecurityData();
});

window.addEventListener("load", async () => {
  startClock();
  await loadUptimeRobotData();
  await loadSecurityData();
});