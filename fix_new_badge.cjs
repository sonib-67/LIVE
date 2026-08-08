const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const lines = code.split('\n');
let inNew = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('newSession.videoSourceType === \'hls\'')) {
    inNew = true;
  }
  if (lines[i].includes('editingSessionData.videoSourceType === \'hls\'')) {
    inNew = false;
  }
  
  if (inNew && lines[i].includes('value={editingSessionData.dayTitles?.[idx] || \'\'}')) {
    lines[i] = lines[i].replace('editingSessionData', 'newSession');
  }
  
  if (inNew && lines[i].includes('const newTitles = [...(editingSessionData.dayTitles || editingSessionData.playbackUrls.map')) {
    lines[i] = lines[i].replace(/editingSessionData/g, 'newSession');
  }
  
  if (inNew && lines[i].includes('setEditingSessionData({ ...editingSessionData, dayTitles: newTitles });')) {
    lines[i] = lines[i].replace(/setEditingSessionData\(\{ \.\.\.editingSessionData/g, 'setNewSession({ ...newSession');
  }
}

fs.writeFileSync('src/pages/AdminDashboard.tsx', lines.join('\n'));
