const { createWorker } = require('tesseract.js');
(async () => {
  const worker = await createWorker('eng');
  const { data: { words } } = await worker.recognize('public/oldnew.png');
  for (let w of words) {
    if (w.text.includes('DATE') || w.text.includes('ISSUE') || w.text.includes('CERTIFICATE') || w.text.includes('NO') || w.text.includes('CERTIFY')) {
      console.log(w.text, w.bbox);
    }
  }
  await worker.terminate();
})();
