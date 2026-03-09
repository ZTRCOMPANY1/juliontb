/* =========================
   CONFIGURAÇÃO PRINCIPAL
========================= */

// COLOQUE AQUI A DATA DO NAMORO
// formato: ANO-MES-DIA
var DATA_NAMORO = "2024-06-12";

/* =========================
   DADOS DO SITE
========================= */

var fotos = [
  {
    id: 1,
    tipo: "foto",
    titulo: "O começo de tudo",
    data: "2024-06-12",
    descricao: "Esse foi um dos momentos mais especiais, porque marcou o início da nossa história. Um dia simples, mas que mudou tudo para nós.",
    imagem: "assets/fotos/foto1.jpg"
  },
  {
    id: 2,
    tipo: "foto",
    titulo: "Nosso primeiro passeio",
    data: "2024-06-20",
    descricao: "Cada detalhe desse dia ficou guardado no coração. Foi um daqueles momentos em que a felicidade parecia caber inteira dentro de uma foto.",
    imagem: "assets/fotos/foto2.jpg"
  },
  {
    id: 3,
    tipo: "foto",
    titulo: "Sorrisos que ficaram",
    data: "2024-07-05",
    descricao: "Essa foto representa a leveza que existe quando estamos juntos. Um momento que sempre vai trazer lembranças boas.",
    imagem: "assets/fotos/foto3.jpg"
  },
  {
    id: 4,
    tipo: "foto",
    titulo: "Mais um capítulo lindo",
    data: "2024-08-10",
    descricao: "Aqui já dava para ver o quanto nossa história estava crescendo e ficando cada vez mais especial.",
    imagem: "assets/fotos/foto4.jpg"
  },
  {
    id: 5,
    tipo: "foto",
    titulo: "Memória inesquecível",
    data: "2024-09-02",
    descricao: "Uma imagem que guarda sentimento, carinho e tudo que a gente construiu até aqui.",
    imagem: "assets/fotos/foto5.jpg"
  }
];

var videos = [
  {
    id: 1,
    tipo: "video",
    titulo: "Nosso vídeo especial",
    data: "2024-09-15",
    descricao: "Um vídeo para reviver um momento marcante da nossa história. Toda vez que assistimos, parece que sentimos tudo de novo.",
    video: "assets/videos/video1.mp4",
    thumb: "assets/thumbs/video1.jpg"
  },
  {
    id: 2,
    tipo: "video",
    titulo: "Um dia para lembrar",
    data: "2024-10-01",
    descricao: "Esse vídeo guarda um instante único. Uma lembrança viva do quanto nossa caminhada é bonita.",
    video: "assets/videos/video2.mp4",
    thumb: "assets/thumbs/video2.jpg"
  }
];

var todosOsItens = fotos.concat(videos);

/* =========================
   FUNÇÕES GERAIS
========================= */

function estaLogado() {
  return localStorage.getItem("loveflixAuth") === "true";
}

function protegerPaginas() {
  var paginaAtual = window.location.pathname.split("/").pop();

  if (paginaAtual === "" || paginaAtual === "/") {
    paginaAtual = "login.html";
  }

  var paginasProtegidas = ["index.html", "historia.html", "detalhe.html", "video.html"];

  if (paginasProtegidas.indexOf(paginaAtual) !== -1 && !estaLogado()) {
    window.location.href = "login.html";
  }

  if (paginaAtual === "login.html" && estaLogado()) {
    window.location.href = "index.html";
  }
}

function configurarLogout() {
  var logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("loveflixAuth");
      window.location.href = "login.html";
    });
  }
}

function formatarData(dataString) {
  var partes = dataString.split("-");
  if (partes.length !== 3) return dataString;

  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function getParam(nome) {
  var params = new URLSearchParams(window.location.search);
  return params.get(nome);
}

/* =========================
   LOGIN
========================= */

function iniciarLogin() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var dateInput = document.getElementById("dateInput");
    var loginError = document.getElementById("loginError");
    var valor = dateInput.value;

    if (valor === DATA_NAMORO) {
      localStorage.setItem("loveflixAuth", "true");
      window.location.href = "index.html";
    } else {
      loginError.textContent = "Data incorreta. Tente novamente.";
    }
  });
}

/* =========================
   CARDS
========================= */

function criarCardFoto(item) {
  return (
    '<a class="card-item" href="detalhe.html?id=' + item.id + '">' +
      '<div class="card-thumb">' +
        '<img src="' + item.imagem + '" alt="' + item.titulo + '">' +
      '</div>' +
      '<div class="card-info">' +
        '<div class="card-title">' + item.titulo + '</div>' +
        '<div class="card-date">' + formatarData(item.data) + '</div>' +
      '</div>' +
    '</a>'
  );
}

function criarCardVideo(item) {
  return (
    '<a class="card-item" href="video.html?id=' + item.id + '">' +
      '<div class="card-thumb video-thumb">' +
        '<img src="' + item.thumb + '" alt="' + item.titulo + '">' +
        '<div class="play-badge">▶</div>' +
      '</div>' +
      '<div class="card-info">' +
        '<div class="card-title">' + item.titulo + '</div>' +
        '<div class="card-date">' + formatarData(item.data) + '</div>' +
      '</div>' +
    '</a>'
  );
}

function renderHomeRow() {
  var homeRow = document.getElementById("homeRow");
  if (!homeRow) return;

  var html = "";
  for (var i = 0; i < todosOsItens.length; i++) {
    var item = todosOsItens[i];
    html += item.tipo === "foto" ? criarCardFoto(item) : criarCardVideo(item);
  }

  homeRow.innerHTML = html;
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
}

/* =========================
   DETALHE FOTO
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
        '<p>Esse capítulo não existe ou foi removido.</p>' +
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
        '<span class="detail-label">Foto especial</span>' +
        '<h1>' + item.titulo + '</h1>' +
        '<div class="detail-date">Data: ' + formatarData(item.data) + '</div>' +
        '<div class="detail-description">' + item.descricao + '</div>' +
        '<a class="back-link" href="historia.html">← Voltar para nossa história</a>' +
      '</div>' +
    '</div>';
}

/* =========================
   DETALHE VÍDEO
========================= */

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
        '<p>Esse capítulo não existe ou foi removido.</p>' +
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
        '<span class="detail-label">Vídeo especial</span>' +
        '<h1>' + item.titulo + '</h1>' +
        '<div class="detail-date">Data: ' + formatarData(item.data) + '</div>' +
        '<div class="detail-description">' + item.descricao + '</div>' +
        '<a class="back-link" href="historia.html">← Voltar para nossa história</a>' +
      '</div>' +
    '</div>';
}

/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener("DOMContentLoaded", function () {
  protegerPaginas();
  iniciarLogin();
  configurarLogout();
  renderHomeRow();
  renderHistoriaRows();
  renderDetalheFoto();
  renderDetalheVideo();
});