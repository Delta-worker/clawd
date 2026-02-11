const fs = require('fs');
const path = require('path');

const tokens = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'credentials/tokens.json'))
);

async function testGmail() {
  // Get profile
  const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { 'Authorization': `Bearer ${tokens.access_token}` }
  });
  const profile = await profileRes.json();
  console.log('Email:', profile.emailAddress);
  console.log('Total messages:', profile.messagesTotal);
  console.log('Total threads:', profile.threadsTotal);
  
  // Get recent messages
  const messagesRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
    headers: { 'Authorization': `Bearer ${tokens.access_token}` }
  });
  const messages = await messagesRes.json();
  console.log('\nRecent messages:', messages.messages?.length || 0);
}

testGmail();
