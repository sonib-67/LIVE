const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace('if (!user) return <Navigate to="/78794108" replace />;', 'if (!user) return <Navigate to="/787941" replace />;');
appCode = appCode.replace('<Route path="/78794108" element={<AdminLogin />} />', '<Route path="/787941" element={<AdminLogin />} />');
appCode = appCode.replace('<Route\n          path="/admin"\n          element=', '<Route\n          path="/787941/dashboard"\n          element=');
appCode = appCode.replace('<Route\n          path="/admin/live/:sessionId"\n          element=', '<Route\n          path="/787941/live/:sessionId"\n          element=');
appCode = appCode.replace('<Route path="/" element={<ExternalRedirect to="https://organicmushroomsfarm.com/services" />} />', '<Route path="/" element={<ExternalRedirect to="https://organicmushroomsfarm.com/services" />} />\n        <Route path="*" element={<ExternalRedirect to="https://organicmushroomsfarm.com/services" />} />');
fs.writeFileSync('src/App.tsx', appCode);

// Patch AdminLogin.tsx
let loginCode = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');
loginCode = loginCode.replace("navigate('/admin');", "navigate('/787941/dashboard');");
fs.writeFileSync('src/pages/AdminLogin.tsx', loginCode);

// Patch AdminDashboard.tsx
let dashCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
dashCode = dashCode.replace("navigate('/78794108');", "navigate('/787941');");
dashCode = dashCode.replace("navigate(`/admin/live/${selectedSession.id}`);", "navigate(`/787941/live/${selectedSession.id}`);");
fs.writeFileSync('src/pages/AdminDashboard.tsx', dashCode);

// Patch index.html
let htmlCode = fs.readFileSync('index.html', 'utf8');
if (!htmlCode.includes('noindex')) {
  htmlCode = htmlCode.replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />');
  fs.writeFileSync('index.html', htmlCode);
}
