const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(img, 0, 0);
  
  // Draw name
  ctx.font = 'italic bold 40px "Playfair Display", serif';
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('JOHN DOE', canvas.width / 2, 485); // Adjusted y, bottom baseline
  
  // Date
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('09 Aug 2026', 1000, 155); // Adjust x and y
  
  // Cert No
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('OMF-123456', 180, 360); // Adjust x and y
  
  fs.writeFileSync('public/test-out3.png', canvas.toBuffer());
  console.log('Done');
})();
