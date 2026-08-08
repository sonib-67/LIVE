const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

code = code.replace(
  "playbackUrls?: string[]; // Array of up to 5 URLs for multi-day sessions",
  "playbackUrls?: string[]; // Array of up to 5 URLs for multi-day sessions\n  dayTitles?: string[];"
);

fs.writeFileSync('src/types/index.ts', code);
