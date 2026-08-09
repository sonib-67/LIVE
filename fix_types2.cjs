const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

code = code.replace(
  'lastActiveAt?: string;',
  'lastActiveAt?: string;\n  completionEmailSent?: boolean;\n  emailSent?: boolean;'
);

fs.writeFileSync('src/types/index.ts', code);
