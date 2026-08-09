const fs = require('fs');
let code = fs.readFileSync('src/pages/CertificatePage.tsx', 'utf8');

code = code.replace(
  "const sessions = await sessionService.getAdminSessions(reg.adminId);\n        const sess = sessions.find(s => s.id === reg.sessionId);",
  "const sess = await sessionService.getSessionById(reg.sessionId);"
);

fs.writeFileSync('src/pages/CertificatePage.tsx', code);
