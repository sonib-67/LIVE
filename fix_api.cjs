const fs = require('fs');

// Fix src/server/api.ts
let serverApiCode = fs.readFileSync('src/server/api.ts', 'utf8');
serverApiCode = serverApiCode.replace('export default router;\n\nrouter.post(\'/send-completion-email', 'router.post(\'/send-completion-email');
if (!serverApiCode.endsWith('export default router;')) {
  serverApiCode += '\nexport default router;\n';
}
fs.writeFileSync('src/server/api.ts', serverApiCode);

// Fix api/index.ts
let apiIndexCode = fs.readFileSync('api/index.ts', 'utf8');
apiIndexCode = apiIndexCode.replace(
  "import { sendRegistrationEmail } from '../src/lib/emailService';",
  "import { sendRegistrationEmail, sendCompletionEmail } from '../src/lib/emailService';"
);
apiIndexCode = apiIndexCode.replace(
  "app.use('/api', router);",
  `router.post('/send-completion-email', async (req, res) => {
  try {
    const { toEmail, attendeeName, attendeeMobile, sessionTitle, certificateDataUrl } = req.body;
    if (!toEmail || !attendeeName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await sendCompletionEmail(toEmail, attendeeName, attendeeMobile, sessionTitle, certificateDataUrl);
    res.json({ success: true, message: 'Completion email sent successfully' });
  } catch (error) {
    console.error('Failed to send completion email:', error);
    res.status(500).json({ error: 'Failed to send completion email' });
  }
});

app.use('/api', router);`
);
fs.writeFileSync('api/index.ts', apiIndexCode);

