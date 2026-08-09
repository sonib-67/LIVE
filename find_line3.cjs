const { createCanvas, loadImage } = require('canvas');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  // scan for DATE OF ISSUE line (around x=995, y=100-200)
  const dateData = ctx.getImageData(995, 120, 1, 80);
  for (let i = 0; i < 80; i++) {
    const r = dateData.data[i * 4];
    const g = dateData.data[i * 4 + 1];
    const b = dateData.data[i * 4 + 2];
    if (r < 180 && g < 180 && b < 180) { // looser threshold
      console.log('Date line found at y =', 120 + i, 'rgb:', r, g, b);
    }
  }

  // scan for main line (around x=canvas.width/2, y=450-550)
  const nameData = ctx.getImageData(canvas.width/2, 450, 1, 100);
  for (let i = 0; i < 100; i++) {
    const r = nameData.data[i * 4];
    const g = nameData.data[i * 4 + 1];
    const b = nameData.data[i * 4 + 2];
    if (r < 180 && g < 180 && b < 180) { // looser threshold
      console.log('Name line found at y =', 450 + i, 'rgb:', r, g, b);
    }
  }
})();
