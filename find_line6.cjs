const { createCanvas, loadImage } = require('canvas');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  const dateData = ctx.getImageData(900, 100, 200, 100);
  let lineY = -1;
  let maxDarkPixels = 0;
  for (let y = 0; y < 100; y++) {
    let darkPixels = 0;
    for (let x = 0; x < 200; x++) {
      const idx = (y * 200 + x) * 4;
      const r = dateData.data[idx];
      const g = dateData.data[idx + 1];
      const b = dateData.data[idx + 2];
      if (r < 200 && g < 200 && b < 200) {
        darkPixels++;
      }
    }
    if (darkPixels > maxDarkPixels) {
      maxDarkPixels = darkPixels;
      lineY = 100 + y;
    }
  }
  console.log('Most horizontal line-like feature near Date at y =', lineY, 'with', maxDarkPixels, 'dark pixels');
  
  const certData = ctx.getImageData(50, 300, 250, 100);
  lineY = -1;
  maxDarkPixels = 0;
  for (let y = 0; y < 100; y++) {
    let darkPixels = 0;
    for (let x = 0; x < 250; x++) {
      const idx = (y * 250 + x) * 4;
      const r = certData.data[idx];
      const g = certData.data[idx + 1];
      const b = certData.data[idx + 2];
      if (r < 200 && g < 200 && b < 200) {
        darkPixels++;
      }
    }
    if (darkPixels > maxDarkPixels) {
      maxDarkPixels = darkPixels;
      lineY = 300 + y;
    }
  }
  console.log('Most horizontal line-like feature near Cert at y =', lineY, 'with', maxDarkPixels, 'dark pixels');
})();
