const fs = require('fs');
let code = fs.readFileSync('src/lib/sessionUtils.ts', 'utf8');

code = code.replace(
  "const endMs = targetStartTimeMs + (session.durationMinutes || 60) * 60000;",
  "const currentDurationMinutes = (session.durationsMinutes && session.durationsMinutes[effectiveDayIndex] !== undefined) \n    ? session.durationsMinutes[effectiveDayIndex] \n    : (session.durationMinutes || 60);\n  const endMs = targetStartTimeMs + currentDurationMinutes * 60000;"
);

fs.writeFileSync('src/lib/sessionUtils.ts', code);
