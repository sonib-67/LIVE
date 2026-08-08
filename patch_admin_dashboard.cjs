const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Update setNewSession initialization (Create)
code = code.replace(
  "setNewSession({ title: '', description: '', playbackUrl: '', playbackUrls: [''], videoSourceType: 'upload', startTime: '', durationMinutes: 60 });",
  "setNewSession({ title: '', description: '', playbackUrl: '', playbackUrls: [''], videoSourceType: 'upload', startTime: '', durationMinutes: 60, durationsMinutes: [60] });"
);

// Add durationsMinutes to the state definition of newSession
// Wait, the state might not specify the type explicitly, it infers or uses Partial<Session>

// Now let's update where editingSessionData is set
code = code.replace(
  "playbackUrls: selectedSession.playbackUrls && selectedSession.playbackUrls.length > 0 ? selectedSession.playbackUrls : [selectedSession.playbackUrl || ''],",
  "playbackUrls: selectedSession.playbackUrls && selectedSession.playbackUrls.length > 0 ? selectedSession.playbackUrls : [selectedSession.playbackUrl || ''],\n                          durationsMinutes: selectedSession.durationsMinutes && selectedSession.durationsMinutes.length > 0 ? selectedSession.durationsMinutes : [selectedSession.durationMinutes || 60],"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
