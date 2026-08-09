const fs = require('fs');
let code = fs.readFileSync('src/lib/emailService.ts', 'utf8');

// I'll replace the existing htmlBody variable content inside sendCompletionEmail
const newHtmlBody = `    const htmlBody = \\\`
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
          <p>Dear <strong>\${attendeeName}</strong>,</p>
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
          <p>&copy; \${new Date().getFullYear()} Organic Mushroom Farm. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    \\\`;`;

// Using regex to replace everything from "const htmlBody = `" to the last "`;" before "await t.sendMail({"
code = code.replace(/const htmlBody = `[\s\S]*?`;/g, newHtmlBody);

code = code.replace(
  /subject: `Congratulations.*`,/,
  "subject: '🎉 Congratulations on Completing Your Training at Organic Mushroom Farm!',"
);

fs.writeFileSync('src/lib/emailService.ts', code);
