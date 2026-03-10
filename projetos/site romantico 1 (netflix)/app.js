var DATA_NAMORO = "2026-01-10";

var fotos = [
  {
    id: 1,
    tipo: "foto",
    titulo: "O começo de tudo",
    data: "2025-10-06",
    descricao: "Esse foi o dia em que te conheci no salão de festa. E o começo da nossa história.",
    imagem: "assets/thumbs/comeco2.jpg",
    preview: "",
    temporada: "Temporada 1"
  },
  {
    id: 2,
    tipo: "foto",
    titulo: "Nosso primeiro passeio",
    data: "2025-02-09",
    descricao: "O primeiro dia em que te limpei, o dia mais fofo que eu tive. E isso vai acontecer a cada 1 Mês",
    imagem: "assets/fotos/2.jpg",
    preview: "assets/videos/trailer2.mp4",
    temporada: "Temporada 1"
  },
  {
    id: 3,
    tipo: "foto",
    titulo: "Sorrisos juntos",
    data: "2025-02-09",
    descricao: "Essa foto guarda uma energia linda e um momento muito especial.",
    imagem: "assets/thumbs/12.jpg",
    preview: "",
    temporada: "Temporada 1"
  },
  {
    id: 4,
    tipo: "foto",
    titulo: "Mais um capítulo lindo",
    data: "2025-03-11",
    descricao: "Aqui começa mais 1 capitulo Maravilhoso.",
    imagem: "assets/fotos/foto3.jpg",
    preview: "assets/videos/trailer1.mp4",
    temporada: "Temporada 2 (Em Breve)"
  },
  {
    id: 5,
    tipo: "foto",
    titulo: "Uma memória eterna",
    data: "2025-12-12",
    descricao: "O dia em que peguei as 1000 noites no 99 noites, Um dia muito especial pra mim.",
    imagem: "assets/thumbs/5.jpg",
    preview: "",
    temporada: "Temporada 1"
  }
];

var videos = [
  {
    id: 1,
    tipo: "video",
    titulo: "Nosso vídeo especial",
    data: "2026-01-03",
    descricao: "O primeiro video que você fez e me mandou, fiquei feliz de mais moxinho.",
    video: "assets/videos/7.mp4",
    thumb: "assets/fotos/2.jpg",
    temporada: "Temporada 1"
  },
  {
    id: 2,
    tipo: "video",
    titulo: "Um dia inesquecível",
    data: "2026-01-09",
    descricao: "Esse vídeo guarda um instante único.",
    video: "assets/videos/6.mp4",
    thumb: "assets/thumbs/9.jpg",
    temporada: "Temporada 1"
  }
];

var temporadas = [
  {
    nome: "Temporada 1",
    subtitulo: "O início",
    descricao: "Os primeiros capítulos e momentos disponíveis agora."
  },
  {
    nome: "Temporada 2",
    subtitulo: "Conexão",
    descricao: "Novos capítulos estão chegando."
  }
];

var todosOsItens = fotos.concat(videos);

var heroSlides = [
  {
    titulo: "Nossa História",
    kicker: "Série romântica exclusiva Eternamente",
    descricao: "Uma coleção dos nossos melhores capítulos, memórias, fotos e vídeos.",
    imagem: "assets/fotos/foto6.jpg"
  }
];

/* GERAL */
function estaLogado() {
  return localStorage.getItem("loveflixAuth") === "true";
}

function formatarData(data) {
  var p = data.split("-");
  if (p.length !== 3) return data;
  return p[2] + "/" + p[1] + "/" + p[0];
}

function getParam(nome) {
  var params = new URLSearchParams(window.location.search);
  return params.get(nome);
}

function textoCurto(texto, max) {
  if (!texto) return "";
  if (texto.length <= max) return texto;
  return texto.slice(0, max) + "...";
}

function protegerPaginas() {
  var paginaAtual = window.location.pathname.split("/").pop();
  if (!paginaAtual) paginaAtual = "login.html";

  var protegidas = ["profiles.html", "index.html", "historia.html", "detalhe.html", "video.html"];

  if (protegidas.indexOf(paginaAtual) !== -1 && !estaLogado()) {
    window.location.href = "login.html";
    return;
  }

  if (paginaAtual === "login.html" && estaLogado()) {
    window.location.href = "profiles.html";
    return;
  }
}

/* LOGIN */
function iniciarLogin() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var valor = document.getElementById("dateInput").value;
    var erro = document.getElementById("loginError");

    if (valor === DATA_NAMORO) {
      localStorage.setItem("loveflixAuth", "true");
      window.location.href = "profiles.html";
    } else {
      erro.textContent = "Data incorreta. Tente novamente.";
    }
  });
}

/* PERFIS */
function iniciarPerfis() {
  var cards = document.querySelectorAll(".profile-card");
  if (!cards.length) return;

  cards.forEach(function(card) {
    card.addEventListener("click", function() {
      var perfil = card.getAttribute("data-profile");
      localStorage.setItem("loveflixProfile", perfil);
      window.location.href = "index.html";
    });
  });
}

/* LOADING + INTRO */
function iniciarLoadingEIntro() {
  var loading = document.getElementById("loadingScreen");
  var intro = document.getElementById("introScreen");
  var enterBtn = document.getElementById("enterSiteBtn");

  if (!loading) return;

  setTimeout(function () {
    loading.classList.add("hide");

    if (intro) {
      intro.classList.add("show");
    }
  }, 1800);

  if (enterBtn && intro) {
    enterBtn.addEventListener("click", function () {
      tocarClick();
      intro.style.display = "none";
    });
  }
}

/* PARTÍCULAS */
function criarParticulas() {
  var container = document.getElementById("particles");
  if (!container) return;

  for (var i = 0; i < 26; i++) {
    var p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.width = 4 + Math.random() * 8 + "px";
    p.style.height = p.style.width;
    p.style.animationDuration = 7 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    container.appendChild(p);
  }
}

/* CLICK SOUND */
function tocarClick() {
  var sound = document.getElementById("clickSound");
  if (!sound) return;

  sound.currentTime = 0;
  sound.play().catch(function(){});
}

function iniciarSomCliques() {
  var itens = document.querySelectorAll("button, a");

  itens.forEach(function(item) {
    item.addEventListener("click", function() {
      tocarClick();
    });
  });
}

/* LOGOUT */
function configurarLogout() {
  var btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    localStorage.removeItem("loveflixAuth");
    localStorage.removeItem("loveflixProfile");
    window.location.href = "login.html";
  });
}

/* MÚSICA */
function iniciarMusica() {
  var audio = document.getElementById("bgMusic");
  var btn = document.getElementById("musicToggle");
  if (!audio || !btn) return;

  var tocando = localStorage.getItem("loveflixMusic") === "on";

  function atualizarBotao() {
    btn.textContent = tocando ? "♫" : "♪";
  }

  atualizarBotao();

  if (tocando) {
    audio.volume = 0.35;
    audio.play().catch(function () {});
  }

  btn.addEventListener("click", function () {
    tocando = !tocando;
    localStorage.setItem("loveflixMusic", tocando ? "on" : "off");
    atualizarBotao();

    if (tocando) {
      audio.volume = 0.35;
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  });
}

/* CONTADOR */
function atualizarContador() {
  var el = document.getElementById("relationshipCounter");
  if (!el) return;

  var inicio = new Date(DATA_NAMORO + "T00:00:00");

  function render() {
    var agora = new Date();
    var diff = agora - inicio;

    if (diff < 0) {
      el.textContent = "Ainda não começou";
      return;
    }

    var segundos = Math.floor(diff / 1000);
    var minutos = Math.floor(segundos / 60);
    var horas = Math.floor(minutos / 60);
    var diasTotal = Math.floor(horas / 24);

    var anos = Math.floor(diasTotal / 365);
    var meses = Math.floor((diasTotal % 365) / 30);
    var dias = Math.floor((diasTotal % 365) % 30);
    var h = horas % 24;
    var m = minutos % 60;
    var s = segundos % 60;

    el.textContent =
      anos + " anos • " +
      meses + " meses • " +
      dias + " dias • " +
      h + " horas • " +
      m + " minutos • " +
      s + " segundos";
  }

  render();
  setInterval(render, 1000);
}

/* SURPRESA */
function iniciarSurpresa() {
  var btn = document.getElementById("surpriseBtn");
  var modal = document.getElementById("surpriseModal");
  var close = document.getElementById("closeSurprise");

  if (!btn || !modal || !close) return;

  btn.addEventListener("click", function () {
    modal.classList.add("open");
  });

  close.addEventListener("click", function () {
    modal.classList.remove("open");
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });
}

/* HERO AUTOMÁTICO */
function iniciarHeroSlider() {
  var hero = document.getElementById("heroBanner");
  var title = document.getElementById("heroTitle");
  var kicker = document.getElementById("heroKicker");
  var desc = document.getElementById("heroDescription");

  if (!hero || !title || !kicker || !desc) return;

  var index = 0;

  function renderSlide() {
    var slide = heroSlides[index];
    hero.style.backgroundImage =
      'linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.45) 45%, rgba(8,8,8,0.2) 100%), url("' + slide.imagem + '")';
    title.textContent = slide.titulo;
    kicker.textContent = slide.kicker;
    desc.textContent = slide.descricao;
  }

  renderSlide();

  setInterval(function () {
    index = (index + 1) % heroSlides.length;
    renderSlide();
  }, 5000);
}

/* TEMPORADAS */
function renderTemporadasHome() {
  var grid = document.getElementById("seasonGrid");
  if (!grid) return;

  var html = "";
  for (var i = 0; i < temporadas.length; i++) {
    html +=
      '<div class="season-card">' +
        '<span>' + temporadas[i].nome + '</span>' +
        '<h3>' + temporadas[i].subtitulo + '</h3>' +
        '<p>' + temporadas[i].descricao + '</p>' +
      '</div>';
  }

  grid.innerHTML = html;
}

function renderSeletorTemporadas() {
  var grid = document.getElementById("seasonSelection");
  if (!grid) return;

  var html = "";
  for (var i = 0; i < temporadas.length; i++) {
    html +=
      '<div class="season-card season-option ' + (i === 0 ? 'active' : '') + '" data-season="' + temporadas[i].nome + '">' +
        '<span>' + temporadas[i].nome + '</span>' +
        '<h3>' + temporadas[i].subtitulo + '</h3>' +
        '<p>' + temporadas[i].descricao + '</p>' +
      '</div>';
  }

  grid.innerHTML = html;

  var options = document.querySelectorAll(".season-option");
  options.forEach(function(option) {
    option.addEventListener("click", function() {
      tocarClick();

      options.forEach(function(o) {
        o.classList.remove("active");
      });

      option.classList.add("active");
      selecionarTemporada(option.getAttribute("data-season"));
    });
  });

  selecionarTemporada("Temporada 1");
}

function selecionarTemporada(nomeTemporada) {
  var seasonRow = document.getElementById("seasonRow");
  var seasonTitle = document.getElementById("seasonTitle");
  var seasonContentSection = document.getElementById("seasonContentSection");
  var comingSoonSection = document.getElementById("comingSoonSection");

  if (!seasonRow || !seasonTitle || !seasonContentSection || !comingSoonSection) return;

  seasonTitle.textContent = nomeTemporada;

  if (nomeTemporada !== "Temporada 1") {
    seasonContentSection.classList.add("hidden");
    comingSoonSection.classList.remove("hidden");
    return;
  }

  seasonContentSection.classList.remove("hidden");
  comingSoonSection.classList.add("hidden");

  var itens = todosOsItens.filter(function(item) {
    return item.temporada === nomeTemporada;
  });

  var html = "";
  for (var i = 0; i < itens.length; i++) {
    html += itens[i].tipo === "foto" ? criarCardFoto(itens[i]) : criarCardVideo(itens[i]);
  }

  seasonRow.innerHTML = html;
  iniciarPreviewHover();
  iniciarSomCliques();
}

/* SETAS */
function iniciarSetasFileira() {
  var buttons = document.querySelectorAll(".arrow-btn");

  buttons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      tocarClick();

      var targetId = btn.getAttribute("data-target");
      var direction = btn.getAttribute("data-direction");
      var row = document.getElementById(targetId);

      if (!row) return;

      row.scrollBy({
        left: direction === "left" ? -600 : 600,
        behavior: "smooth"
      });
    });
  });
}

/* CARDS */
function criarCardFoto(item) {
  return (
    '<a class="netflix-card click-sound" href="detalhe.html?id=' + item.id + '">' +
      '<div class="netflix-card-inner">' +
        '<div class="card-media">' +
          '<img class="preview-image-hidden" src="' + item.imagem + '" alt="' + item.titulo + '">' +
          '<video class="preview-video" muted loop playsinline preload="metadata">' +
            '<source src="' + item.preview + '" type="video/mp4">' +
          '</video>' +
          '<div class="card-gradient"></div>' +
        '</div>' +
        '<div class="card-bottom">' +
          '<div class="card-meta">' +
            '<span class="card-pill">Foto</span>' +
            '<span>' + item.temporada + '</span>' +
            '<span>' + formatarData(item.data) + '</span>' +
          '</div>' +
          '<div class="card-title">' + item.titulo + '</div>' +
          '<div class="card-desc">' + textoCurto(item.descricao, 90) + '</div>' +
          '<div class="card-expand-panel">' +
            '<div class="expand-actions">' +
              '<div class="expand-icon">❤</div>' +
              '<div class="expand-icon">▶</div>' +
              '<div class="expand-icon">+</div>' +
            '</div>' +
            '<div class="expand-extra">Clique para abrir esse capítulo da nossa história.</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

function criarCardVideo(item) {
  return (
    '<a class="netflix-card click-sound" href="video.html?id=' + item.id + '">' +
      '<div class="netflix-card-inner">' +
        '<div class="card-media">' +
          '<img class="preview-image-hidden" src="' + item.thumb + '" alt="' + item.titulo + '">' +
          '<video class="preview-video" muted loop playsinline preload="metadata">' +
            '<source src="' + item.video + '" type="video/mp4">' +
          '</video>' +
          '<div class="card-gradient"></div>' +
          '<div class="card-play-icon">▶</div>' +
        '</div>' +
        '<div class="card-bottom">' +
          '<div class="card-meta">' +
            '<span class="card-pill">Vídeo</span>' +
            '<span>' + item.temporada + '</span>' +
            '<span>' + formatarData(item.data) + '</span>' +
          '</div>' +
          '<div class="card-title">' + item.titulo + '</div>' +
          '<div class="card-desc">' + textoCurto(item.descricao, 90) + '</div>' +
          '<div class="card-expand-panel">' +
            '<div class="expand-actions">' +
              '<div class="expand-icon">❤</div>' +
              '<div class="expand-icon">▶</div>' +
              '<div class="expand-icon">+</div>' +
            '</div>' +
            '<div class="expand-extra">Passe o mouse para preview e clique para assistir.</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

function renderHomeRow() {
  var row = document.getElementById("homeRow");
  if (!row) return;

  var html = "";
  for (var i = 0; i < todosOsItens.length; i++) {
    html += todosOsItens[i].tipo === "foto"
      ? criarCardFoto(todosOsItens[i])
      : criarCardVideo(todosOsItens[i]);
  }

  row.innerHTML = html;
  iniciarPreviewHover();
}

/* PREVIEW */
function iniciarPreviewHover() {
  var cards = document.querySelectorAll(".netflix-card");

  cards.forEach(function(card) {
    var video = card.querySelector(".preview-video");
    if (!video) return;

    card.addEventListener("mouseenter", function() {
      video.currentTime = 0;
      video.play().catch(function(){});
    });

    card.addEventListener("mouseleave", function() {
      video.pause();
      video.currentTime = 0;
    });
  });
}

/* DETALHES */
function renderDetalheFoto() {
  var container = document.getElementById("detailContainer");
  if (!container) return;

  var id = Number(getParam("id"));
  var item = null;

  for (var i = 0; i < fotos.length; i++) {
    if (fotos[i].id === id) {
      item = fotos[i];
      break;
    }
  }

  if (!item) {
    container.innerHTML =
      '<div class="not-found">' +
        '<h2>Foto não encontrada</h2>' +
        '<a class="back-link" href="historia.html">Voltar</a>' +
      '</div>';
    return;
  }

  container.innerHTML =
    '<div class="detail-layout">' +
      '<div class="detail-media">' +
        '<img src="' + item.imagem + '" alt="' + item.titulo + '">' +
      '</div>' +
      '<div class="detail-info">' +
        '<span class="detail-badge">Foto especial</span>' +
        '<h1>' + item.titulo + '</h1>' +
        '<div class="detail-date">Data: ' + formatarData(item.data) + '</div>' +
        '<div class="detail-description">' + item.descricao + '</div>' +
        '<a class="back-link" href="historia.html">← Voltar para nossa história</a>' +
      '</div>' +
    '</div>';
}

function renderDetalheVideo() {
  var container = document.getElementById("videoContainer");
  if (!container) return;

  var id = Number(getParam("id"));
  var item = null;

  for (var i = 0; i < videos.length; i++) {
    if (videos[i].id === id) {
      item = videos[i];
      break;
    }
  }

  if (!item) {
    container.innerHTML =
      '<div class="not-found">' +
        '<h2>Vídeo não encontrado</h2>' +
        '<a class="back-link" href="historia.html">Voltar</a>' +
      '</div>';
    return;
  }

  container.innerHTML =
    '<div class="detail-layout">' +
      '<div class="detail-media">' +
        '<video controls playsinline>' +
          '<source src="' + item.video + '" type="video/mp4">' +
          'Seu navegador não suporta vídeo.' +
        '</video>' +
      '</div>' +
      '<div class="detail-info">' +
        '<span class="detail-badge">Vídeo especial</span>' +
        '<h1>' + item.titulo + '</h1>' +
        '<div class="detail-date">Data: ' + formatarData(item.data) + '</div>' +
        '<div class="detail-description">' + item.descricao + '</div>' +
        '<a class="back-link" href="historia.html">← Voltar para nossa história</a>' +
      '</div>' +
    '</div>';
}

/* START */
document.addEventListener("DOMContentLoaded", function() {
  protegerPaginas();
  iniciarLogin();
  iniciarPerfis();
  iniciarLoadingEIntro();
  criarParticulas();
  configurarLogout();
  iniciarMusica();
  atualizarContador();
  iniciarSurpresa();
  iniciarHeroSlider();
  renderTemporadasHome();
  renderSeletorTemporadas();
  renderHomeRow();
  iniciarSetasFileira();
  renderDetalheFoto();
  renderDetalheVideo();

  setTimeout(function() {
    iniciarSomCliques();
  }, 300);
});