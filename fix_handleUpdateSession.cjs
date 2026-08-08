const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /durationsMinutes: editingSessionData\.videoSourceType === 'hls' \? \(editingSessionData\.durationsMinutes \|\| \[\]\)\.filter\(\(_, i\) => editingSessionData\.playbackUrls\[i\]\.trim\(\) !== ''\) : \[\],/g,
  `durationsMinutes: editingSessionData.videoSourceType === 'hls' ? (editingSessionData.durationsMinutes || []).filter((_, i) => editingSessionData.playbackUrls[i].trim() !== '') : [],
        dayTitles: editingSessionData.videoSourceType === 'hls' ? (editingSessionData.dayTitles || editingSessionData.playbackUrls.map((_,i)=>\`Day \${i+1}\`)).filter((_, i) => editingSessionData.playbackUrls[i].trim() !== '') : [],`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
