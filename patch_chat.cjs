const fs = require('fs');
let code = fs.readFileSync('src/components/LiveChat.tsx', 'utf8');

// 1. Update containerClasses
code = code.replace(
  "      ? 'fixed right-6 top-1/2 -translate-y-1/2 z-[200] w-[320px] sm:w-[350px] h-[480px] max-h-[80vh]' \n      : 'flex-1 lg:flex-none lg:w-[350px] h-[380px] sm:h-[420px]'\n  }`;",
  "      ? 'fixed right-6 top-1/2 -translate-y-1/2 z-[200] w-[320px] sm:w-[350px] h-[480px] max-h-[80vh]' \n      : 'sticky bottom-2 z-[100] flex-1 lg:static lg:flex-none lg:w-[350px] h-[320px] sm:h-[420px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-md'\n  }`;"
);

// 2. Remove hardcoded style={{ height: ... }}
code = code.replace(
  "className=\"flex-1 overflow-y-auto p-4 space-y-3 flex flex-col scrollbar-width-thin scrollbar-thumb-white/10 overscroll-contain touch-pan-y [webkit-overflow-scrolling:touch]\"\n        style={{ height: isCustomFullscreen ? '300px' : '280px' }}",
  "className=\"flex-1 overflow-y-auto p-4 space-y-3 flex flex-col scrollbar-width-thin scrollbar-thumb-white/10 overscroll-contain touch-pan-y [webkit-overflow-scrolling:touch]\""
);

fs.writeFileSync('src/components/LiveChat.tsx', code);
