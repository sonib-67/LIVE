const fs = require('fs');
const content = `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService, sessionService } from '../lib/services';
import { Registration, Session } from '../types';
import { motion } from 'framer-motion';
import { Award, Download, MailCheck, Loader2, Globe, MessageCircle } from 'lucide-react';
import { generateCertificate } from '../lib/certificateGenerator';

export default function CertificatePage() {
  const { joinToken } = useParams<{ joinToken: string }>();
  const navigate = useNavigate();
  
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [certUrl, setCertUrl] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!joinToken) return;
      try {
        const reg = await registrationService.getRegistrationByToken(joinToken);
        if (!reg) {
          setError('Registration not found');
          setIsGenerating(false);
          return;
        }
        
        let certNo = reg.certificateNo;
        let certDate = reg.certificateIssuedAt;
        let needsUpdate = false;
        
        if (!certNo) {
          certNo = 'OMF' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          needsUpdate = true;
        }
        if (!certDate) {
          certDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await registrationService.updateRegistration(reg.id, { certificateNo: certNo, certificateIssuedAt: certDate });
          reg.certificateNo = certNo;
          reg.certificateIssuedAt = certDate;
        }
        
        setRegistration(reg);

        const sess = await sessionService.getSessionById(reg.sessionId);
        if (sess) {
          setSession(sess);
        }

        // Generate Certificate
        const dataUrl = await generateCertificate(reg.name, certDate, certNo);
        setCertUrl(dataUrl);
        setIsGenerating(false);
        
        // Auto-download once
        if (!sessionStorage.getItem(\`cert_downloaded_\${reg.id}\`)) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = \`Certificate_\${reg.name.replace(/\\s+/g, '_')}.png\`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          sessionStorage.setItem(\`cert_downloaded_\${reg.id}\`, 'true');
        }

        // Send Email if not already sent for completion
        if (!reg.completionEmailSent) {
          try {
            const res = await fetch('/api/send-completion-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                toEmail: reg.email,
                attendeeName: reg.name,
                attendeeMobile: reg.mobile,
                sessionTitle: sess?.title || 'Mushroom Farming',
                certificateDataUrl: dataUrl
              })
            });
            if (res.ok) {
              setEmailSent(true);
              await registrationService.updateRegistration(reg.id, { completionEmailSent: true });
            } else {
               console.error('Failed to send completion email via API', await res.text());
            }
          } catch(e) {
            console.error('Failed to send completion email', e);
          }
        } else {
          setEmailSent(true);
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred');
        setIsGenerating(false);
      }
    };
    
    fetchData();
  }, [joinToken]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a051b] flex items-center justify-center text-white p-4">
        <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-red-500/20 max-w-md w-full text-center">
          <Award className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Certificate</h2>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 rounded-lg font-bold">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a051b] flex items-center justify-center p-4 py-8 sm:py-12 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 sm:p-8 bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl max-w-3xl w-full mx-auto">
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Award className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">Training Successfully Completed!</h2>
        
        <div className="text-slate-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto space-y-3 sm:space-y-4 leading-relaxed">
          <p className="text-base sm:text-lg font-semibold text-white">Congratulations!</p>
          <p>You have successfully completed your Mushroom Training.</p>
          <p>Your dedication, hard work, and commitment to learning are truly commendable.</p>
          <p>This is not just the completion of a course — it’s the beginning of your journey toward success.</p>
          <p>We wish you great success in your mushroom farming journey.</p>
          <p className="text-green-400 font-semibold pt-1 sm:pt-2 text-xs sm:text-sm">Keep Learning • Keep Growing • Keep Succeeding!</p>
          <p className="text-slate-400 italic text-xs sm:text-sm">— Organic Mushroom Farm</p>
        </div>
        
        {isGenerating ? (
           <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8">
             <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 animate-spin" />
             <p className="text-xs sm:text-sm text-indigo-300">Generating your certificate...</p>
           </div>
        ) : (
          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {certUrl && (
              <div className="relative group max-w-[600px] w-full overflow-hidden rounded-xl border-2 sm:border-4 border-white/10 shadow-2xl">
                 <img src={certUrl} alt="Certificate" className="w-full h-auto object-cover" />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={certUrl} download={\`Certificate_\${registration?.name.replace(/\\s+/g, '_')}.png\`} className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg text-sm sm:text-base">
                       <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Download Now
                    </a>
                 </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
               {certUrl && (
                  <a href={certUrl} download={\`Certificate_\${registration?.name.replace(/\\s+/g, '_')}.png\`} className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 w-full sm:w-auto text-sm sm:text-base">
                     <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Download Certificate
                  </a>
               )}
            </div>
            
            {emailSent && (
              <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm bg-green-500/10 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-center justify-center">
                <MailCheck className="w-4 h-4 shrink-0" />
                Certificate successfully sent to your email!
              </div>
            )}
            
            <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                <a href="https://wa.me/919203544140" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-colors text-xs sm:text-sm">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>WhatsApp Support (9203544140)</span>
                </a>
                <a href="https://organicmushroomsfarm.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors text-xs sm:text-sm">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>organicmushroomsfarm.com</span>
                </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/CertificatePage.tsx', content);
