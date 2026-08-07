const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  '<motion.div key="completed" className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a051b]">',
  '<motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a051b]">'
);

code = code.replace(
  '<motion.div key="countdown" className="absolute inset-0 z-10 flex">',
  '<motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex">'
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
