const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(img, 0, 0);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.font = '12px Arial';
    ctx.fillText(y.toString(), 10, y);
  }
  for (let x = 0; x < canvas.width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  fs.writeFileSync('public/grid_test.png', canvas.toBuffer());
  console.log('Done');
})();
