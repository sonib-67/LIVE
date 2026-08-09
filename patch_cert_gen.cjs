const fs = require('fs');
let code = fs.readFileSync('src/lib/certificateGenerator.ts', 'utf8');
code = `export const generateCertificate = async (name: string, dateStr: string, certNo: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas not supported'));
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/oldnew.png';
    
    img.onload = () => {
      canvas.width = img.width; // 1181
      canvas.height = img.height; // 912
      ctx.drawImage(img, 0, 0);
      
      // Name
      ctx.font = 'italic bold 48px "Playfair Display", serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name.toUpperCase(), canvas.width / 2, 480);
      
      // Date
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText(dateStr, 980, 160);
      
      // Certificate No
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText(certNo, 180, 340);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};
`;
fs.writeFileSync('src/lib/certificateGenerator.ts', code);
