const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
if (!code.includes('import CertificatePage')) {
  code = code.replace(
    "import Completion from './pages/Completion';",
    "import Completion from './pages/Completion';\nimport CertificatePage from './pages/CertificatePage';"
  );
  code = code.replace(
    '<Route path="/complete" element={<Completion />} />',
    '<Route path="/certificate/:joinToken" element={<CertificatePage />} />\n        <Route path="/complete" element={<Completion />} />'
  );
  fs.writeFileSync('src/App.tsx', code);
}
