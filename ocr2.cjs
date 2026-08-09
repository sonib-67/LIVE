const { createWorker } = require('tesseract.js');
(async () => {
  const worker = await createWorker('eng');
  const ret = await worker.recognize('public/oldnew.png');
  for (let w of ret.data.words) {
    const t = w.text.toUpperCase();
    if (t.includes('DATE') || t.includes('ISSUE') || t.includes('CERTIFICATE') || t.includes('NO.') || t.includes('CERTIFY')) {
      console.log(t, w.bbox);
    }
  }
  await worker.terminate();
})();
