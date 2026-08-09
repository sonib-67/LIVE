const { createCanvas, loadImage } = require('canvas');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  const imgData = ctx.getImageData(canvas.width / 2, 400, 1, 200);
  for (let i = 0; i < 200; i++) {
    const r = imgData.data[i * 4];
    const g = imgData.data[i * 4 + 1];
    const b = imgData.data[i * 4 + 2];
    if (r < 150 && g < 150 && b < 150) {
      console.log('Dark pixel found at y =', 400 + i, 'rgb:', r, g, b);
    }
  }
})();
