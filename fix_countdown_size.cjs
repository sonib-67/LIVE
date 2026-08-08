const fs = require('fs');
let code = fs.readFileSync('src/components/LiveCountdown.tsx', 'utf8');

code = code.replace(
  "flex flex-col items-center select-none flex-1 max-w-[112px]",
  "flex flex-col items-center select-none flex-1 max-w-[80px] sm:max-w-[112px]"
);

code = code.replace(
  "relative w-full aspect-[4/5] xs:aspect-auto xs:w-14 xs:h-20 sm:w-28 sm:h-36 bg-neutral-900",
  "relative w-full aspect-[4/5] xs:aspect-auto xs:w-12 xs:h-16 sm:w-24 sm:h-32 bg-neutral-900"
);

code = code.replace(
  "text-xl xs:text-2xl sm:text-6xl",
  "text-xl xs:text-2xl sm:text-5xl"
);

code = code.replace(
  "flex justify-center gap-1.5 xs:gap-3 sm:gap-6 lg:gap-8 mb-10 sm:mb-16 w-full px-1 sm:px-2",
  "flex justify-center gap-1.5 xs:gap-2 sm:gap-4 lg:gap-6 mb-8 sm:mb-16 w-full px-1"
);

fs.writeFileSync('src/components/LiveCountdown.tsx', code);
