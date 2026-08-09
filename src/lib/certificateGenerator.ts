export const generateCertificate = async (name: string, dateStr: string, certNo: string): Promise<string> => {
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
      ctx.font = 'italic bold 34px "Playfair Display", serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(name.toUpperCase(), canvas.width / 2, 465);
      
      // Date
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(dateStr, 990, 150);
      
      // Certificate No
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(certNo, 155, 345);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};
