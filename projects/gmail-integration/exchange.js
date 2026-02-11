const fs = require('fs');
const path = require('path');

const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'credentials/client_secret.json'))
).installed;

const code = '4/0ASc3gC26m52PWRsjrNvG5RI8HvzJlBFZ7BOsnjgeZjB5iQPl0uluasEoEOttMMeDexv6cg';
const REDIRECT_URI = 'http://localhost:8085';

async function exchangeCode() {
  const response = await fetch(credentials.token_uri, {
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
  
  const tokens = await response.json();
  
  if (tokens.error) {
    console.error('Error:', tokens.error_description || tokens.error);
    process.exit(1);
  }
  
  fs.writeFileSync(
    path.join(__dirname, 'credentials/tokens.json'),
    JSON.stringify(tokens, null, 2)
  );
  
  console.log('✓ Tokens saved successfully!');
  console.log('Access token expires in:', tokens.expires_in, 'seconds');
}

exchangeCode();
