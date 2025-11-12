

const http = require('http');

function streamFromServer() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/stream', (res) => {
      res.setEncoding('utf8');
      console.log('--- Connected to /stream — live lines below (will end when server closes) ---\n');

      res.on('data', (chunk) => {
      
        process.stdout.write(chunk);
      });

      res.on('end', () => {
        console.log('\n--- /stream ended by server ---\n');
        resolve();
      });

      res.on('close', () => {
      
        console.log('\n--- /stream connection closed ---\n');
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('Stream request error:', err.message);
      reject(err);
    });

   
  });
}

function fetchPath(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET',
      headers
    };
    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    // Start stream in parallel (it will print live)
    const streamPromise = streamFromServer();

    // Wait a tiny bit so stream output appears first (optional)
    await new Promise(r => setTimeout(r, 300));

    // Fetch JSON (default)
    console.log('\n>>> Requesting /data (default = JSON)');
    const jsonResp = await fetchPath('/data', { Accept: 'application/json' });
    console.log('Status:', jsonResp.status);
    console.log('Body:\n', jsonResp.body, '\n');

    // Fetch XML using query param
    console.log('>>> Requesting /data?format=xml (XML expected)');
    const xmlResp = await fetchPath('/data?format=xml', { Accept: 'application/xml' });
    console.log('Status:', xmlResp.status);
    console.log('Body:\n', xmlResp.body, '\n');

    // Wait for stream to finish
    await streamPromise;

    console.log('All done. Exiting client.');
    process.exit(0);
  } catch (err) {
    console.error('Client error:', err && err.message);
    process.exit(1);
  }
})();
