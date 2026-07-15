const fs = require('fs');
let file = fs.readFileSync('src/lib/emailService.ts', 'utf8');

const updatedHtmlTemplate = `    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Access Credentials</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #0f172a;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          padding: 32px;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }
        .logo-img {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          object-fit: cover;
          margin-bottom: 12px;
        }
        .header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          padding: 32px;
        }
        .content p {
          font-size: 15px;
          line-height: 1.6;
          color: #334155;
          margin: 0 0 20px 0;
        }
        .credentials-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .btn {
          display: block;
          text-align: center;
          background-color: #4f46e5;
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          padding: 16px 24px;
          border-radius: 10px;
          margin: 24px 0;
        }
        .btn:hover {
          background-color: #4338ca;
        }
        .steps {
          margin: 24px 0;
          padding: 0 0 0 20px;
        }
        .steps li {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 12px;
        }
        .helpdesk {
          margin-top: 32px;
          border-top: 1px solid #e2e8f0;
          padding-top: 24px;
        }
        .helpdesk h3 {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 12px 0;
        }
        .helpdesk-info {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }
        .helpdesk-info a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }
        .footer {
          padding: 24px 32px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <img src="https://res.cloudinary.com/dtpktdkqw/image/upload/v1779785300/d91bc495-04ad-4214-ad23-5abdd9bf370d_gzmzqt.jpg" alt="Mushroom Logo" class="logo-img" />
          <h1>Organic Mushroom Farm</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p>Hello <strong>\${attendeeName}</strong>,</p>
          <p>Thank you for securing your entry. Your registration has been processed successfully!</p>
          <p>Below are your credentials and direct access details to join our upcoming live broadcast session. Please keep this information safe and do not share it with anyone else.</p>

          <!-- Credentials Card -->
          <div class="credentials-card">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Name</span><br /><br />
                  <span style="font-size: 18px; font-weight: 700; color: #0f172a;">\${attendeeName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Access ID</span><br /><br />
                  <span style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; color: #4f46e5; font-size: 18px; letter-spacing: 0.5px; font-weight: bold;">\${accessId}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Verification Password</span><br /><br />
                  <span style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; color: #4f46e5; font-size: 18px; letter-spacing: 0.5px; font-weight: bold;">\${accessPass}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Your Access Link</span><br /><br />
                  <div style="background-color: #ffffff; border-radius: 8px; padding: 12px; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 13px; color: #334155; word-break: break-all; border: 1px solid #e2e8f0;">\${joinUrl}</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Join Button -->
          <a href="\${joinUrl}" class="btn">Click Here to Enter the Session</a>

          <!-- Steps to Join -->
          <h3 style="font-size: 15px; color: #0f172a; margin-top: 28px; font-weight: 700;">Steps to Join:</h3>
          <ul class="steps">
            <li>Click the access button above or open your unique Access Link in your browser.</li>
            <li>On the "Secure Attendee Login" screen, enter your Access ID and Verification Password.</li>
            <li>Tap "Verify & Join Session" to immediately access the live broadcast room and chat feed.</li>
          </ul>

          <h3 style="font-size: 15px; color: #0f172a; margin-top: 24px; font-weight: 700;">Session Guidelines:</h3>
          <ul class="steps">
            <li><strong>Single Device Security:</strong> For your account security, single-device binding is enabled. The very first device you use to login will be bound to your Access ID. Secondary devices will be blocked.</li>
            <li><strong>Interactive Q&amp;A:</strong> You can submit clear, relevant questions in the live chat during active presentation timings, and our host team will respond live.</li>
          </ul>

          <!-- Help Desk Support -->
          <div class="helpdesk">
            <h3>Support &amp; Help Desk</h3>
            <div class="helpdesk-info">
              If you face any issues entering the session room, contact our helper desk team immediately:<br><br>
              📧 Email Support: <a href="mailto:\${SMTP_SUPPORT_EMAIL}">\${SMTP_SUPPORT_EMAIL}</a><br>
              💬 WhatsApp Line: <a href="https://wa.me/91\${SMTP_SUPPORT_PHONE}">+91 \${SMTP_SUPPORT_PHONE}</a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          &copy; \${new Date().getFullYear()} Organic Mushroom Farm. All rights reserved.<br>
          For security reasons, do not forward this message.
        </div>
      </div>
    </body>
    </html>`;

const startIdx = file.indexOf('    <!DOCTYPE html>');
const endIdx = file.indexOf('`.trim();', startIdx);
file = file.substring(0, startIdx) + updatedHtmlTemplate + '\n  ' + file.substring(endIdx);
fs.writeFileSync('src/lib/emailService.ts', file);
