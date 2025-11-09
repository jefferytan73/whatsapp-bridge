export default async function handler(req, res) {
  const VERIFY_TOKEN = 'MySecretZapier123';
  const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/25206847/uspzwdm/';
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Handle Meta's verification GET request
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      
      console.log('Verification attempt:', { mode, token, challenge });
      
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully');
        return res.status(200).send(challenge);
      } else {
        console.log('❌ Verification failed');
        return res.status(403).send('Forbidden');
      }
    }
    
    // Handle POST requests from Meta (WhatsApp messages)
    if (req.method === 'POST') {
      console.log('📩 Received webhook:', JSON.stringify(req.body, null, 2));
      
      // Import fetch dynamically for Node.js
      const fetch = (await import('node-fetch')).default;
      
      const response = await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      
      console.log('✅ Forwarded to Zapier, status:', response.status);
      
      return res.status(200).json({ 
        status: 'success', 
        message: 'Forwarded to Zapier',
        zapier_status: response.status
      });
    }
    
    // Handle other methods
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
    
  } catch (error) {
    console.error('❌ Function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
