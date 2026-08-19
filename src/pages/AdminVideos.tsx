import React, { useState, useEffect } from 'react';
import { videoService } from '../lib/videoService';
import { M3u8Video, VideoInvite } from '../types/video';
import { Trash2, Copy, Plus, Video, PlayCircle, Loader2 } from 'lucide-react';

export default function AdminVideos() {
  const [videos, setVideos] = useState<M3u8Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [m3u8Url, setM3u8Url] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [invites, setInvites] = useState<{ [videoId: string]: string }>({});

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const vids = await videoService.getVideos();
      setVideos(vids);
      
      // Load or generate invites for all videos
      const invitesMap: { [videoId: string]: string } = {};
      for (const v of vids) {
        let invite = await videoService.getLatestUnusedInvite(v.id);
        if (!invite) {
          invite = await videoService.generateInvite(v.id);
        }
        invitesMap[v.id] = `${window.location.origin}/invite/${invite.id}`;
      }
      setInvites(invitesMap);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !m3u8Url) return;
    
    setIsAdding(true);
    try {
      await videoService.addVideo(title, m3u8Url);
      setTitle('');
      setM3u8Url('');
      await loadVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await videoService.deleteVideo(id);
      await loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Invite link copied! Send this to the customer.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
          <Video className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Video Manager</h1>
          <p className="text-slate-400 text-sm">Manage m3u8 videos and secure share links</p>
        </div>
      </div>

      <form onSubmit={handleAddVideo} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Video Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mushroom Cultivation Day 1"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">m3u8 URL</label>
            <input
              type="url"
              required
              value={m3u8Url}
              onChange={(e) => setM3u8Url(e.target.value)}
              placeholder="https://.../playlist.m3u8"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 font-medium"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Add Video
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {videos.map(video => (
          <div key={video.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-400" />
                {video.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 truncate max-w-lg" title={video.m3u8Url}>{video.m3u8Url}</p>
            </div>
            
            <div className="flex flex-col gap-2 min-w-[300px]">
              <label className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Unique Invite Link (1-Time Use)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={invites[video.id] || 'Generating...'} 
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono outline-none"
                />
                <button
                  onClick={() => copyToClipboard(invites[video.id])}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-2 rounded-lg transition-colors"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500">When user logs in, this link will expire and a new one will auto-generate here.</p>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => handleDelete(video.id)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete Video"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <Video className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No videos added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
