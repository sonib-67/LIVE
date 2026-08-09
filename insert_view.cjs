const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  "{phase === 'waiting' && activeClassInfo && (",
  `{phase === 'ended' && session && registration && (
           <TrainingCompleteView registration={registration} session={session} />
         )}
         {phase === 'waiting' && activeClassInfo && (`
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
