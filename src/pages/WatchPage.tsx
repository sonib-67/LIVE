import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { videoService } from '../lib/videoService';
import { VideoAccess } from '../types/video';
import { Loader2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function WatchPage() {
  const { accessId } = useParams<{ accessId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [access, setAccess] = useState<VideoAccess | null>(null);

  useEffect(() => {
    const initVideo = async () => {
      if (!accessId) {
        setError('Invalid access token.');
        setLoading(false);
        return;
      }

      try {
        const acc = await videoService.getAccessById(accessId);
        
        if (!acc) {
          setError('Access record not found.');
          setLoading(false);
          return;
        }

        if (!acc.isActive) {
          setError('This video access has been deactivated by the admin.');
          setLoading(false);
          return;
        }

        if (acc.viewsCount >= acc.viewsLimit) {
          setError(`You have reached the maximum viewing limit (${acc.viewsLimit} views) for this video.`);
          setLoading(false);
          return;
        }

        // Increment view count on load
        await videoService.incrementViewCount(accessId, acc.viewsCount);
        
        // Update local state to reflect new count
        setAccess({
          ...acc,
          viewsCount: acc.viewsCount + 1
        });
        
      } catch (err) {
        console.error('Failed to load video:', err);
        setError('Failed to load secure video stream.');
      } finally {
        setLoading(false);
      }
    };

    initVideo();

    // Prevent context menu (right click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [accessId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 flex-col gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 animate-pulse text-sm">Verifying secure access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-red-500/20 rounded-2xl p-8 backdrop-blur-xl text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Blocked</h2>
          <p className="text-slate-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!access) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="bg-[#0a0a0f] border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-semibold">{access.videoTitle}</h1>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          <AlertCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-medium tracking-wide">
            View {access.viewsCount} of {access.viewsLimit}
          </span>
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col justify-center relative p-4 lg:p-8">
        <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative border border-white/5">
          <ReactPlayer
            url={access.m3u8Url}
            width="100%"
            height="100%"
            controls={true}
            playing={false}
            config={{
              file: {
                forceHLS: true,
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
          {/* Watermark to deter screen recording */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="transform -rotate-45 text-white/50 text-xl font-mono whitespace-nowrap">
              {access.userName} • {access.userEmail}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 text-center text-slate-500 text-xs">
        Secure HLS Stream • Protected by Access Control
      </div>
    </div>
  );
}
