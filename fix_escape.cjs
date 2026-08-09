const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  "link.download = \\`Certificate_\\${registration.name.replace(/\\\\s+/g, '_')}.png\\`;",
  "link.download = `Certificate_${registration.name.replace(/\\s+/g, '_')}.png`;"
);

code = code.replace(
  "download={\\`Certificate_\\${registration.name.replace(/\\\\s+/g, '_')}.png\\`}",
  "download={`Certificate_${registration.name.replace(/\\s+/g, '_')}.png`}"
);

code = code.replace(
  "download={\\`Certificate_\\${registration.name.replace(/\\\\s+/g, '_')}.png\\`}",
  "download={`Certificate_${registration.name.replace(/\\s+/g, '_')}.png`}"
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
