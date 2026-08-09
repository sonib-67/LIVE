const { createWorker } = require('tesseract.js');
(async () => {
  const worker = await createWorker('eng');
  const ret = await worker.recognize('public/oldnew.png');
  const lines = ret.data.hocr.split('\n');
  for (let l of lines) {
    if (l.includes('DATE') || l.includes('ISSUE') || l.includes('CERTIFICATE') || l.includes('CERTIFY')) {
      console.log(l.replace(/<[^>]+>/g, '').trim(), l.match(/bbox \d+ \d+ \d+ \d+/)?.[0]);
    }
  }
  await worker.terminate();
})();
