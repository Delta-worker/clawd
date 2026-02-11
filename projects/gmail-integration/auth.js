const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'credentials/client_secret.json'))
).installed;

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

const REDIRECT_PORT = 8085;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

// Generate auth URL
const authUrl = new URL(credentials.auth_uri);
authUrl.searchParams.set('client_id', credentials.client_id);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('\n=== Gmail OAuth Setup ===\n');
console.log('Open this URL in your browser:\n');
console.log(authUrl.toString());
console.log('\n\nWaiting for authorization...\n');

// Start local server to catch the redirect
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
  
  if (url.pathname === '/' && url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    
    // Exchange code for tokens
    try {
      const tokenResponse = await fetch(credentials.token_uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      });
      
      const tokens = await tokenResponse.json();
      
      if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
      }
      
      // Save tokens
      fs.writeFileSync(
        path.join(__dirname, 'credentials/tokens.json'),
        JSON.stringify(tokens, null, 2)
      );
      
      console.log('\n✓ Authorization successful!');
      console.log('Tokens saved to credentials/tokens.json\n');
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>✓ Authorization successful!</h1><p>You can close this window.</p>');
      
      setTimeout(() => process.exit(0), 1000);
      
    } catch (err) {
      console.error('Error exchanging code:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Error</h1><p>${err.message}</p>`);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`Listening on port ${REDIRECT_PORT}...`);
});
