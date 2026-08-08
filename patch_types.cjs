const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');
code = code.replace(
  "durationMinutes: number;",
  "durationMinutes: number;\n  durationsMinutes?: number[];"
);
fs.writeFileSync('src/types/index.ts', code);
