const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  '<div className="flex flex-col border-l border-white/10 pl-4 py-0.5">',
  `<div className="flex flex-col">
                      <span className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-400 uppercase tracking-widest font-bold mb-0.5 font-sans">Session Info</span>
                      <span className="font-extrabold text-amber-400 dark:text-amber-400 light:text-amber-600 tracking-wide text-xs sm:text-sm flex items-center gap-1"><Play className="w-3.5 h-3.5" /> Day {activeClassInfo.dayIndex + 1} Training</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-4 py-0.5">`
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
