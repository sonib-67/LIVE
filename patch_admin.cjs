const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// 1. Add playbackUrls to state type and initial value
code = code.replace(
  "playbackUrl: string;\n    videoSourceType: 'upload' | 'embed' | 'hls';\n  }>({\n    startTime: '',\n    durationMinutes: 60,\n    playbackUrl: '',\n    videoSourceType: 'upload'\n  });",
  "playbackUrl: string;\n    playbackUrls: string[];\n    videoSourceType: 'upload' | 'embed' | 'hls';\n  }>({\n    startTime: '',\n    durationMinutes: 60,\n    playbackUrl: '',\n    playbackUrls: [''],\n    videoSourceType: 'upload'\n  });"
);

// 2. Initialize in onClick handler
code = code.replace(
  "playbackUrl: selectedSession.playbackUrl,\n                          videoSourceType: selectedSession.videoSourceType || 'upload'\n                        });",
  "playbackUrl: selectedSession.playbackUrl,\n                          playbackUrls: selectedSession.playbackUrls && selectedSession.playbackUrls.length > 0 ? selectedSession.playbackUrls : [selectedSession.playbackUrl || ''],\n                          videoSourceType: selectedSession.videoSourceType || 'upload'\n                        });"
);

// 3. Update handleUpdateSession
code = code.replace(
  "startTimeMs: new Date(editingSessionData.startTime).getTime(),\n        durationMinutes: editingSessionData.durationMinutes,\n        playbackUrl: editingSessionData.playbackUrl,\n        videoSourceType: editingSessionData.videoSourceType",
  "startTimeMs: new Date(editingSessionData.startTime).getTime(),\n        durationMinutes: editingSessionData.durationMinutes,\n        playbackUrl: editingSessionData.videoSourceType === 'hls' ? editingSessionData.playbackUrls[0] : editingSessionData.playbackUrl,\n        playbackUrls: editingSessionData.videoSourceType === 'hls' ? editingSessionData.playbackUrls.filter(u => u.trim() !== '') : [],\n        videoSourceType: editingSessionData.videoSourceType"
);

// 4. Update the render
const oldRender = `                {editingSessionData.videoSourceType === 'hls' && (
                  <div>
                    <label className="block text-xs text-white/50 dark:text-white/50 light:text-slate-600 mb-1">HLS Playlist URL (.m3u8)</label>
                    <input
                      type="url"
                      required
                      value={editingSessionData.playbackUrl}
                      onChange={e => setEditingSessionData({...editingSessionData, playbackUrl: e.target.value})}
                      placeholder="https://example.com/stream.m3u8"
                      className="w-full bg-black/50 border border-white/10 dark:bg-black/50 dark:border-white/10 light:bg-slate-50 light:border-slate-300 light:text-slate-950 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    />
                  </div>
                )}`;

const newRender = `                {editingSessionData.videoSourceType === 'hls' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm text-white/60 dark:text-white/60 light:text-slate-600">HLS Playlist URLs (.m3u8)</label>
                      {editingSessionData.playbackUrls.length < 5 && (
                        <button
                          type="button"
                          onClick={() => setEditingSessionData(prev => ({ ...prev, playbackUrls: [...prev.playbackUrls, ''] }))}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Day {editingSessionData.playbackUrls.length + 1}</span>
                        </button>
                      )}
                    </div>
                    {editingSessionData.playbackUrls.map((url, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1.5 rounded-lg shrink-0">Day {idx + 1}</div>
                        <input
                          type="url"
                          required={idx === 0}
                          value={url}
                          onChange={e => {
                            const newUrls = [...editingSessionData.playbackUrls];
                            newUrls[idx] = e.target.value;
                            setEditingSessionData({...editingSessionData, playbackUrls: newUrls});
                          }}
                          placeholder="https://example.com/stream.m3u8"
                          className="w-full bg-black/50 border border-white/10 dark:bg-black/50 dark:border-white/10 light:bg-slate-50 light:border-slate-300 light:text-slate-950 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                        {editingSessionData.playbackUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = editingSessionData.playbackUrls.filter((_, i) => i !== idx);
                              setEditingSessionData({...editingSessionData, playbackUrls: newUrls});
                            }}
                            className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
