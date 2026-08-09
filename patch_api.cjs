const fs = require('fs');
let code = fs.readFileSync('api/index.ts', 'utf8');
code = "import { sendRegistrationEmail } from '../src/lib/emailService';\n" + code;
code = code.replace(
  "    // Dynamically import to prevent Vercel initialization crashes if module resolution fails\n    const { sendRegistrationEmail } = await import('../src/lib/emailService.js');\n    ",
  ""
);
fs.writeFileSync('api/index.ts', code);
