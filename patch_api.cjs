const fs = require('fs');
let code = fs.readFileSync('src/server/api.ts', 'utf8');

// I will import the new function
code = code.replace(
  "import { sendRegistrationEmail } from '../lib/emailService.js';",
  "import { sendRegistrationEmail, sendCompletionEmail } from '../lib/emailService.js';"
);

// Add the new endpoint
code += `
router.post('/send-completion-email', async (req, res) => {
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
`;

fs.writeFileSync('src/server/api.ts', code);
