const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const PORT = process.env.PORT || 3000;
const AGENT_TOKEN = process.env.AGENT_TOKEN || 'ztr-14121981';
const OFFLINE_TIMEOUT_MS = 20000;

let latestMonitorData = null;
let lastSeenAt = null;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    online: Boolean(lastSeenAt && Date.now() - lastSeenAt < OFFLINE_TIMEOUT_MS),
    lastSeenAt,
    hasData: Boolean(latestMonitorData)
  });
});

app.get('/api/monitor', (req, res) => {
  res.json({
    online: Boolean(lastSeenAt && Date.now() - lastSeenAt < OFFLINE_TIMEOUT_MS),
    lastSeenAt,
    data: latestMonitorData
  });
});

app.post('/api/agent/metrics', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token || token !== AGENT_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Token inválido' });
  }

  const payload = req.body;

  if (!payload || !payload.system || !payload.cpu || !payload.memory || !payload.disk || !payload.network) {
    return res.status(400).json({ ok: false, error: 'Payload incompleto' });
  }

  latestMonitorData = {
    ...payload,
    server_received_at: new Date().toISOString()
  };
  lastSeenAt = Date.now();

  io.emit('monitor-update', latestMonitorData);

  return res.json({ ok: true });
});

io.on('connection', (socket) => {
  socket.emit('initial-data', {
    monitor: latestMonitorData,
    lastSeenAt,
    online: Boolean(lastSeenAt && Date.now() - lastSeenAt < OFFLINE_TIMEOUT_MS)
  });
});

setInterval(() => {
  const isOnline = Boolean(lastSeenAt && Date.now() - lastSeenAt < OFFLINE_TIMEOUT_MS);

  if (!isOnline) {
    io.emit('agent-offline');
  }
}, 5000);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
