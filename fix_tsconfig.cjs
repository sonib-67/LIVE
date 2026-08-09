const fs = require('fs');
let code = fs.readFileSync('tsconfig.json', 'utf8');
code = code.replace(
  '"allowImportingTsExtensions": true,',
  '"allowImportingTsExtensions": true,\n    "esModuleInterop": true,'
);
fs.writeFileSync('tsconfig.json', code);
