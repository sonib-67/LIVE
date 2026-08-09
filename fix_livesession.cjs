const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

// Remove TrainingCompleteView definition
code = code.replace(/function TrainingCompleteView[\s\S]*?EOF/, '');
// Also remove it if it goes till the end
const idx = code.indexOf('function TrainingCompleteView');
if (idx !== -1) {
  code = code.substring(0, idx);
}

// Fix the AnimatePresence block
code = code.replace(
  /<AnimatePresence mode="wait">\s*<TrainingCompleteView registration=\{registration\} session=\{session\} \/>\s*\)}/g,
  ''
);

// Fix navigation
code = code.replace(
  "navigate('/complete', { replace: true });",
  "navigate(`/certificate/${joinToken}`, { replace: true });"
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
