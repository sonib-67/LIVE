import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

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
  } catch (error: any) {
    console.error('Error getting api.video token:', error);
    res.status(500).json({ error: 'Failed to get upload token', details: error.message });
  }
});

router.post('/send-registration-email', async (req, res) => {
  try {
    // Dynamically import to prevent Vercel initialization crashes if module resolution fails
    const { sendRegistrationEmail } = await import('../src/lib/emailService.js');
    
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
  } catch (e: any) {
    console.error('Error sending email via API:', e);
    res.status(500).json({ error: 'Failed to send email', details: e.message, stack: e.stack });
  }
});



router.get('/cron-reminders', async (req, res) => {
  try {
    const { sendReminderEmail } = await import('../src/lib/emailService.js');
    const { db } = await import('../src/lib/firebase.js');
    const { collection, getDocs, query, where, updateDoc, doc } = await import('firebase/firestore');

    const sessionsRef = collection(db, 'sessions');
    const now = Date.now();
    const oneHourFromNow = now + (60 * 60 * 1000);
    const fifteenMinsFromNow = now + (15 * 60 * 1000);

    const snapshot = await getDocs(sessionsRef);
    let sentCount = 0;

    for (const sessionDoc of snapshot.docs) {
      const session = sessionDoc.data();
      const startTimeMs = session.startTimeMs || new Date(session.startTime).getTime();
      
      // Target sessions starting in the next 15 to 70 mins
      if (startTimeMs > fifteenMinsFromNow && startTimeMs <= (oneHourFromNow + (10 * 60 * 1000))) {
        
        const regRef = collection(db, 'registrations');
        const regQuery = query(regRef, where('sessionId', '==', sessionDoc.id));
        const regSnapshot = await getDocs(regQuery);
        
        for (const rDoc of regSnapshot.docs) {
          const reg = rDoc.data();
          if (!reg.reminderSent) {
            const success = await sendReminderEmail(
              reg.email,
              reg.name || 'Attendee',
              reg.studentId || 'N/A',
              reg.password || 'N/A',
              reg.joinToken || ''
            );
            if (success) {
              await updateDoc(doc(db, 'registrations', rDoc.id), { reminderSent: true });
              sentCount++;
            }
          }
        }
      }
    }
    res.json({ success: true, sentCount });
  } catch (e: any) {
    console.error('Error in cron reminders:', e);
    res.status(500).json({ error: 'Failed to process reminders', details: e.message });
  }
});
-e app.use('/api', router);
export default app;
