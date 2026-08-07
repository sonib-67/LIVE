const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  "         {phase === 'waiting' && activeClassInfo && (",
  "         {phase === 'today_completed' && activeClassInfo && (\n           <motion.div key=\"completed\" className=\"absolute inset-0 z-10 flex items-center justify-center bg-[#0a051b]\">\n             <div className=\"text-center p-8 bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl max-w-md w-full mx-4\">\n               <div className=\"w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6\">\n                 <ThumbsUp className=\"w-8 h-8 text-green-400\" />\n               </div>\n               <h2 className=\"text-2xl sm:text-3xl font-bold text-white mb-4\">Day {activeClassInfo.dayIndex + 1} Training Complete!</h2>\n               <p className=\"text-slate-300 text-base mb-6\">Great job completing today's session. The countdown for the next session will automatically start at midnight.</p>\n               <p className=\"text-sm font-medium tracking-wide text-indigo-400 uppercase\">See you tomorrow!</p>\n             </div>\n           </motion.div>\n         )}\n         {phase === 'waiting' && activeClassInfo && ("
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
