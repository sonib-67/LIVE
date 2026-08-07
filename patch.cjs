const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  "    if (info.isEnded && !info.isDuringTraining) {\n      setPhase('ended');\n    } else if (info.isDuringTraining) {\n      setPhase('live');\n    } else {\n      setPhase('waiting');\n    }",
  "    if (info.isEnded && !info.isDuringTraining) {\n      setPhase('ended');\n    } else if (info.isDuringTraining) {\n      setPhase('live');\n    } else if (info.isTodayCompleted) {\n      setPhase('today_completed');\n    } else {\n      setPhase('waiting');\n    }"
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
