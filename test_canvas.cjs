const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(img, 0, 0);
  
  // Draw name
  ctx.font = 'italic bold 48px "Playfair Display", serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JOHN DOE', canvas.width / 2, 530);
  
  // Date
  ctx.font = 'bold 24px Arial';
  ctx.fillText('09 Aug 2026', 970, 150);
  
  // Cert No
  ctx.fillText('OMF-123456', 200, 360);
  
  fs.writeFileSync('public/test-out.png', canvas.toBuffer());
  console.log('Done');
})();
