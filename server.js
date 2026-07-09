const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const txtFile = path.join(dataDir, 'responses.txt');
const csvFile = path.join(dataDir, 'responses.csv');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(txtFile)) {
  fs.writeFileSync(txtFile, '', 'utf8');
}

if (!fs.existsSync(csvFile)) {
  fs.writeFileSync(csvFile, 'pseudo,location,weekends,createdAt\n', 'utf8');
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      setCorsHeaders(res);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS' && req.url === '/submit') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const pseudo = String(data.pseudo || '').trim();
        const location = String(data.location || '').trim();
        const weekends = Array.isArray(data.weekends) ? data.weekends : [];
        const createdAt = data.createdAt || new Date().toLocaleString('fr-FR');

        if (!pseudo || !location || !weekends.length) {
          sendJson(res, 400, { ok: false, error: 'Données incomplètes' });
          return;
        }

        const entryLine = `[${createdAt}] ${pseudo} | ${location} | ${weekends.join(', ')}\n`;
        fs.appendFileSync(txtFile, entryLine, 'utf8');

        const csvLine = `${escapeCsv(pseudo)},${escapeCsv(location)},${escapeCsv(weekends.join(', '))},${escapeCsv(createdAt)}\n`;
        fs.appendFileSync(csvFile, csvLine, 'utf8');

        sendJson(res, 200, { ok: true });
      } catch (error) {
        sendJson(res, 400, { ok: false, error: 'JSON invalide' });
      }
    });

    return;
  }

  if (req.url === '/responses.txt') {
    serveFile(txtFile, 'text/plain; charset=utf-8', res);
    return;
  }

  if (req.url === '/responses.csv') {
    serveFile(csvFile, 'text/csv; charset=utf-8', res);
    return;
  }

  if (req.url === '/') {
    serveFile(path.join(rootDir, 'index.html'), 'text/html; charset=utf-8', res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

server.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
