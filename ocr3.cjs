const { createWorker } = require('tesseract.js');
(async () => {
  const worker = await createWorker('eng');
  const ret = await worker.recognize('public/oldnew.png');
  console.log(Object.keys(ret));
  console.log(Object.keys(ret.data));
  console.log(Array.isArray(ret.data.words));
  await worker.terminate();
})();
