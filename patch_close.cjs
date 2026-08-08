const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  "({newSession.durationMinutes.toFixed(2)} mins)\n                  </div>\n                </div>\n              </div>",
  "({newSession.durationMinutes.toFixed(2)} mins)\n                  </div>\n                </div>)}\n              </div>"
);

code = code.replace(
  "({editingSessionData.durationMinutes.toFixed(2)} mins)\n                  </div>\n                </div>\n              </div>",
  "({editingSessionData.durationMinutes.toFixed(2)} mins)\n                  </div>\n                </div>)}\n              </div>"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
