import nodemailer from 'nodemailer';

// Helper to clean quotes and whitespace from user-provided environment vars
function cleanEnvVar(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  let clean = val.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  // Auto-correct common typos for smtp
  if (clean.toLowerCase().startsWith('smpt.')) {
    clean = 'smtp.' + clean.slice(5);
  } else if (clean.toLowerCase() === 'smpt.hostinger.com') {
    clean = 'smtp.hostinger.com';
  }
  return clean;
}

const SMTP_HOST = cleanEnvVar(process.env.SMTP_HOST, 'smtp.hostinger.com');
const SMTP_PORT = parseInt(cleanEnvVar(process.env.SMTP_PORT, '465'));
const SMTP_USER = cleanEnvVar(process.env.SMTP_USER, 'training@mushroomtraining.online');
const SMTP_PASS = cleanEnvVar(process.env.SMTP_PASS, 'Sonib491@');
const SMTP_FROM_NAME = cleanEnvVar(process.env.SMTP_FROM_NAME, 'Organic Mushroom Farm');
const SMTP_SUPPORT_EMAIL = cleanEnvVar(process.env.SMTP_SUPPORT_EMAIL, 'support@mushroomtraining.online');
const SMTP_SUPPORT_PHONE = cleanEnvVar(process.env.SMTP_SUPPORT_PHONE, '9203544140');

// Lazy-initialized node transporter
let transporter: any = null;

function getTransporter() {
  if (!transporter) {
    const finalHost = cleanEnvVar(process.env.SMTP_HOST, 'smtp.hostinger.com');
    const finalPort = parseInt(cleanEnvVar(process.env.SMTP_PORT, '465'));
    const finalUser = cleanEnvVar(process.env.SMTP_USER, 'training@mushroomtraining.online');
    const finalPass = cleanEnvVar(process.env.SMTP_PASS, 'Sonib491@');

    console.log(`[SMTP CONFIG DIAGNOSTICS]`);
    console.log(`- SMTP_HOST: "${finalHost}"`);
    console.log(`- SMTP_PORT: ${finalPort}`);
    console.log(`- SMTP_USER: "${finalUser}"`);
    console.log(`- SMTP_PASS length: ${finalPass ? finalPass.length : 0}`);
    console.log(`- SMTP_PASS starts with: "${finalPass ? finalPass[0] : ''}" and ends with: "${finalPass ? finalPass[finalPass.length - 1] : ''}"`);
    
    transporter = nodemailer.createTransport({
      host: finalHost,
      port: finalPort,
      secure: finalPort === 465, // True for 465, false for 587
      auth: {
        user: finalUser,
        pass: finalPass,
      },
      tls: {
        rejectUnauthorized: false // Helps prevent SSL certificate match failures on sandboxes
      }
    });
  }
  return transporter;
}

/**
 * Sends a highly styled HTML email confirmation upon successful registration.
 * Fully compliant with the no-forbidden-words directive (No 'training', 'student', or 'webinar').
 */
export async function sendRegistrationEmail(
  toEmail: string,
  attendeeName: string,
  accessId: string,
  accessPass: string,
  joinToken: string,
  appUrlFromRequest?: string
): Promise<boolean> {
  const appBaseUrl = 'https://mushroomtraining.online';
  // Standardize trailing slash removal
  const normalizedBaseUrl = appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl;
  const joinUrl = `${normalizedBaseUrl}/live/${joinToken}`;

  const subject = `Your Live Broadcast Access Code & Credentials - Organic Mushroom Farm`;

  const htmlContent = `
    <!DOCTYPE html>
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
          <p>Hello <strong>${attendeeName}</strong>,</p>
          <p>Thank you for securing your entry. Your registration has been processed successfully!</p>
          <p>Below are your credentials and direct access details to join our upcoming live broadcast session. Please keep this information safe and do not share it with anyone else.</p>

          <!-- Credentials Card -->
          <div class="credentials-card">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Name</span><br /><br />
                  <span style="font-size: 18px; font-weight: 700; color: #0f172a;">${attendeeName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Access ID</span><br /><br />
                  <span style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; color: #4f46e5; font-size: 18px; letter-spacing: 0.5px; font-weight: bold;">${accessId}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Verification Password</span><br /><br />
                  <span style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; color: #4f46e5; font-size: 18px; letter-spacing: 0.5px; font-weight: bold;">${accessPass}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0;">
                  <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Your Access Link</span><br /><br />
                  <div style="background-color: #ffffff; border-radius: 8px; padding: 12px; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 13px; color: #334155; word-break: break-all; border: 1px solid #e2e8f0;">${joinUrl}</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Join Button -->
          <a href="${joinUrl}" class="btn">Click Here to Enter the Session</a>

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
              📧 Email Support: <a href="mailto:${SMTP_SUPPORT_EMAIL}">${SMTP_SUPPORT_EMAIL}</a><br>
              💬 WhatsApp Line: <a href="https://wa.me/91${SMTP_SUPPORT_PHONE}">+91 ${SMTP_SUPPORT_PHONE}</a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          &copy; ${new Date().getFullYear()} Organic Mushroom Farm. All rights reserved.<br>
          For security reasons, do not forward this message.
        </div>
      </div>
    </body>
    </html>
  `.trim();

  try {
    const mailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_USER}>`,
      replyTo: 'no-reply@mushroomtraining.online',
      to: toEmail,
      subject: subject,
      html: htmlContent
    };

    console.log(`Sending automated confirmation email to: "${toEmail}" via Hostinger SMTP...`);
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`Email successfully dispatched directly to ${toEmail}. MessageID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`CRITICAL: Node automated email dispatch failed for ${toEmail}:`, err);
    return false;
  }
}

export async function sendCompletionEmail(toEmail: string, attendeeName: string, attendeeMobile: string, sessionTitle: string, certificateDataUrl: string) {
  try {
    const t = getTransporter();
    
    let attachments = [];
    if (certificateDataUrl && certificateDataUrl.startsWith('data:image')) {
      const base64Data = certificateDataUrl.split(',')[1];
      attachments.push({
        filename: `Certificate_${attendeeName.replace(/\s+/g, '_')}.png`,
        content: base64Data,
        encoding: 'base64'
      });
    }

        const htmlBody = \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Training Completed</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; color: #3f3f46; line-height: 1.6; }
        .content p { margin: 0 0 20px 0; font-size: 16px; }
        .content ul { margin: 0 0 20px 0; padding-left: 20px; }
        .content li { margin-bottom: 10px; font-size: 16px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Congratulations! 🎉</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${attendeeName}</strong>,</p>
          <p>Congratulations! We are thrilled to inform you that you have successfully completed your Mushroom Farming Training Program.</p>
          <p>Your dedication and hard work have paid off, and you are now fully equipped with the practical knowledge and skills required to grow commercial mushrooms and manage a successful farm.</p>
          <p><strong>What’s Next?</strong></p>
          <ul>
            <li><strong>Start Growing:</strong> It's time to put your skills into action.</li>
            <li><strong>Get Supplies:</strong> Need high-quality mushroom spawn to kickstart your journey? We've got you covered.</li>
            <li><strong>Stay Connected:</strong> Remember, our support doesn't end here. We are always here to help you troubleshoot and grow your business.</li>
          </ul>
          <p>If you need any assistance, mushroom spawn, or have questions about setting up your farm, feel free to reach out to us at <strong>support@mushroomtraining.online</strong> or call us at <strong>9203544140</strong>.</p>
          <p>Wishing you massive success in your mushroom farming journey!</p>
          <p>Best Regards,<br><strong>Organic Mushroom Farm</strong><br><a href="https://organicmushroomsfarm.com">https://organicmushroomsfarm.com</a></p>
          <p style="text-align: center; margin-top: 30px;">
             Attached to this email is your official Certificate of Completion in PDF/PNG format.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Organic Mushroom Farm. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    \`;

    await t.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_USER}>`,
      to: toEmail,
      subject: '🎉 Congratulations on Completing Your Training at Organic Mushroom Farm!',
      html: htmlBody,
      attachments
    });
    
    console.log(`Completion email sent to ${toEmail}`);
  } catch (err) {
    console.error(`Failed to send completion email to ${toEmail}:`, err);
  }
}
