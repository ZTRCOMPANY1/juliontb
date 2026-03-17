const users = [
  {
    username: 'ztr',
    password: '1234',
    profiles: [
      {
        id: 1,
        name: 'Seu Perfil',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 2,
        name: 'Perfil Dela',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 3,
        name: 'Convidado',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80'
      }
    ]
  }
];

const tracks = [
  {
    id: 1,
    title: 'Nossa Primeira Música',
    musicName: 'Perfect',
    author: 'Ed Sheeran',
    description: 'A música que marca o começo da história. Um som que lembra os primeiros sentimentos, as primeiras conversas e o início de algo muito especial.',
    meaning: 'Essa música representa o encontro certo, a sensação de paz, carinho e o sentimento de que tudo ficou mais bonito depois daquela pessoa.',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    accent: '#1db954'
  },
  {
    id: 2,
    title: 'Noite Especial',
    musicName: 'Until I Found You',
    author: 'Stephen Sanchez',
    description: 'Uma faixa que combina com uma noite inesquecível, cheia de conexão, emoção e memórias que continuam vivas mesmo depois do tempo passar.',
    meaning: 'O significado está em encontrar alguém que muda tudo, alguém que traz calma, paixão e a certeza de que vale a pena sentir intensamente.',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    accent: '#24c95d'
  },
  {
    id: 3,
    title: 'Momento Só Nosso',
    musicName: 'All of Me',
    author: 'John Legend',
    description: 'Perfeita para um momento íntimo e verdadeiro, quando o mundo parece parar e só existe a presença de quem faz o coração bater diferente.',
    meaning: 'Mostra amor completo, aceitação total e a beleza de amar alguém por inteiro, com tudo que ela é.',
    cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    accent: '#2edb68'
  },
  {
    id: 4,
    title: 'Memórias em Foto',
    musicName: 'Photograph',
    author: 'Ed Sheeran',
    description: 'Uma música ideal para representar fotos, lembranças, registros e tudo aquilo que continua vivo na memória mesmo à distância.',
    meaning: 'Fala sobre guardar momentos importantes e revisitar sentimentos através de imagens, recordações e pequenos detalhes.',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    accent: '#38e56f'
  },
  {
    id: 5,
    title: 'Para Sempre',
    musicName: 'A Thousand Years',
    author: 'Christina Perri',
    description: 'Uma escolha romântica e intensa para representar promessas, sentimentos duradouros e aquele tipo de amor que parece atravessar o tempo.',
    meaning: 'Simboliza espera, destino, profundidade emocional e a vontade de continuar junto por muito tempo.',
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    accent: '#19b14e'
  },
  {
    id: 6,
    title: 'Coração Ligado',
    musicName: 'Dandelions',
    author: 'Ruth B.',
    description: 'Delicada, sonhadora e emocional. Uma música que combina com pensamentos sinceros, desejo forte e um amor que cresce cada vez mais.',
    meaning: 'Representa esperança, carinho profundo e a vontade de ver um sentimento virar algo real e duradouro.',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    accent: '#1fd35e'
  }
];

const state = {
  currentUser: null,
  currentProfile: null,
  currentTrack: null,
  currentIndex: 0,
  history: []
};

const loginScreen = document.getElementById('loginScreen');
const profilesScreen = document.getElementById('profilesScreen');
const appScreen = document.getElementById('appScreen');
const profilesGrid = document.getElementById('profilesGrid');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const audioPlayer = document.getElementById('audioPlayer');
const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const currentProfileImg = document.getElementById('currentProfileImg');
const currentProfileName = document.getElementById('currentProfileName');
const togglePlayBtn = document.getElementById('togglePlayBtn');
const progressTrack = document.getElementById('progressTrack');

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function setMainGradient(color) {
  const mainView = document.querySelector('.main-view');
  mainView.style.background = `linear-gradient(180deg, ${hexToRgba(color, 0.48)} 0%, rgba(18,18,18,1) 280px), #121212`;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function showOnly(screen) {
  loginScreen.classList.add('hidden');
  profilesScreen.classList.add('hidden');
  appScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function renderProfiles() {
  profilesGrid.innerHTML = state.currentUser.profiles.map(profile => `
    <div class="profile-card">
      <button class="profile-button" data-profile-id="${profile.id}">
        <div class="profile-avatar">
          <img src="${profile.avatar}" alt="${profile.name}">
        </div>
        <div class="profile-name">${profile.name}</div>
      </button>
    </div>
  `).join('');

  document.querySelectorAll('[data-profile-id]').forEach(button => {
    button.addEventListener('click', () => {
      const profileId = Number(button.dataset.profileId);
      selectProfile(profileId);
    });
  });
}

function selectProfile(profileId) {
  state.currentProfile = state.currentUser.profiles.find(profile => profile.id === profileId) || null;
  if (!state.currentProfile) return;

  currentProfileImg.src = state.currentProfile.avatar;
  currentProfileName.textContent = state.currentProfile.name;
  showOnly(appScreen);
  renderHome();
}

function pushHistory(view) {
  const last = state.history[state.history.length - 1];
  if (last !== view) state.history.push(view);
}

function renderHome() {
  pushHistory('home');
  updateMenuState('home');
  const heroTrack = tracks[0];
  setMainGradient(heroTrack.accent);

  mainContent.innerHTML = `
    <section class="hero-section">
      <div class="hero-card">
        <div class="hero-cover">
          <img src="${heroTrack.cover}" alt="${heroTrack.title}">
        </div>

        <div class="hero-text">
          <p class="eyebrow">playlist personalizada</p>
          <h2 class="hero-title">Nossa playlist</h2>
          <p class="hero-desc">Um site com visual premium inspirado em streaming musical, com capas grandes, cards clicáveis, página própria para cada faixa, player embaixo e espaço para descrição, autor, nome da música e o significado dela na sua história.</p>
          <p class="hero-meta"><strong>${state.currentProfile.name}</strong> • ${tracks.length} faixas especiais • atualização visual premium</p>

          <div class="hero-actions">
            <button class="play-large" data-play-id="${heroTrack.id}">▶ Tocar agora</button>
            <button class="secondary-btn" data-open-id="${heroTrack.id}">Abrir destaque</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>Feitas para vocês</h3>
        <span>Músicas e momentos em destaque</span>
      </div>
      <div class="card-grid">
        ${tracks.map(track => renderTrackCard(track)).join('')}
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>Escute novamente</h3>
        <span>Suas escolhas especiais</span>
      </div>
      <div class="card-grid">
        ${tracks.slice().reverse().map(track => renderTrackCard(track)).join('')}
      </div>
    </section>
  `;

  attachDynamicCardEvents();
}

function renderSearch() {
  pushHistory('search');
  updateMenuState('search');
  setMainGradient('#1db954');

  mainContent.innerHTML = `
    <section class="section-block empty-state">
      <div class="section-head">
        <h3>Buscar músicas</h3>
        <span>Catálogo do seu projeto</span>
      </div>
      <div class="card-grid">
        ${tracks.map(track => renderTrackCard(track)).join('')}
      </div>
    </section>
  `;

  attachDynamicCardEvents();
}

function renderTrackCard(track) {
  return `
    <article class="track-card" data-open-id="${track.id}">
      <div class="track-cover">
        <img src="${track.cover}" alt="${track.title}">
        <button class="track-play" data-play-id="${track.id}">▶</button>
      </div>
      <h4>${track.title}</h4>
      <p>${track.description}</p>
    </article>
  `;
}

function attachDynamicCardEvents() {
  document.querySelectorAll('[data-open-id]').forEach(el => {
    el.addEventListener('click', event => {
      if (event.target.closest('[data-play-id]')) return;
      openTrack(Number(el.dataset.openId));
    });
  });

  document.querySelectorAll('[data-play-id]').forEach(el => {
    el.addEventListener('click', event => {
      event.stopPropagation();
      playTrackById(Number(el.dataset.playId));
    });
  });
}

function openTrack(trackId) {
  const track = tracks.find(item => item.id === trackId);
  if (!track) return;

  pushHistory(`detail-${trackId}`);
  setMainGradient(track.accent || '#1db954');

  mainContent.innerHTML = `
    <section class="detail-layout">
      <div class="detail-header">
        <div class="detail-cover">
          <img src="${track.cover}" alt="${track.title}">
        </div>

        <div class="detail-text">
          <p class="eyebrow">faixa especial</p>
          <h2 class="detail-title">${track.title}</h2>
          <p class="detail-sub">Uma página individual no estilo de streaming premium, com capa em destaque, player integrado e todas as informações da música organizadas de forma bonita e forte visualmente.</p>
          <p class="detail-meta"><strong>${track.author}</strong> • Música: ${track.musicName}</p>

          <div class="detail-actions">
            <button class="play-large" data-play-id="${track.id}">▶ Tocar música</button>
            <button class="secondary-btn" id="backToHomeInline">Voltar para início</button>
          </div>
        </div>
      </div>

      <div class="info-panels">
        <div class="info-panel">
          <h4>Informações da música</h4>
          <p><strong>Título:</strong> ${track.title}</p>
          <p><strong>Nome da música:</strong> ${track.musicName}</p>
          <p><strong>Autor:</strong> ${track.author}</p>
        </div>

        <div class="info-panel">
          <h4>Descrição</h4>
          <p>${track.description}</p>
        </div>

        <div class="info-panel">
          <h4>Significado da música</h4>
          <p>${track.meaning}</p>
        </div>
      </div>
    </section>
  `;

  attachDynamicCardEvents();
  const backInline = document.getElementById('backToHomeInline');
  if (backInline) backInline.addEventListener('click', renderHome);
}

function updateMenuState(active) {
  document.getElementById('homeNav').classList.toggle('active', active === 'home');
  document.getElementById('searchNav').classList.toggle('active', active === 'search');
}

function updatePlayerUI(track) {
  playerCover.src = track.cover;
  playerTitle.textContent = track.musicName;
  playerArtist.textContent = track.author;
}

function playTrackById(trackId) {
  const index = tracks.findIndex(track => track.id === trackId);
  if (index === -1) return;

  state.currentIndex = index;
  state.currentTrack = tracks[index];
  audioPlayer.src = state.currentTrack.audio;
  updatePlayerUI(state.currentTrack);
  setMainGradient(state.currentTrack.accent || '#1db954');

  audioPlayer.play().catch(() => {
    console.warn('O navegador bloqueou autoplay até interação mais direta.');
  });
}

function togglePlay() {
  if (!state.currentTrack) {
    playTrackById(tracks[0].id);
    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function nextTrack() {
  const nextIndex = (state.currentIndex + 1) % tracks.length;
  playTrackById(tracks[nextIndex].id);
}

function prevTrack() {
  const prevIndex = (state.currentIndex - 1 + tracks.length) % tracks.length;
  playTrackById(tracks[prevIndex].id);
}

function goBack() {
  if (state.history.length <= 1) {
    renderHome();
    return;
  }

  state.history.pop();
  const previous = state.history.pop();

  if (!previous || previous === 'home') {
    renderHome();
    return;
  }

  if (previous === 'search') {
    renderSearch();
    return;
  }

  if (previous.startsWith('detail-')) {
    const id = Number(previous.split('-')[1]);
    openTrack(id);
    return;
  }

  renderHome();
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const user = users.find(item => item.username === username && item.password === password);
  if (!user) {
    alert('Usuário ou senha inválidos.');
    return;
  }

  state.currentUser = user;
  state.history = [];
  renderProfiles();
  showOnly(profilesScreen);
});

document.getElementById('homeNav').addEventListener('click', renderHome);
document.getElementById('searchNav').addEventListener('click', renderSearch);
document.getElementById('homeBtn').addEventListener('click', renderHome);
document.getElementById('playlistMainBtn').addEventListener('click', renderHome);
document.getElementById('playlistRomanceBtn').addEventListener('click', () => openTrack(2));
document.getElementById('backBtn').addEventListener('click', goBack);
document.getElementById('currentProfilePill').addEventListener('click', () => {
  renderProfiles();
  showOnly(profilesScreen);
});
document.getElementById('togglePlayBtn').addEventListener('click', togglePlay);
document.getElementById('nextBtn').addEventListener('click', nextTrack);
document.getElementById('prevBtn').addEventListener('click', prevTrack);

audioPlayer.addEventListener('play', () => {
  togglePlayBtn.textContent = '❚❚';
});

audioPlayer.addEventListener('pause', () => {
  togglePlayBtn.textContent = '▶';
});

audioPlayer.addEventListener('ended', nextTrack);

audioPlayer.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progress || 0}%`;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  durationEl.textContent = formatTime(audioPlayer.duration);
});

progressTrack.addEventListener('click', event => {
  if (!audioPlayer.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = percent * audioPlayer.duration;
});

playerCover.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80';
setMainGradient('#1db954');
