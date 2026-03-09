function createPhotoCard(item) {
  return `
    <a class="card" href="detalhe.html?id=${item.id}">
      <div class="card-media">
        <span class="card-tag">Foto</span>
        <img src="${item.image}" alt="${item.title}">
        <div class="card-gradient"></div>
        <div class="card-content">
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        </div>
      </div>
    </a>
  `;
}

function createVideoCard(item) {
  return `
    <a class="card" href="video.html?id=${item.id}">
      <div class="card-media">
        <span class="card-tag">Vídeo</span>
        <img src="${item.image}" alt="${item.title}">
        <div class="card-gradient"></div>
        <div class="card-content">
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        </div>
      </div>
    </a>
  `;
}

function renderHome() {
  const carouselMomentos = document.getElementById("carouselMomentos");
  const carouselVideos = document.getElementById("carouselVideos");
  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");

  if (heroTitle && storyItems.length > 0) {
    heroTitle.textContent = storyItems[0].title;
    heroDescription.textContent = storyItems[0].description;
  }

  if (carouselMomentos) {
    carouselMomentos.innerHTML = storyItems.map(createPhotoCard).join("");
  }

  if (carouselVideos) {
    carouselVideos.innerHTML = videoItems.map(createVideoCard).join("");
  }
}

function renderHistoryPage() {
  const historyGrid = document.getElementById("historyGrid");
  if (!historyGrid) return;

  const allItems = [...storyItems, ...videoItems].sort((a, b) => a.id - b.id);

  historyGrid.innerHTML = allItems.map(item => {
    const link = item.type === "video"
      ? `video.html?id=${item.id}`
      : `detalhe.html?id=${item.id}`;

    const tag = item.type === "video" ? "Vídeo" : "Foto";

    return `
      <a class="history-card" href="${link}">
        <img src="${item.image}" alt="${item.title}">
        <div class="history-card-body">
          <span class="date">${tag} • ${item.date}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </a>
    `;
  }).join("");
}

function renderDetailPage() {
  const container = document.getElementById("detailContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const item = storyItems.find(entry => entry.id === id);

  if (!item) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Momento não encontrado</h2>
        <p>Esse conteúdo não existe ou foi removido.</p>
        <a href="historia.html" class="back-link">Voltar</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="detail-image-box">
      <img src="${item.image}" alt="${item.title}">
    </div>

    <div class="detail-info">
      <h1>${item.title}</h1>

      <div class="detail-meta">
        <span class="meta-pill">Foto</span>
        <span class="meta-pill">${item.date}</span>
      </div>

      <p class="detail-description">${item.description}</p>

      <a href="historia.html" class="back-link">← Voltar para nossa história</a>
    </div>
  `;
}

function renderVideoPage() {
  const container = document.getElementById("videoDetailContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const item = videoItems.find(entry => entry.id === id);

  if (!item) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Vídeo não encontrado</h2>
        <p>Esse vídeo não existe ou foi removido.</p>
        <a href="historia.html" class="back-link">Voltar</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="video-player-box">
      <video controls poster="${item.image}">
        <source src="${item.video}" type="video/mp4">
        Seu navegador não suporta vídeo.
      </video>
    </div>

    <div class="detail-info">
      <h1>${item.title}</h1>

      <div class="detail-meta">
        <span class="meta-pill">Vídeo</span>
        <span class="meta-pill">${item.date}</span>
      </div>

      <p class="detail-description">${item.description}</p>

      <a href="historia.html" class="back-link">← Voltar para nossa história</a>
    </div>
  `;
}

function setupCarouselButtons() {
  const buttons = document.querySelectorAll(".carousel-btn");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const carousel = document.getElementById(targetId);
      if (!carousel) return;

      const scrollAmount = 820;
      const isLeft = this.classList.contains("left");

      carousel.scrollBy({
        left: isLeft ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderHome();
  renderHistoryPage();
  renderDetailPage();
  renderVideoPage();
  setupCarouselButtons();
});