const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();

  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Arquivo não encontrado");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

function createSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function generateStats() {
  return {
    hoursPlayed: Math.floor(Math.random() * 2000),
    completedGames: Math.floor(Math.random() * 80),
    rareAchievements: Math.floor(Math.random() * 50),
    badgesCount: Math.floor(Math.random() * 20)
  };
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ROTAS API

  if (pathname === "/api/register" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const { username, password, avatar } = body;

      if (!username || !password) {
        return sendJSON(res, 400, { error: "Usuário e senha são obrigatórios." });
      }

      const db = readDB();
      const slug = createSlug(username);

      const exists = db.users.find(
        user => user.username.toLowerCase() === username.toLowerCase() || user.slug === slug
      );

      if (exists) {
        return sendJSON(res, 409, { error: "Usuário já existe." });
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        slug,
        avatar: avatar || "https://i.imgur.com/axQ9wQb.png",
        level: 1,
        gamesPlayed: [
          "GTA V",
          "Minecraft",
          "Rocket League"
        ],
        achievements: [
          "Primeira Vitória",
          "Colecionador",
          "Speed Runner"
        ],
        badges: [
          "Explorador",
          "Veterano",
          "Lendário"
        ],
        stats: generateStats()
      };

      db.users.push(newUser);
      writeDB(db);

      return sendJSON(res, 201, {
        message: "Conta criada com sucesso.",
        user: {
          username: newUser.username,
          slug: newUser.slug
        }
      });
    } catch (err) {
      return sendJSON(res, 500, { error: "Erro ao criar conta." });
    }
  }

  if (pathname === "/api/login" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const { username, password } = body;

      const db = readDB();
      const user = db.users.find(
        u => u.username.toLowerCase() === String(username).toLowerCase() && u.password === password
      );

      if (!user) {
        return sendJSON(res, 401, { error: "Login inválido." });
      }

      return sendJSON(res, 200, {
        message: "Login realizado com sucesso.",
        user: {
          username: user.username,
          slug: user.slug,
          avatar: user.avatar,
          level: user.level,
          gamesPlayed: user.gamesPlayed,
          achievements: user.achievements,
          badges: user.badges,
          stats: user.stats
        }
      });
    } catch (err) {
      return sendJSON(res, 500, { error: "Erro no login." });
    }
  }

  if (pathname.startsWith("/api/profile/") && req.method === "GET") {
    const slug = pathname.split("/").pop();
    const db = readDB();
    const user = db.users.find(u => u.slug === slug);

    if (!user) {
      return sendJSON(res, 404, { error: "Perfil não encontrado." });
    }

    return sendJSON(res, 200, {
      username: user.username,
      slug: user.slug,
      avatar: user.avatar,
      level: user.level,
      gamesPlayed: user.gamesPlayed,
      achievements: user.achievements,
      badges: user.badges,
      stats: user.stats
    });
  }

  // ROTAS HTML

  if (pathname === "/" || pathname === "/index.html") {
    return sendFile(res, path.join(PUBLIC_DIR, "index.html"));
  }

  if (pathname === "/login") {
    return sendFile(res, path.join(PUBLIC_DIR, "login.html"));
  }

  if (pathname === "/dashboard") {
    return sendFile(res, path.join(PUBLIC_DIR, "dashboard.html"));
  }

  if (pathname.startsWith("/u/")) {
    return sendFile(res, path.join(PUBLIC_DIR, "profile.html"));
  }

  // ARQUIVOS ESTÁTICOS
  const filePath = path.join(PUBLIC_DIR, pathname);

  if (filePath.startsWith(PUBLIC_DIR)) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(res, filePath);
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Página não encontrada");
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});