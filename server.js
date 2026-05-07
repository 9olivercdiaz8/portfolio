const express = require('express');
const path = require('path');
const app = express();
const PORT = 3334;

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// HTML nunca cacheado, assets hashed sí
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Version endpoint — no cache, timestamp del index.html
app.get('/version', (req, res) => {
  try {
    const stat = require('fs').statSync(require('path').join(__dirname, 'public', 'index.html'));
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ v: stat.mtimeMs });
  } catch {
    res.json({ v: 0 });
  }
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => console.log('Portfolio on port ' + PORT));
