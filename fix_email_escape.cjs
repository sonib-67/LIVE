const fs = require('fs');
let code = fs.readFileSync('src/lib/emailService.ts', 'utf8');

code = code.replace(
  "filename: \\`Certificate_\\${attendeeName.replace(/\\\\s+/g, '_')}.png\\`,",
  "filename: `Certificate_${attendeeName.replace(/\\s+/g, '_')}.png`,"
);

code = code.replace(/\\\$/g, "$");
code = code.replace(/\\`/g, "`");

fs.writeFileSync('src/lib/emailService.ts', code);
