const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

(async () => {
  const img = await loadImage('public/oldnew.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(img, 0, 0);
  
  // Name
  ctx.font = 'italic bold 34px "Playfair Display", serif';
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('JOHN DOE', canvas.width / 2, 465);
  
  // Date
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('09 Aug 2026', 995, 185); 
  
  // Cert No
  ctx.fillText('OMF-123456', 155, 380); 
  
  fs.writeFileSync('public/test-out4.png', canvas.toBuffer());
  console.log('Done');
})();
