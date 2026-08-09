const { createCanvas, loadImage } = require('canvas');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  const nameData = ctx.getImageData(canvas.width/2 - 200, 470, 400, 50);
  let lineY = -1;
  let maxDarkPixels = 0;
  for (let y = 0; y < 50; y++) {
    let darkPixels = 0;
    for (let x = 0; x < 400; x++) {
      const idx = (y * 400 + x) * 4;
      const r = nameData.data[idx];
      const g = nameData.data[idx + 1];
      const b = nameData.data[idx + 2];
      if (r < 200 && g < 200 && b < 200) {
        darkPixels++;
      }
    }
    if (darkPixels > maxDarkPixels) {
      maxDarkPixels = darkPixels;
      lineY = 470 + y;
    }
  }
  console.log('Most horizontal line-like feature at y =', lineY, 'with', maxDarkPixels, 'dark pixels');
})();
