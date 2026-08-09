import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService, sessionService } from '../lib/services';
import { Registration, Session } from '../types';
import { motion } from 'framer-motion';
import { Award, Download, MailCheck, Loader2 } from 'lucide-react';
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
        setRegistration(reg);

        const sess = await sessionService.getSessionById(reg.sessionId);
        if (sess) {
          setSession(sess);
        }

        // Generate Certificate
        const dataUrl = await generateCertificate(reg.name);
        setCertUrl(dataUrl);
        setIsGenerating(false);
        
        // Auto-download once
        if (!sessionStorage.getItem(`cert_downloaded_${reg.id}`)) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `Certificate_${reg.name.replace(/\s+/g, '_')}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          sessionStorage.setItem(`cert_downloaded_${reg.id}`, 'true');
        }

        // Send Email if not already sent for completion
        if (!reg.completionEmailSent) {
          try {
            await fetch('/api/send-completion-email', {
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
            setEmailSent(true);
            // We should update Firestore that it was sent, to avoid spam
            await registrationService.updateRegistration(reg.id, { completionEmailSent: true });
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
        <div className="bg-slate-900 p-8 rounded-2xl border border-red-500/20 max-w-md text-center">
          <Award className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Certificate</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 rounded-lg font-bold">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a051b] flex items-center justify-center p-4 py-12 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl max-w-2xl w-full mx-auto">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Training Complete!</h2>
        <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Congratulations on successfully completing the <strong>{session?.title || 'Mushroom Farming'}</strong> training. We are proud of your dedication.
        </p>
        
        {isGenerating ? (
           <div className="flex flex-col items-center gap-3 mb-8">
             <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
             <p className="text-sm text-indigo-300">Generating your certificate...</p>
           </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {certUrl && (
              <div className="relative group max-w-[500px] w-full overflow-hidden rounded-xl border-4 border-white/10 shadow-2xl">
                 <img src={certUrl} alt="Certificate" className="w-full h-auto object-cover" />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={certUrl} download={`Certificate_${registration?.name.replace(/\s+/g, '_')}.png`} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg">
                       <Download className="w-5 h-5" /> Download Now
                    </a>
                 </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
               {certUrl && (
                  <a href={certUrl} download={`Certificate_${registration?.name.replace(/\s+/g, '_')}.png`} className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 w-full sm:w-auto">
                     <Download className="w-5 h-5" /> Download Certificate
                  </a>
               )}
            </div>
            
            {emailSent && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-lg">
                <MailCheck className="w-4 h-4" />
                Certificate successfully sent to your email!
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
