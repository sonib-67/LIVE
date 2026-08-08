const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /durationsMinutes: selectedSession\.durationsMinutes && selectedSession\.durationsMinutes\.length > 0 \? selectedSession\.durationsMinutes : \[selectedSession\.durationMinutes \|\| 60\],/g,
  `durationsMinutes: selectedSession.durationsMinutes && selectedSession.durationsMinutes.length > 0 ? selectedSession.durationsMinutes : [selectedSession.durationMinutes || 60],
                          dayTitles: selectedSession.dayTitles && selectedSession.dayTitles.length > 0 ? selectedSession.dayTitles : ['Day 1'],`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
