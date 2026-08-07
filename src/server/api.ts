import express from 'express';
import { sendRegistrationEmail } from '../lib/emailService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "Welcome to Organic Mushroom Farm API. Backend is active and running!" });
});

router.get('/time', (req, res) => {
  res.json({ serverTime: Date.now() });
});

router.get('/apivideo-token', async (req, res) => {
  try {
    const apiKey = process.env.APIVIDEO_API_KEY || 'whQUXM00kPMcMAM7tAfLsJfR6LfOTSRD2hQFWclxuUY';

    const authRes = await fetch('https://sandbox.api.video/auth/api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    const authData = await authRes.json();
    if (!authData.access_token) throw new Error('Auth failed');

    const tokenRes = await fetch('https://sandbox.api.video/upload-tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ttl: 3600 })
    });
    const tokenData = await tokenRes.json();

    res.json({ token: tokenData.token });
  } catch (error) {
    console.error('Error getting api.video token:', error);
    res.status(500).json({ error: 'Failed to get upload token' });
  }
});

router.post('/send-registration-email', async (req, res) => {
  try {
    const data = req.body;
    const success = await sendRegistrationEmail(
      data.email,
      data.name || 'Attendee',
      data.studentId || 'N/A',
      data.password || 'N/A',
      data.joinToken || '',
      'https://mushroomtraining.online'
    );
    res.json({ success });
  } catch (e) {
    console.error('Error sending email via API:', e);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
