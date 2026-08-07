const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. External redirect component
const externalRedirectCode = `const ExternalRedirect = ({ to }: { to: string }) => {
  React.useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {`;

code = code.replace("function ProtectedRoute({ children }: { children: React.ReactNode }) {", externalRedirectCode);

// 2. Redirect to /78794108 in ProtectedRoute
code = code.replace(
  "if (!user) return <Navigate to=\"/admin/login\" replace />;",
  "if (!user) return <Navigate to=\"/78794108\" replace />;"
);

// 3. Update routes
code = code.replace(
  "<Route path=\"/admin/login\" element={<AdminLogin />} />",
  "<Route path=\"/78794108\" element={<AdminLogin />} />"
);

// 4. Update root route to external redirect
code = code.replace(
  "<Route path=\"/\" element={<Navigate to=\"/admin\" replace />} />",
  "<Route path=\"/\" element={<ExternalRedirect to=\"https://organicmushroomsfarm.com/services\" />} />"
);

fs.writeFileSync('src/App.tsx', code);
