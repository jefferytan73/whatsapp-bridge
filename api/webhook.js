```javascript
export default async function handler(req, res) {
  const VERIFY_TOKEN = 'MySecretZapier123';

  // Your Zapier webhook URL from Step 1
  const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/25206847/uspzwdm/';

  console.log(${req.method} request:, req.query);

  // Handle Meta's verification GET request
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

console.log('Verification:', { mode, token, challenge });
if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified!');
      return res.status(200).send(challenge);
    } else {
      console.log('❌ Wrong token');
      return res.status(403).send('Forbidden');
    }
  }

  // Handle POST requests (actual WhatsApp messages)
  if (req.method === 'POST') {
    try {
      console.log('📩 Forwarding to Zapier:', req.body);

  const response = await fetch(ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  console.log('✅ Forwarded successfully');
  return res.status(200).json({ status: 'success' });
} catch (error) {
  console.error('❌ Error:', error);
  return res.status(500).json({ error: error.message });
}

}

  return res.status(405).json({ error: 'Method not allowed' });
}
```
