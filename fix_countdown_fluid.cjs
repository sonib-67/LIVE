const fs = require('fs');
let code = fs.readFileSync('src/components/LiveCountdown.tsx', 'utf8');

code = code.replace(
  /className="relative w-full aspect-\[4\/5\] xs:aspect-auto xs:w-12 xs:h-16 sm:w-24 sm:h-32 bg-neutral-900 border border-white\/10 dark:bg-neutral-900 dark:border-white\/10 light:bg-white light:border-gray-200 rounded-xl xs:rounded-2xl flex items-center justify-center shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.1\),0_8px_32px_rgba\(0,0,0,0\.5\)\] light:shadow-\[0_8px_20px_rgba\(0,0,0,0\.06\)\] overflow-hidden"/g,
  'className="relative w-full aspect-[3/4] sm:aspect-auto sm:w-24 sm:h-32 bg-neutral-900 border border-white/10 dark:bg-neutral-900 dark:border-white/10 light:bg-white light:border-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] light:shadow-[0_8px_20px_rgba(0,0,0,0.06)] overflow-hidden"'
);

code = code.replace(
  /text-xl xs:text-2xl sm:text-5xl/g,
  'text-2xl sm:text-5xl'
);

code = code.replace(
  /flex-1 max-w-\[80px\] sm:max-w-\[112px\]/g,
  'flex-1 min-w-0 max-w-[70px] sm:max-w-[112px]'
);

code = code.replace(
  /gap-1\.5 xs:gap-2 sm:gap-4 lg:gap-6/g,
  'gap-2 sm:gap-4 lg:gap-6'
);

fs.writeFileSync('src/components/LiveCountdown.tsx', code);
