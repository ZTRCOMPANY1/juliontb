const JSON_PATH = 'data/db.json';

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      return json({ error: error.message || 'Erro interno do servidor.' }, 500);
    }
  },
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
  if (pathname === '/api/health') return json({ ok: true, app: env.APP_NAME || 'Nosso Álbum' }, 200);

  if (pathname === '/api/login' && request.method === 'POST') {
    const body = await request.json();
    return login(body, env);
  }

  const user = await requireAuth(request, env);

  if (pathname === '/api/albums' && request.method === 'GET') {
    const db = await loadDb(env);
    return json({ albums: db.albums || [], user }, 200);
  }

  if (pathname === '/api/albums' && request.method === 'POST') {
    const body = await request.json();
    const db = await loadDb(env);

    const album = {
      id: crypto.randomUUID(),
      name: clean(body.name),
      description: clean(body.description),
      createdAt: new Date().toISOString(),
      createdBy: user.username,
      createdByName: user.displayName,
      items: [],
    };

    if (!album.name) throw new Error('Nome do álbum é obrigatório.');

    db.albums.unshift(album);
    await saveDb(env, db, 'Criar álbum');
    return json({ album }, 201);
  }

  const albumDeleteMatch = pathname.match(/^\/api\/albums\/([^/]+)$/);
  if (albumDeleteMatch && request.method === 'DELETE') {
    const albumId = albumDeleteMatch[1];
    const db = await loadDb(env);
    const album = db.albums.find(a => a.id === albumId);
    if (!album) return json({ error: 'Álbum não encontrado.' }, 404);

    for (const item of album.items) {
      await deleteGithubFile(env, item.repoPath, item.fileSha, `Excluir mídia ${item.title}`);
    }

    db.albums = db.albums.filter(a => a.id !== albumId);
    await saveDb(env, db, 'Excluir álbum');
    return json({ ok: true }, 200);
  }

  const mediaCreateMatch = pathname.match(/^\/api\/albums\/([^/]+)\/media$/);
  if (mediaCreateMatch && request.method === 'POST') {
    const albumId = mediaCreateMatch[1];
    const db = await loadDb(env);
    const album = db.albums.find(a => a.id === albumId);
    if (!album) return json({ error: 'Álbum não encontrado.' }, 404);

    const formData = await request.formData();
    const file = formData.get('file');
    const title = clean(formData.get('title'));

    if (!file || !(file instanceof File)) throw new Error('Arquivo inválido.');
    if (!title) throw new Error('Título é obrigatório.');
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      throw new Error('Somente imagens e vídeos são permitidos.');
    }

    const buffer = await file.arrayBuffer();
    const safeName = slugify(file.name || title);
    const repoPath = `storage/${albumId}/${Date.now()}-${safeName}`;
    const upload = await putGithubFile(env, repoPath, buffer, `Upload ${file.name}`);

    const item = {
      id: crypto.randomUUID(),
      title,
      type: file.type,
      originalName: file.name,
      size: file.size,
      createdAt: new Date().toISOString(),
      createdBy: user.username,
      createdByName: user.displayName,
      repoPath,
      fileSha: upload.content.sha,
      url: `${env.PUBLIC_MEDIA_BASE}/${repoPath}`,
    };

    album.items.unshift(item);
    await saveDb(env, db, `Adicionar mídia ${title}`);
    return json({ item }, 201);
  }

  const mediaDeleteMatch = pathname.match(/^\/api\/albums\/([^/]+)\/media\/([^/]+)$/);
  if (mediaDeleteMatch && request.method === 'DELETE') {
    const albumId = mediaDeleteMatch[1];
    const mediaId = mediaDeleteMatch[2];
    const db = await loadDb(env);
    const album = db.albums.find(a => a.id === albumId);
    if (!album) return json({ error: 'Álbum não encontrado.' }, 404);

    const item = album.items.find(i => i.id === mediaId);
    if (!item) return json({ error: 'Mídia não encontrada.' }, 404);

    await deleteGithubFile(env, item.repoPath, item.fileSha, `Excluir mídia ${item.title}`);
    album.items = album.items.filter(i => i.id !== mediaId);
    await saveDb(env, db, `Excluir mídia ${item.title}`);
    return json({ ok: true }, 200);
  }

  return json({ error: 'Rota não encontrada.' }, 404);
}

async function login(body, env) {
  const db = await loadDb(env);
  const username = clean(body.username).toLowerCase();
  const password = String(body.password || '');
  const passwordHash = await sha256(password);
  const user = (db.users || []).find(u => u.username.toLowerCase() === username && u.passwordHash === passwordHash);

  if (!user) return json({ error: 'Usuário ou senha inválidos.' }, 401);

  const token = await signToken({
    username: user.username,
    displayName: user.displayName,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  }, env.AUTH_SECRET);

  return json({
    token,
    user: { username: user.username, displayName: user.displayName },
  }, 200);
}

async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Não autorizado.');
  const payload = await verifyToken(token, env.AUTH_SECRET);
  if (!payload || payload.exp < Date.now()) throw new Error('Sessão inválida.');
  return payload;
}

async function loadDb(env) {
  try {
    return JSON.parse(await readGithubText(env, JSON_PATH));
  } catch (error) {
    if (String(error.message).includes('404')) {
      return { users: [], albums: [] };
    }
    throw error;
  }
}

async function saveDb(env, db, message) {
  const pretty = JSON.stringify(db, null, 2);
  await putGithubText(env, JSON_PATH, pretty, message);
}

async function readGithubText(env, path) {
  const res = await fetch(githubContentsUrl(env, path), {
    headers: githubHeaders(env),
  });
  if (!res.ok) throw new Error(`GitHub read error: ${res.status}`);
  const data = await res.json();
  return decodeBase64(data.content);
}

async function putGithubText(env, path, text, message) {
  const existingSha = await getFileSha(env, path).catch(() => null);
  const body = {
    message,
    content: encodeBase64(text),
    branch: env.GITHUB_BRANCH,
  };
  if (existingSha) body.sha = existingSha;

  const res = await fetch(githubContentsUrl(env, path), {
    method: 'PUT',
    headers: githubHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub write error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function putGithubFile(env, path, buffer, message) {
  const body = {
    message,
    content: arrayBufferToBase64(buffer),
    branch: env.GITHUB_BRANCH,
  };
  const res = await fetch(githubContentsUrl(env, path), {
    method: 'PUT',
    headers: githubHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Falha no upload: ${res.status} ${await res.text()}`);
  return res.json();
}

async function deleteGithubFile(env, path, sha, message) {
  const res = await fetch(githubContentsUrl(env, path), {
    method: 'DELETE',
    headers: githubHeaders(env),
    body: JSON.stringify({ message, sha, branch: env.GITHUB_BRANCH }),
  });
  if (!res.ok) throw new Error(`Falha ao excluir arquivo do GitHub: ${res.status} ${await res.text()}`);
  return res.json();
}

async function getFileSha(env, path) {
  const res = await fetch(githubContentsUrl(env, path), { headers: githubHeaders(env) });
  if (!res.ok) throw new Error(`GitHub SHA error: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

function githubContentsUrl(env, path) {
  return `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
}

function githubHeaders(env) {
  return {
    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': env.APP_NAME || 'album-app',
  };
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function signToken(payload, secret) {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmac(encoded, secret);
  return `${encoded}.${signature}`;
}

async function verifyToken(token, secret) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = await hmac(encoded, secret);
  if (expected !== signature) return null;
  return JSON.parse(base64UrlDecode(encoded));
}

async function hmac(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return arrayBufferToBase64Url(signature);
}

function clean(value) {
  return String(value || '').trim();
}

function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function encodeBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(base64) {
  return decodeURIComponent(escape(atob(base64.replace(/\n/g, ''))));
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function arrayBufferToBase64Url(buffer) {
  return arrayBufferToBase64(buffer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncode(text) {
  return encodeBase64(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(text) {
  text = text.replace(/-/g, '+').replace(/_/g, '/');
  while (text.length % 4) text += '=';
  return decodeBase64(text);
}

function json(data, status = 200) {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }));
}

function cors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  return response;
}
