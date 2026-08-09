const { createCanvas, loadImage } = require('canvas');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  // scan for main line (around x=canvas.width/2, y=480-600)
  const nameData = ctx.getImageData(canvas.width/2, 480, 1, 120);
  for (let i = 0; i < 120; i++) {
    const r = nameData.data[i * 4];
    const g = nameData.data[i * 4 + 1];
    const b = nameData.data[i * 4 + 2];
    if (r < 200 && g < 200 && b < 200) { // even looser threshold
      console.log('Name line found at y =', 480 + i, 'rgb:', r, g, b);
    }
  }
})();
