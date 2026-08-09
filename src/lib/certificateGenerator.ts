export const generateCertificate = async (name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas not supported'));
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/organicsonib491.png';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.font = 'italic bold 90px "Playfair Display", serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Changed from 690 to 760 based on typical certificate spacing.
      // Wait, let's look at the image height: 1545. "THIS IS TO CERTIFY THAT" is in the middle.
      // 1545 / 2 = 772. "THIS IS TO CERTIFY THAT" is probably at 650.
      // The dotted line is around 850.
      // I will put the name at 760.
      ctx.fillText(name.toUpperCase(), canvas.width / 2, 760);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};
