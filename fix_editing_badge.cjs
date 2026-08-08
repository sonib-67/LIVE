const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const findAndReplace = () => {
  const lines = code.split('\n');
  let inEdit = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('editingSessionData.videoSourceType === \'hls\'')) {
      inEdit = true;
    }
    
    if (inEdit && lines[i].includes('value={newSession.dayTitles?.[idx] || \'\'}')) {
      // Replace this input block
      lines[i] = lines[i].replace('newSession.dayTitles', 'editingSessionData.dayTitles');
    }
    
    if (inEdit && lines[i].includes('const newTitles = [...(newSession.dayTitles || newSession.playbackUrls.map')) {
      lines[i] = lines[i].replace(/newSession/g, 'editingSessionData');
    }
    
    if (inEdit && lines[i].includes('setNewSession({ ...newSession, dayTitles: newTitles });')) {
      lines[i] = lines[i].replace(/setNewSession\(\{ \.\.\.newSession/g, 'setEditingSessionData({ ...editingSessionData');
    }
  }
  
  fs.writeFileSync('src/pages/AdminDashboard.tsx', lines.join('\n'));
}

findAndReplace();
