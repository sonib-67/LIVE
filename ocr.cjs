const { createWorker } = require('tesseract.js');
(async () => {
  const worker = await createWorker('eng');
  const ret = await worker.recognize('public/oldnew.png');
  for (let w of ret.data.words) {
    if (w.text.includes('DATE') || w.text.includes('ISSUE') || w.text.includes('CERTIFICATE') || w.text.includes('NO') || w.text.includes('CERTIFY')) {
      console.log(w.text, w.bbox);
    }
  }
  await worker.terminate();
})();
