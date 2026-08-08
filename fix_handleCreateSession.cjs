const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /durationsMinutes: newSession\.videoSourceType === 'hls' \? newSession\.durationsMinutes\.filter\(\(\_, i\) => newSession\.playbackUrls\[i\]\.trim\(\) !== ''\) : \[\],/g,
  `durationsMinutes: newSession.videoSourceType === 'hls' ? newSession.durationsMinutes.filter((_, i) => newSession.playbackUrls[i].trim() !== '') : [],
        dayTitles: newSession.videoSourceType === 'hls' ? (newSession.dayTitles || newSession.playbackUrls.map((_, i) => \`Day \${i + 1}\`)).filter((_, i) => newSession.playbackUrls[i].trim() !== '') : [],`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
