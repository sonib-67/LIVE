const fs = require('fs');
let code = fs.readFileSync('src/components/LiveCountdown.tsx', 'utf8');

code = code.replace(
  /mt-2\.5 xs:mt-3 sm:mt-4 text-\[8px\] xs:text-\[10px\] sm:text-\[11px\] text-white\/50 dark:text-white\/50 light:text-slate-600 uppercase tracking-widest sm:tracking-\[0\.2em\] font-semibold/g,
  'mt-2 sm:mt-4 text-[9px] sm:text-[11px] text-white/50 dark:text-white/50 light:text-slate-600 uppercase tracking-wider sm:tracking-[0.2em] font-semibold'
);

fs.writeFileSync('src/components/LiveCountdown.tsx', code);
