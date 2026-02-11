#!/usr/bin/env node
/**
 * Gmail CLI utility for Clawd
 * Usage: node gmail.js <command> [options]
 * Commands: inbox, read <id>, send, unread
 */

const fs = require('fs');
const path = require('path');

const CREDS_DIR = path.join(__dirname, 'credentials');
const credentials = JSON.parse(fs.readFileSync(path.join(CREDS_DIR, 'client_secret.json'))).installed;
let tokens = JSON.parse(fs.readFileSync(path.join(CREDS_DIR, 'tokens.json')));

const API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

async function refreshTokenIfNeeded() {
  // Check if we have a refresh token and should refresh
  if (!tokens.refresh_token) return;
  
  // Refresh proactively if we don't know expiry or it's close
  const response = await fetch(credentials.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: tokens.refresh_token,
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      grant_type: 'refresh_token'
    })
  });
  
  const newTokens = await response.json();
  if (newTokens.access_token) {
    tokens.access_token = newTokens.access_token;
    tokens.expires_in = newTokens.expires_in;
    // Keep refresh_token as it may not be returned
    fs.writeFileSync(path.join(CREDS_DIR, 'tokens.json'), JSON.stringify(tokens, null, 2));
  }
}

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    await refreshTokenIfNeeded();
    return apiCall(endpoint, options);
  }
  
  return response.json();
}

async function listMessages(query = '', maxResults = 10) {
  const params = new URLSearchParams({ maxResults });
  if (query) params.set('q', query);
  
  const list = await apiCall(`/messages?${params}`);
  if (!list.messages) return [];
  
  const messages = await Promise.all(
    list.messages.map(m => apiCall(`/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`))
  );
  
  return messages.map(m => {
    const headers = m.payload?.headers || [];
    const getHeader = name => headers.find(h => h.name === name)?.value || '';
    return {
      id: m.id,
      threadId: m.threadId,
      snippet: m.snippet,
      from: getHeader('From'),
      subject: getHeader('Subject'),
      date: getHeader('Date'),
      unread: m.labelIds?.includes('UNREAD')
    };
  });
}

async function getMessage(id) {
  const msg = await apiCall(`/messages/${id}?format=full`);
  const headers = msg.payload?.headers || [];
  const getHeader = name => headers.find(h => h.name === name)?.value || '';
  
  // Extract body
  let body = '';
  function extractBody(part) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      body = Buffer.from(part.body.data, 'base64').toString('utf-8');
    } else if (part.parts) {
      part.parts.forEach(extractBody);
    }
  }
  extractBody(msg.payload);
  
  return {
    id: msg.id,
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: body || msg.snippet
  };
}

async function sendMessage(to, subject, body) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body
  ].join('\r\n');
  
  const encoded = Buffer.from(message).toString('base64url');
  
  return apiCall('/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encoded })
  });
}

async function main() {
  const [,, command, ...args] = process.argv;
  
  switch (command) {
    case 'inbox':
    case 'list': {
      const messages = await listMessages(args[0] || 'in:inbox', parseInt(args[1]) || 10);
      messages.forEach(m => {
        const unread = m.unread ? '•' : ' ';
        console.log(`${unread} [${m.id.slice(0,8)}] ${m.from.slice(0,30).padEnd(30)} ${m.subject.slice(0,50)}`);
      });
      break;
    }
    
    case 'unread': {
      const messages = await listMessages('is:unread', parseInt(args[0]) || 10);
      if (messages.length === 0) {
        console.log('No unread messages.');
      } else {
        messages.forEach(m => {
          console.log(`• [${m.id.slice(0,8)}] ${m.from.slice(0,30).padEnd(30)} ${m.subject.slice(0,50)}`);
        });
      }
      break;
    }
    
    case 'read': {
      if (!args[0]) {
        console.error('Usage: gmail.js read <message-id>');
        process.exit(1);
      }
      const msg = await getMessage(args[0]);
      console.log(`From: ${msg.from}`);
      console.log(`To: ${msg.to}`);
      console.log(`Date: ${msg.date}`);
      console.log(`Subject: ${msg.subject}`);
      console.log(`\n${msg.body}`);
      break;
    }
    
    case 'send': {
      if (args.length < 3) {
        console.error('Usage: gmail.js send <to> <subject> <body>');
        process.exit(1);
      }
      const [to, subject, ...bodyParts] = args;
      const result = await sendMessage(to, subject, bodyParts.join(' '));
      console.log('Message sent. ID:', result.id);
      break;
    }
    
    case 'profile': {
      const profile = await apiCall('/profile');
      console.log('Email:', profile.emailAddress);
      console.log('Messages:', profile.messagesTotal);
      console.log('Threads:', profile.threadsTotal);
      break;
    }
    
    default:
      console.log('Gmail CLI for Clawd');
      console.log('Commands:');
      console.log('  inbox [query] [limit]  - List inbox messages');
      console.log('  unread [limit]         - List unread messages');
      console.log('  read <id>              - Read a message');
      console.log('  send <to> <subj> <body>- Send a message');
      console.log('  profile                - Show account info');
  }
}

main().catch(console.error);
