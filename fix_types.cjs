const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');
if (!code.includes('completionEmailSent?: boolean;')) {
  code = code.replace(
    'emailSent?: boolean;',
    'emailSent?: boolean;\n  completionEmailSent?: boolean;'
  );
  fs.writeFileSync('src/types/index.ts', code);
}
