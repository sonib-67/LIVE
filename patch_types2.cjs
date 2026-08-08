const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  "durationMinutes: number;\n  }>({",
  "durationMinutes: number;\n    durationsMinutes?: number[];\n  }>({"
);

code = code.replace(
  "videoSourceType: 'upload' | 'embed' | 'hls';\n  }>({",
  "videoSourceType: 'upload' | 'embed' | 'hls';\n    playbackUrls: string[];\n    durationsMinutes?: number[];\n  }>({"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
