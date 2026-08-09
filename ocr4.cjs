const { createWorker } = require('tesseract.js');
(async () => {
  const worker = await createWorker('eng');
  const ret = await worker.recognize('public/oldnew.png');
  console.log(ret.data.text);
  await worker.terminate();
})();
