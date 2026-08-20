import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoService } from '../lib/videoService';
import { M3u8Video, VideoAccess } from '../types/video';
import { Trash2, Copy, Plus, Video, PlayCircle, Loader2, ArrowLeft, Users, UserX } from 'lucide-react';

export default function AdminVideos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<M3u8Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [m3u8Url, setM3u8Url] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [invites, setInvites] = useState<{ [videoId: string]: string }>({});
  const [accessRecords, setAccessRecords] = useState<{ [videoId: string]: VideoAccess[] }>({});

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const vids = await videoService.getVideos();
      setVideos(vids);
      
      const invitesMap: { [videoId: string]: string } = {};
      const accessMap: { [videoId: string]: VideoAccess[] } = {};
      
      for (const v of vids) {
        let invite = await videoService.getLatestUnusedInvite(v.id);
        if (!invite) {
          invite = await videoService.generateInvite(v.id);
        }
        invitesMap[v.id] = `${window.location.origin}/invite/${invite.id}`;
        
        // Fetch users who logged into this video
        const records = await videoService.getAccessesByVideoId(v.id);
        // Sort by newest first
        accessMap[v.id] = records.sort((a, b) => b.createdAt - a.createdAt);
      }
      
      setInvites(invitesMap);
      setAccessRecords(accessMap);
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

  const handleRevokeAccess = async (accessId: string) => {
    if (!confirm('Are you sure you want to revoke access for this user? They will no longer be able to watch this video.')) return;
    
    try {
      await videoService.deleteAccess(accessId);
      await loadVideos(); // Refresh list
    } catch (err) {
      console.error('Error revoking access:', err);
      alert('Failed to revoke access');
    }
  };

  const copyToClipboard = async (text: string, videoId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Immediately generate a new invite so the admin has a fresh one
      const newInvite = await videoService.generateInvite(videoId);
      setInvites(prev => ({
        ...prev,
        [videoId]: `${window.location.origin}/invite/${newInvite.id}`
      }));
      
      alert('Invite link copied! A fresh new link has been auto-generated for the next user.');
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Failed to copy link.');
    }
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
      <button 
        onClick={() => navigate('/787941/dashboard')}
        className="flex items-center gap-2 text-slate-400 light:text-slate-500 hover:text-white light:hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500/20 light:bg-indigo-100 rounded-xl flex items-center justify-center">
          <Video className="w-5 h-5 text-indigo-400 light:text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">Video Manager</h1>
          <p className="text-slate-400 light:text-slate-500 text-sm">Manage m3u8 videos and secure share links</p>
        </div>
      </div>

      <form onSubmit={handleAddVideo} className="bg-white/5 border border-white/10 light:bg-white light:border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-white light:text-slate-900 mb-4">Add New Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 light:text-slate-700 mb-2">Video Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mushroom Cultivation Day 1"
              className="w-full bg-black/50 border border-white/10 light:bg-slate-50 light:border-slate-300 rounded-lg px-4 py-2.5 text-white light:text-slate-900 focus:outline-none focus:border-indigo-500 light:focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 light:text-slate-700 mb-2">Video URL (m3u8 or Google Drive)</label>
            <input
              type="url"
              required
              value={m3u8Url}
              onChange={(e) => setM3u8Url(e.target.value)}
              placeholder="https://.../playlist.m3u8 OR Google Drive link"
              className="w-full bg-black/50 border border-white/10 light:bg-slate-50 light:border-slate-300 rounded-lg px-4 py-2.5 text-white light:text-slate-900 focus:outline-none focus:border-indigo-500 light:focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 light:bg-indigo-600 light:hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 font-medium"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Add Video
        </button>
      </form>

      <div className="grid grid-cols-1 gap-6">
        {videos.map(video => (
          <div key={video.id} className="bg-white/5 border border-white/10 light:bg-white light:border-slate-200 rounded-xl overflow-hidden shadow-sm transition-colors">
            {/* Header Section */}
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 light:border-slate-100">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white light:text-slate-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-400 light:text-indigo-600" />
                  {video.title}
                </h3>
                <p className="text-xs text-slate-500 light:text-slate-500 mt-1 truncate max-w-lg" title={video.m3u8Url}>{video.m3u8Url}</p>
              </div>
              
              <div className="flex flex-col gap-2 min-w-[300px]">
                <label className="text-xs font-medium text-emerald-400 light:text-emerald-600 uppercase tracking-wider">Unique Invite Link (1-Time Use)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={invites[video.id] || 'Generating...'} 
                    className="flex-1 bg-black/50 border border-white/10 light:bg-slate-50 light:border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-300 light:text-slate-600 font-mono outline-none transition-colors"
                  />
                  <button
                    onClick={() => copyToClipboard(invites[video.id], video.id)}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 light:bg-slate-100 light:hover:bg-slate-200 light:border-slate-300 text-white light:text-slate-700 px-3 py-2 rounded-lg transition-colors"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 light:text-slate-500">When you copy, a new link auto-generates here.</p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 light:text-rose-600 light:hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Video"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Registered Users Section */}
            <div className="p-5 bg-black/20 light:bg-slate-50/50">
              <h4 className="text-sm font-semibold text-slate-300 light:text-slate-700 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" />
                Registered Users ({accessRecords[video.id]?.length || 0})
              </h4>
              
              {accessRecords[video.id] && accessRecords[video.id].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {accessRecords[video.id].map(record => (
                    <div key={record.id} className="bg-white/5 border border-white/10 light:bg-white light:border-slate-200 p-3 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white light:text-slate-800">{record.userName}</p>
                        <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">{record.userEmail}</p>
                        <p className="text-xs text-slate-400 light:text-slate-500 font-mono mt-0.5">{record.userPhone}</p>
                        <p className="text-[10px] text-slate-500 light:text-slate-400 mt-1">
                          Views: {record.viewsCount} • Joined: {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 light:text-slate-500 light:hover:text-rose-600 light:hover:bg-rose-50 rounded transition-colors"
                        title="Revoke Access"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 light:text-slate-400">No users have registered for this video yet.</p>
              )}
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="text-center py-12 bg-white/5 border border-white/10 light:bg-slate-50 light:border-slate-200 border-dashed rounded-xl">
            <Video className="w-12 h-12 text-slate-600 light:text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 light:text-slate-500">No videos added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
