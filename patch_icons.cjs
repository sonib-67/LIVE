const fs = require('fs');
let code = fs.readFileSync('src/pages/LiveSession.tsx', 'utf8');

code = code.replace(
  "import { Users, AlertCircle, Fingerprint, ThumbsUp, ArrowLeft, Lock, Loader2, Play, MessageSquare } from 'lucide-react';",
  "import { Users, AlertCircle, Fingerprint, ThumbsUp, ArrowLeft, Lock, Loader2, Play, MessageSquare, Award, Download, MailCheck } from 'lucide-react';"
);

fs.writeFileSync('src/pages/LiveSession.tsx', code);
