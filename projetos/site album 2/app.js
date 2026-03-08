const API_BASE = 'https://album-github-worker.ztrcompany.workers.dev';

const state = {
  token: localStorage.getItem('album_token') || '',
  user: JSON.parse(localStorage.getItem('album_user') || 'null'),
  albums: [],
  currentAlbumId: null,
  currentAlbum: null,
};

const els = {
  loginScreen: document.getElementById('loginScreen'),
  app: document.getElementById('app'),
  loginForm: document.getElementById('loginForm'),
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  togglePassword: document.getElementById('togglePassword'),
  logoutBtn: document.getElementById('logoutBtn'),
  createAlbumBtn: document.getElementById('createAlbumBtn'),
  createAlbumModal: document.getElementById('createAlbumModal'),
  createAlbumForm: document.getElementById('createAlbumForm'),
  newAlbumName: document.getElementById('newAlbumName'),
  newAlbumDescription: document.getElementById('newAlbumDescription'),
  albumsGrid: document.getElementById('albumsGrid'),
  albumsEmpty: document.getElementById('albumsEmpty'),
  albumSearch: document.getElementById('albumSearch'),
  albumModal: document.getElementById('albumModal'),
  albumTitle: document.getElementById('albumTitle'),
  albumMetaText: document.getElementById('albumMetaText'),
  mediaGrid: document.getElementById('mediaGrid'),
  mediaEmpty: document.getElementById('mediaEmpty'),
  openUploadBtn: document.getElementById('openUploadBtn'),
  uploadModal: document.getElementById('uploadModal'),
  uploadForm: document.getElementById('uploadForm'),
  mediaTitle: document.getElementById('mediaTitle'),
  mediaFile: document.getElementById('mediaFile'),
  filePreviewHint: document.getElementById('filePreviewHint'),
  uploadSubmitBtn: document.getElementById('uploadSubmitBtn'),
  viewerModal: document.getElementById('viewerModal'),
  viewerContent: document.getElementById('viewerContent'),
  viewerTitle: document.getElementById('viewerTitle'),
  viewerInfo: document.getElementById('viewerInfo'),
  downloadBtn: document.getElementById('downloadBtn'),
  toast: document.getElementById('toast'),
  albumCount: document.getElementById('albumCount'),
  mediaCount: document.getElementById('mediaCount'),
};

function showToast(message, isError = false) {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  els.toast.style.borderColor = isError ? 'rgba(255,91,110,0.45)' : 'rgba(255,255,255,0.1)';
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.add('hidden'), 2800);
}

function setAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('album_token', token);
  localStorage.setItem('album_user', JSON.stringify(user));
}

function clearAuth() {
  state.token = '';
  state.user = null;
  localStorage.removeItem('album_token');
  localStorage.removeItem('album_user');
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try { data = await response.json(); } catch (_) {}

  if (!response.ok) {
    throw new Error(data?.error || 'Erro ao comunicar com o servidor.');
  }

  return data;
}

function openModal(modal) { modal.classList.remove('hidden'); }
function closeModal(modal) { modal.classList.add('hidden'); }

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function totalMediaCount() {
  return state.albums.reduce((sum, album) => sum + album.items.length, 0);
}

function renderStats() {
  els.albumCount.textContent = state.albums.length;
  els.mediaCount.textContent = totalMediaCount();
}

function renderAlbums() {
  const search = els.albumSearch.value.trim().toLowerCase();
  const filtered = state.albums.filter(album => {
    return !search || album.name.toLowerCase().includes(search) || (album.description || '').toLowerCase().includes(search);
  });

  els.albumsGrid.innerHTML = '';
  els.albumsEmpty.classList.toggle('hidden', filtered.length > 0);

  filtered.forEach(album => {
    const coverItem = album.items[0];
    const coverHtml = coverItem
      ? coverItem.type.startsWith('video/')
        ? `<div class="album-cover">🎞️</div>`
        : `<img class="media-thumb" src="${coverItem.url}" alt="${album.name}">`
      : `<div class="album-cover">💞</div>`;

    const card = document.createElement('article');
    card.className = 'album-card';
    card.innerHTML = `
      ${coverHtml}
      <div class="album-info">
        <h4>${album.name}</h4>
        <p>${album.description || 'Sem descrição ainda.'}</p>
        <span class="type-badge">${album.items.length} item(ns)</span>
      </div>
      <div class="album-footer">
        <button class="ghost" data-action="open" data-id="${album.id}">Abrir</button>
        <button class="danger-btn" data-action="delete-album" data-id="${album.id}">Excluir</button>
      </div>
    `;
    els.albumsGrid.appendChild(card);
  });
}

function renderMedia(album) {
  state.currentAlbum = album;
  els.albumTitle.textContent = album.name;
  els.albumMetaText.textContent = `${album.items.length} item(ns) • criado em ${formatDate(album.createdAt)}`;
  els.mediaGrid.innerHTML = '';
  els.mediaEmpty.classList.toggle('hidden', album.items.length > 0);

  album.items.forEach(item => {
    const isVideo = item.type.startsWith('video/');
    const card = document.createElement('article');
    card.className = 'media-card';
    card.innerHTML = `
      ${isVideo
        ? `<video class="media-thumb" src="${item.url}" preload="metadata"></video>`
        : `<img class="media-thumb" src="${item.url}" alt="${item.title}">`}
      <div class="media-info">
        <h4>${item.title}</h4>
        <p>Adicionado por ${item.createdByName || item.createdBy || 'usuário'} em ${formatDate(item.createdAt)}</p>
        <span class="video-badge">${isVideo ? '🎬 Vídeo' : '🖼️ Foto'}</span>
      </div>
      <div class="media-footer">
        <button class="ghost" data-action="view-media" data-id="${item.id}">Ver</button>
        <a class="primary" href="${item.url}" download>Baixar</a>
        <button class="danger-btn" data-action="delete-media" data-id="${item.id}">Excluir</button>
      </div>
    `;
    els.mediaGrid.appendChild(card);
  });
}

function findAlbum(id) {
  return state.albums.find(album => album.id === id);
}

function findMedia(album, id) {
  return album.items.find(item => item.id === id);
}

function openViewer(item) {
  const isVideo = item.type.startsWith('video/');
  els.viewerContent.innerHTML = isVideo
    ? `<video src="${item.url}" controls autoplay></video>`
    : `<img src="${item.url}" alt="${item.title}">`;
  els.viewerTitle.textContent = item.title;
  els.viewerInfo.textContent = `${isVideo ? 'Vídeo' : 'Foto'} • ${formatDate(item.createdAt)}`;
  els.downloadBtn.href = item.url;
  els.downloadBtn.setAttribute('download', item.originalName || item.title || 'arquivo');
  openModal(els.viewerModal);
}

async function loadAlbums() {
  const data = await api('/api/albums');
  state.albums = data.albums || [];
  renderStats();
  renderAlbums();

  if (state.currentAlbumId) {
    const updated = findAlbum(state.currentAlbumId);
    if (updated) renderMedia(updated);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  try {
    const data = await api('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: els.username.value.trim(),
        password: els.password.value,
      }),
    });

    setAuth(data.token, data.user);
    els.loginScreen.classList.add('hidden');
    els.app.classList.remove('hidden');
    els.password.value = '';
    showToast(`Bem-vindo, ${data.user.displayName}!`);
    await loadAlbums();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function handleCreateAlbum(event) {
  event.preventDefault();
  try {
    await api('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: els.newAlbumName.value.trim(),
        description: els.newAlbumDescription.value.trim(),
      }),
    });
    closeModal(els.createAlbumModal);
    els.createAlbumForm.reset();
    showToast('Álbum criado com sucesso.');
    await loadAlbums();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function handleUpload(event) {
  event.preventDefault();
  if (!state.currentAlbumId) return;

  const file = els.mediaFile.files[0];
  if (!file) return showToast('Escolha um arquivo.', true);

  const formData = new FormData();
  formData.append('title', els.mediaTitle.value.trim());
  formData.append('file', file);

  try {
    els.uploadSubmitBtn.disabled = true;
    els.uploadSubmitBtn.textContent = 'Enviando...';

    await api(`/api/albums/${state.currentAlbumId}/media`, {
      method: 'POST',
      body: formData,
    });

    els.uploadForm.reset();
    closeModal(els.uploadModal);
    showToast('Mídia enviada com sucesso.');
    await loadAlbums();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    els.uploadSubmitBtn.disabled = false;
    els.uploadSubmitBtn.textContent = 'Enviar';
  }
}

async function deleteAlbum(id) {
  const album = findAlbum(id);
  if (!album) return;
  const ok = confirm(`Excluir o álbum "${album.name}" e todos os itens dentro dele?`);
  if (!ok) return;

  try {
    await api(`/api/albums/${id}`, { method: 'DELETE' });
    if (state.currentAlbumId === id) {
      state.currentAlbumId = null;
      state.currentAlbum = null;
      closeModal(els.albumModal);
    }
    showToast('Álbum excluído.');
    await loadAlbums();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function deleteMedia(id) {
  if (!state.currentAlbum) return;
  const item = findMedia(state.currentAlbum, id);
  if (!item) return;

  const ok = confirm(`Excluir "${item.title}"?`);
  if (!ok) return;

  try {
    await api(`/api/albums/${state.currentAlbum.id}/media/${id}`, { method: 'DELETE' });
    showToast('Mídia excluída.');
    await loadAlbums();
  } catch (error) {
    showToast(error.message, true);
  }
}

function bindEvents() {
  els.loginForm.addEventListener('submit', handleLogin);
  els.togglePassword.addEventListener('click', () => {
    const type = els.password.type === 'password' ? 'text' : 'password';
    els.password.type = type;
    els.togglePassword.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
  });

  els.logoutBtn.addEventListener('click', () => {
    clearAuth();
    state.albums = [];
    state.currentAlbumId = null;
    state.currentAlbum = null;
    els.app.classList.add('hidden');
    els.loginScreen.classList.remove('hidden');
    renderAlbums();
    showToast('Você saiu da conta.');
  });

  els.createAlbumBtn.addEventListener('click', () => openModal(els.createAlbumModal));
  els.createAlbumForm.addEventListener('submit', handleCreateAlbum);
  els.openUploadBtn.addEventListener('click', () => openModal(els.uploadModal));
  els.uploadForm.addEventListener('submit', handleUpload);
  els.albumSearch.addEventListener('input', renderAlbums);

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(document.getElementById(btn.dataset.close)));
  });

  els.albumsGrid.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;
    if (!action || !id) return;

    if (action === 'open') {
      state.currentAlbumId = id;
      const album = findAlbum(id);
      if (!album) return;
      renderMedia(album);
      openModal(els.albumModal);
    }

    if (action === 'delete-album') deleteAlbum(id);
  });

  els.mediaGrid.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;
    if (!action || !id || !state.currentAlbum) return;

    const item = findMedia(state.currentAlbum, id);
    if (!item) return;

    if (action === 'view-media') openViewer(item);
    if (action === 'delete-media') deleteMedia(id);
  });

  els.mediaFile.addEventListener('change', () => {
    const file = els.mediaFile.files[0];
    if (!file) {
      els.filePreviewHint.textContent = 'Aceita imagem e vídeo.';
      return;
    }
    els.filePreviewHint.textContent = `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    if (!els.mediaTitle.value.trim()) {
      els.mediaTitle.value = file.name.replace(/\.[^/.]+$/, '');
    }
  });
}

async function boot() {
  bindEvents();
  if (state.token) {
    try {
      els.loginScreen.classList.add('hidden');
      els.app.classList.remove('hidden');
      await loadAlbums();
    } catch (error) {
      clearAuth();
      els.app.classList.add('hidden');
      els.loginScreen.classList.remove('hidden');
      showToast('Sessão expirada. Faça login novamente.', true);
    }
  }
}

boot();
