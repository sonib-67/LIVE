const fs = require('fs');
let code = fs.readFileSync('api/index.ts', 'utf8');
code = code.replace('export default app;', '');
code = code + '\nexport default app;\n';
fs.writeFileSync('api/index.ts', code);
