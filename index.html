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

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
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
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Données incomplètes' }));
          return;
        }

        const entryLine = `[${createdAt}] ${pseudo} | ${location} | ${weekends.join(', ')}\n`;
        fs.appendFileSync(txtFile, entryLine, 'utf8');

        const csvLine = `${escapeCsv(pseudo)},${escapeCsv(location)},${escapeCsv(weekends.join(', '))},${escapeCsv(createdAt)}\n`;
        fs.appendFileSync(csvFile, csvLine, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'JSON invalide' }));
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
