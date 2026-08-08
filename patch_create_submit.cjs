const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  "playbackUrls: newSession.videoSourceType === 'hls' ? newSession.playbackUrls.filter(u => u.trim() !== '') : [],",
  "playbackUrls: newSession.videoSourceType === 'hls' ? newSession.playbackUrls.filter(u => u.trim() !== '') : [],\n        durationsMinutes: newSession.videoSourceType === 'hls' ? newSession.durationsMinutes.filter((_, i) => newSession.playbackUrls[i].trim() !== '') : [],"
);

code = code.replace(
  "playbackUrls: editingSessionData.videoSourceType === 'hls' ? editingSessionData.playbackUrls.filter(u => u.trim() !== '') : [],",
  "playbackUrls: editingSessionData.videoSourceType === 'hls' ? editingSessionData.playbackUrls.filter(u => u.trim() !== '') : [],\n      durationsMinutes: editingSessionData.videoSourceType === 'hls' ? (editingSessionData.durationsMinutes || []).filter((_, i) => editingSessionData.playbackUrls[i].trim() !== '') : [],"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
