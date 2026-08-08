const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  "{/* Hours, Minutes, Seconds Picker for CREATE */}\n                <div className=\"md:col-span-5 lg:col-span-5\">",
  "{/* Hours, Minutes, Seconds Picker for CREATE */}\n                {newSession.videoSourceType !== 'hls' && (<div className=\"md:col-span-5 lg:col-span-5\">"
);
code = code.replace(
  "                      />\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div className=\"mt-6\">\n                <h3 className=\"text-sm font-bold text-white/90 dark:text-white/90 light:text-slate-800 mb-3\">Real-time Engagement Features</h3>",
  "                      />\n                    </div>\n                  </div>\n                </div>)}\n              </div>\n\n              <div className=\"mt-6\">\n                <h3 className=\"text-sm font-bold text-white/90 dark:text-white/90 light:text-slate-800 mb-3\">Real-time Engagement Features</h3>"
);

code = code.replace(
  "{/* Hours, Minutes, Seconds Picker for EDIT */}\n                <div className=\"md:col-span-5 lg:col-span-5\">",
  "{/* Hours, Minutes, Seconds Picker for EDIT */}\n                {editingSessionData.videoSourceType !== 'hls' && (<div className=\"md:col-span-5 lg:col-span-5\">"
);
code = code.replace(
  "                      />\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div className=\"mt-6 flex justify-end space-x-3\">",
  "                      />\n                    </div>\n                  </div>\n                </div>)}\n              </div>\n\n              <div className=\"mt-6 flex justify-end space-x-3\">"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
