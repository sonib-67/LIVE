const fs = require('fs');

const transformBlock = (code, objectName) => {
  let result = code;
  // Day {idx + 1} badge
  result = result.replace(
    /<div className="bg-indigo-500\/20 text-indigo-400 dark:bg-indigo-500\/20 dark:text-indigo-400 light:bg-indigo-100 light:text-indigo-700 text-xs font-bold px-2 py-1\.5 rounded-lg shrink-0">Day {idx \+ 1} URL<\/div>/g,
    `<input
      type="text"
      value={${objectName}.dayTitles?.[idx] || ''}
      onChange={e => {
        const newTitles = [...(${objectName}.dayTitles || ${objectName}.playbackUrls.map((_, i) => 'Day ' + (i + 1)))];
        newTitles[idx] = e.target.value;
        const capitalizedState = '${objectName}' === 'newSession' ? 'NewSession' : 'EditingSessionData';
        eval('set' + capitalizedState)({ ...${objectName}, dayTitles: newTitles });
      }}
      placeholder={\`Day \${idx + 1}\`}
      className="w-24 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 light:bg-indigo-100 light:border-indigo-200 light:text-indigo-700 text-xs font-bold px-2 py-1.5 rounded-lg shrink-0 focus:outline-none focus:border-indigo-400 placeholder-indigo-400/50"
    />`
  );
  
  return result;
}

let mainCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// I'll manually run the regex
mainCode = mainCode.replace(
  /<div className="bg-indigo-500\/20 text-indigo-400 dark:bg-indigo-500\/20 dark:text-indigo-400 light:bg-indigo-100 light:text-indigo-700 text-xs font-bold px-2 py-1\.5 rounded-lg shrink-0">Day {idx \+ 1} URL<\/div>/g,
  `<input
      type="text"
      value={newSession.dayTitles?.[idx] || ''}
      onChange={e => {
        const newTitles = [...(newSession.dayTitles || newSession.playbackUrls.map((_, i) => 'Day ' + (i + 1)))];
        newTitles[idx] = e.target.value;
        setNewSession({ ...newSession, dayTitles: newTitles });
      }}
      placeholder={\`Day \${idx + 1}\`}
      className="w-20 xs:w-24 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 light:bg-indigo-100 light:border-indigo-200 light:text-indigo-700 text-[10px] xs:text-xs font-bold px-1.5 xs:px-2 py-1.5 rounded-lg shrink-0 focus:outline-none focus:border-indigo-400 placeholder-indigo-400/50"
    />`
);

// We need to distinguish between newSession and editingSessionData.
