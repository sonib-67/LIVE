const fs = require('fs');
let code = fs.readFileSync('src/lib/sessionUtils.ts', 'utf8');

code = code.replace(
  "const currentUrl = urls[effectiveDayIndex];",
  `const currentUrl = urls[effectiveDayIndex];
  const dayTitle = (session.dayTitles && session.dayTitles[effectiveDayIndex]) 
    ? session.dayTitles[effectiveDayIndex] 
    : \`Day \${effectiveDayIndex + 1}\`;`
);

code = code.replace(
  "return { \n    dayIndex: effectiveDayIndex,",
  `return { 
    dayIndex: effectiveDayIndex,
    dayTitle,`
);

fs.writeFileSync('src/lib/sessionUtils.ts', code);
