/* =========================
   CONFIG
========================= */

var DATA_NAMORO = "2024-06-12";

/* =========================
   DADOS
========================= */

var fotos = [
  {
    id: 1,
    tipo: "foto",
    titulo: "O começo de tudo",
    data: "2024-06-12",
    descricao: "Esse foi o capítulo onde tudo começou. Um momento que marcou para sempre a nossa história.",
    imagem: "assets/fotos/foto1.jpg",
    preview: "assets/videos/trailer1.mp4",
    temporada: "Temporada 1"
  },
  {
    id: 2,
    tipo: "foto",
    titulo: "Nosso primeiro passeio",
    data: "2024-06-20",
    descricao: "Um daqueles dias que parecem simples, mas viram lembranças gigantes no coração.",
    imagem: "assets/fotos/foto2.jpg",
    preview: "assets/videos/trailer2.mp4",
    temporada: "Temporada 1"
  },
  {
    id: 3,
    tipo: "foto",
    titulo: "Sorrisos juntos",
    data: "2024-07-05",
    descricao: "Essa foto guarda uma energia linda. Ela sempre vai lembrar a felicidade que a gente sentiu.",
    imagem: "assets/fotos/foto3.jpg",
    preview: "assets/videos/trailer1.mp4",
    temporada: "Temporada 2"
  },
  {
    id: 4,
    tipo: "foto",
    titulo: "Momento especial",
    data: "2024-08-10",
    descricao: "Cada fase da nossa história teve sua beleza, e essa foto representa muito bem uma delas.",
    imagem: "assets/fotos/foto4.jpg",
    preview: "assets/videos/trailer2.mp4",
    temporada: "Temporada 2"
  },
  {
    id: 5,
    tipo: "foto",
    titulo: "Uma memória eterna",
    data: "2024-09-02",
    descricao: "Tem fotos que não são só imagens. Elas viram abrigo de sentimento.",
    imagem: "assets/fotos/foto5.jpg",
    preview: "assets/videos/trailer1.mp4",
    temporada: "Temporada 3"
  }
];

var videos = [
  {
    id: 1,
    tipo: "video",
    titulo: "Nosso vídeo especial",
    data: "2024-09-15",
    descricao: "Um vídeo para reviver sentimentos, olhares e um momento muito especial da nossa caminhada.",
    video: "assets/videos/video1.mp4",
    thumb: "assets/thumbs/video1.jpg",
    temporada: "Temporada 3"
  },
  {
    id: 2,
    tipo: "video",
    titulo: "Um dia inesquecível",
    data: "2024-10-01",
    descricao: "Esse vídeo guarda um instante único. Toda vez que ele toca, parece que a gente volta no tempo.",
    video: "assets/videos/video2.mp4",
    thumb: "assets/thumbs/video2.jpg",
    temporada: "Temporada 4"
  }
];

var temporadas = [
  {
    nome: "Temporada 1",
    subtitulo: "O início",
    descricao: "Os primeiros capítulos, as primeiras conversas e os primeiros momentos que mudaram tudo."
  },
  {
    nome: "Temporada 2",
    subtitulo: "Conexão",
    descricao: "A fase em que cada encontro foi ficando mais especial e cada memória mais forte."
  },
  {
    nome: "Temporada 3",
    subtitulo: "Memórias marcantes",
    descricao: "Momentos que já viraram lembranças eternas e que sempre vão ter um espaço no coração."
  },
  {
    nome: "Temporada 4",
    subtitulo: "Nossa continuação",
    descricao: "Porque a nossa série favorita ainda está em andamento, com capítulos cada vez mais lindos."
  }
];

var todosOsItens = fotos.concat(videos);

/* =========================
   GERAL
========================= */

function estaLogado() {
  return localStorage.getItem("loveflixAuth") === "true";
}

function protegerPaginas() {
  var paginaAtual = window.location.pathname.split("/").pop();

  if (!paginaAtual) {
    paginaAtual = "login.html";
  }

  var protegidas = ["profiles.html", "index.html", "historia.html", "detalhe.html", "video.html"];

  if (protegidas.indexOf(paginaAtual) !== -1 && !estaLogado()) {
    window.location.href = "login.html";
  }

  if (paginaAtual === "login.html" && estaLogado()) {
    window.location.href = "profiles.html";
  }
}

function configurarLogout() {
  var btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    localStorage.removeItem("loveflixAuth");
    localStorage.removeItem("loveflixProfile");
    window.location.href = "login.html";
  });
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
  if (texto.length <= max) return texto;
  return texto.slice(0, max) + "...";
}

/* =========================
   LOGIN
========================= */

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

/* =========================
   PERFIS
========================= */

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

/* =========================
   MÚSICA
========================= */

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
    audio.play().catch(function() {});
  }

  btn.addEventListener("click", function () {
    tocando = !tocando;
    localStorage.setItem("loveflixMusic", tocando ? "on" : "off");
    atualizarBotao();

    if (tocando) {
      audio.volume = 0.35;
      audio.play().catch(function() {});
    } else {
      audio.pause();
    }
  });
}

/* =========================
   CONTADOR
========================= */

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

/* =========================
   SURPRESA
========================= */

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

/* =========================
   TEMPORADAS
========================= */

function renderTemporadas() {
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

/* =========================
   CARDS ESTILO NETFLIX
========================= */

function criarCardFoto(item) {
  return (
    '<a class="netflix-card" href="detalhe.html?id=' + item.id + '">' +
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
            '<span>' + formatarData(item.data) + '</span>' +
          '</div>' +
          '<div class="card-title">' + item.titulo + '</div>' +
          '<div class="card-desc">' + textoCurto(item.descricao, 90) + '</div>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

function criarCardVideo(item) {
  return (
    '<a class="netflix-card" href="video.html?id=' + item.id + '">' +
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
            '<span>' + formatarData(item.data) + '</span>' +
          '</div>' +
          '<div class="card-title">' + item.titulo + '</div>' +
          '<div class="card-desc">' + textoCurto(item.descricao, 90) + '</div>' +
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

function renderHistoriaRows() {
  var photoRow = document.getElementById("photoRow");
  var videoRow = document.getElementById("videoRow");

  if (photoRow) {
    var htmlFotos = "";
    for (var i = 0; i < fotos.length; i++) {
      htmlFotos += criarCardFoto(fotos[i]);
    }
    photoRow.innerHTML = htmlFotos;
  }

  if (videoRow) {
    var htmlVideos = "";
    for (var j = 0; j < videos.length; j++) {
      htmlVideos += criarCardVideo(videos[j]);
    }
    videoRow.innerHTML = htmlVideos;
  }

  iniciarPreviewHover();
}

function iniciarPreviewHover() {
  var cards = document.querySelectorAll(".netflix-card");

  cards.forEach(function(card) {
    var video = card.querySelector(".preview-video");

    if (!video) return;

    card.addEventListener("mouseenter", function() {
      video.currentTime = 0;
      video.play().catch(function() {});
    });

    card.addEventListener("mouseleave", function() {
      video.pause();
      video.currentTime = 0;
    });
  });
}

/* =========================
   DETALHES
========================= */

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

/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function() {
  protegerPaginas();
  iniciarLogin();
  iniciarPerfis();
  configurarLogout();
  iniciarMusica();
  atualizarContador();
  iniciarSurpresa();
  renderTemporadas();
  renderHomeRow();
  renderHistoriaRows();
  renderDetalheFoto();
  renderDetalheVideo();
});