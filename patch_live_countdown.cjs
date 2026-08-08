const fs = require('fs');
let code = fs.readFileSync('src/components/LiveCountdown.tsx', 'utf8');

code = code.replace(
  "flex justify-center gap-2 xs:gap-3 sm:gap-6 lg:gap-8 mb-10 sm:mb-16 w-full px-2",
  "flex justify-center gap-1.5 xs:gap-3 sm:gap-6 lg:gap-8 mb-10 sm:mb-16 w-full px-1 sm:px-2"
);

code = code.replace(
  "relative w-full aspect-[4/5] xs:aspect-auto xs:w-16 xs:h-24 sm:w-28 sm:h-36",
  "relative w-full aspect-[4/5] xs:aspect-auto xs:w-14 xs:h-20 sm:w-28 sm:h-36"
);

code = code.replace(
  "text-2xl xs:text-3xl sm:text-6xl",
  "text-xl xs:text-2xl sm:text-6xl"
);

fs.writeFileSync('src/components/LiveCountdown.tsx', code);
