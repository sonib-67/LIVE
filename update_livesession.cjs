const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  /Day \{activeClassInfo\.dayIndex \+ 1\}/g,
  '{activeClassInfo.dayTitle}'
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
