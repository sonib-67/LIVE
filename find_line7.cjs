const { createCanvas, loadImage } = require('canvas');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  // scan for DATE OF ISSUE line (around x=880-1100, y=100-200)
  const dateData = ctx.getImageData(880, 100, 220, 100);
  let dateLineY = -1;
  let dateMaxDark = 0;
  for (let y = 0; y < 100; y++) {
    let dark = 0;
    for (let x = 0; x < 220; x++) {
      const idx = (y * 220 + x) * 4;
      if (dateData.data[idx] < 150) dark++;
    }
    if (dark > dateMaxDark) { dateMaxDark = dark; dateLineY = 100 + y; }
  }
  console.log('Date line y:', dateLineY);

  // scan for CERTIFICATE NO line (around x=50-250, y=300-400)
  const certData = ctx.getImageData(50, 300, 200, 100);
  let certLineY = -1;
  let certMaxDark = 0;
  for (let y = 0; y < 100; y++) {
    let dark = 0;
    for (let x = 0; x < 200; x++) {
      const idx = (y * 200 + x) * 4;
      if (certData.data[idx] < 150) dark++;
    }
    if (dark > certMaxDark) { certMaxDark = dark; certLineY = 300 + y; }
  }
  console.log('Cert line y:', certLineY);
})();
