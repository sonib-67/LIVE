const fs = require('fs');

const createOld = fs.readFileSync('new_hls_block.txt', 'utf8');
const editOld = fs.readFileSync('edit_hls_block.txt', 'utf8');

const transformBlock = (code, objectName) => {
  let result = code;
  // Day URL block container
  result = result.replace(/bg-black\/20 border border-white\/5 rounded-xl/g, 'bg-black/20 border border-white/5 dark:bg-black/20 dark:border-white/5 light:bg-slate-100 light:border-slate-200 rounded-xl');
  // Day {idx + 1} badge
  result = result.replace(/bg-indigo-500\/20 text-indigo-400/g, 'bg-indigo-500/20 text-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-400 light:bg-indigo-100 light:text-indigo-700');
  
  // Number inputs
  result = result.replace(/className="w-12 sm:w-16 bg-black\/50 border border-white\/10 rounded-lg px-1\.5 py-1 text-center text-sm focus:outline-none focus:border-purple-500"/g, 'className="w-12 sm:w-16 bg-black/50 border border-white/10 dark:bg-black/50 dark:border-white/10 light:bg-white light:border-slate-300 light:text-slate-900 rounded-lg px-1.5 py-1 text-center text-sm focus:outline-none focus:border-purple-500 font-mono"');

  // Spans
  result = result.replace(/<span className="text-\[10px\] text-white\/40">([hms])<\/span>/g, '<span className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-500 font-bold">$1</span>');

  return result;
}

let mainCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

mainCode = mainCode.replace(createOld, transformBlock(createOld, 'newSession'));
mainCode = mainCode.replace(editOld, transformBlock(editOld, 'editingSessionData'));

fs.writeFileSync('src/pages/AdminDashboard.tsx', mainCode);

