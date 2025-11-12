
const express = require('express');
const app = express();
const PORT = 3000;


app.get('/stream', async (req, res) => {
 
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

 
  let stopped = false;
  req.on('close', () => { stopped = true; });


  for (let i = 1; i <= 50; i++) {
    if (stopped) break;
    const line = `STREAM ${i} | ${new Date().toISOString()}\n`;
    const ok = res.write(line);
   
    if (!ok) await new Promise(r => res.once('drain', r));
    
    await new Promise(r => setTimeout(r, 300));
  }

  if (!stopped) res.end('--- STREAM FINISHED ---\n');
});


app.get('/data', (req, res) => {
  const payload = {
    message: 'Hello from server',
    author: 'Ritu',
    time: new Date().toISOString()
  };

 
  const wantXml = (req.query.format === 'xml') ||
                  ((req.headers.accept || '').toLowerCase().includes('xml'));

  if (wantXml) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    const xml = `<response><message>${escape(payload.message)}</message><author>${escape(payload.author)}</author><time>${escape(payload.time)}</time></response>`;
    res.send(xml);
  } else {
    res.json(payload);
  }
});

function escape(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  /stream  -> streaming plain-text lines');
  console.log('  /data    -> JSON (default) or XML if ?format=xml or Accept: application/xml');
});




