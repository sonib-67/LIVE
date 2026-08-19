import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../lib/videoService';
import { VideoInvite } from '../types/video';
import { Video, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoInvitePage() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invite, setInvite] = useState<VideoInvite | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkInvite = async () => {
      if (!inviteId) {
        setError('Invalid link.');
        setLoading(false);
        return;
      }

      try {
        const inv = await videoService.getInviteById(inviteId);
        if (!inv) {
          setError('Invite link not found. Please contact support.');
        } else if (inv.status === 'used') {
          setError('This invite link has already been used and is now expired.');
        } else {
          setInvite(inv);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load invite details.');
      } finally {
        setLoading(false);
      }
    };

    checkInvite();
  }, [inviteId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite || !inviteId) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Need to fetch video details to store in access
      // For a robust system we'd get this safely, but we can assume video exists
      const { collection, doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const videoDoc = await getDoc(doc(db, 'videos', invite.videoId));
      if (!videoDoc.exists()) {
        throw new Error('Video no longer exists.');
      }
      const videoData = videoDoc.data();

      // Consume invite and create access
      const access = await videoService.consumeInvite(
        inviteId,
        invite.videoId,
        videoData.title,
        videoData.m3u8Url,
        name,
        email,
        phone
      );

      // Save accessId to localStorage so they don't have to login again on this device
      localStorage.setItem(`video_access_${invite.videoId}`, access.id);
      
      // Redirect to watch page
      navigate(`/watch/${access.id}`);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl text-center">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative z-10 shadow-2xl"
      >
        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
          <Video className="w-8 h-8 text-indigo-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Secure Video Access</h1>
        <p className="text-slate-400 text-center text-sm mb-8">
          Please enter your details to access the protected video stream. This link will expire after registration.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">WhatsApp Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="+91..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register & Watch'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
