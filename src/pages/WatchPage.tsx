import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Hls from 'hls.js';
import { videoService } from '../lib/videoService';
import { VideoAccess } from '../types/video';
import { Loader2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function WatchPage() {
  const { accessId } = useParams<{ accessId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playerError, setPlayerError] = useState(false);
  const [access, setAccess] = useState<VideoAccess | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          setError('Access record not found. Your access may have been revoked.');
          setLoading(false);
          return;
        }

        if (!acc.isActive) {
          setError('This video access has been deactivated by the admin.');
          setLoading(false);
          return;
        }

        // Just log the view count internally, no limits enforced.
        await videoService.incrementViewCount(accessId, acc.viewsCount);
        
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

  useEffect(() => {
    let hls: Hls | null = null;

    if (access && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({
          maxMaxBufferLength: 30,
        });
        
        hls.loadSource(access.m3u8Url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log('Auto-play prevented:', e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error encountered, try to recover');
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error encountered, try to recover');
                hls?.recoverMediaError();
                break;
              default:
                hls?.destroy();
                setPlayerError(true);
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for native HLS (Safari)
        video.src = access.m3u8Url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.log('Auto-play prevented:', e));
        });
        video.addEventListener('error', () => {
           setPlayerError(true);
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [access]);

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
            Unlimited Views
          </span>
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col justify-center relative p-4 lg:p-8">
        <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative border border-white/5">
          {playerError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-center p-6">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Stream Load Error</h3>
              <p className="text-slate-400 text-sm max-w-md">
                The video stream could not be loaded. This might be because the link is invalid, the stream is offline, or the hosting server does not allow playback (CORS issue).
              </p>
            </div>
          ) : (
            <video 
              ref={videoRef}
              controls 
              controlsList="nodownload"
              className="w-full h-full object-contain"
              playsInline
            />
          )}
          {/* Watermark to deter screen recording */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="transform -rotate-45 text-white/50 text-xl font-mono whitespace-nowrap">
              {access.userName} • {access.userEmail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
