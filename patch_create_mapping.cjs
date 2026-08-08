const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const createOld = `{newSession.playbackUrls.map((url, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1.5 rounded-lg shrink-0">Day {idx + 1}</div>
                        <input
                          type="url"
                          required={idx === 0}
                          value={url}
                          onChange={e => {
                            const newUrls = [...newSession.playbackUrls];
                            newUrls[idx] = e.target.value;
                            setNewSession({...newSession, playbackUrls: newUrls});
                          }}
                          placeholder="https://example.com/stream.m3u8"
                          className="w-full bg-black/50 border border-white/10 dark:bg-black/50 dark:border-white/10 light:bg-slate-50 light:border-slate-300 light:text-slate-950 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                        {newSession.playbackUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = newSession.playbackUrls.filter((_, i) => i !== idx);
                              setNewSession({...newSession, playbackUrls: newUrls});
                            }}
                            className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}`;

const createNew = `{newSession.playbackUrls.map((url, idx) => (
                      <div key={idx} className="flex flex-col space-y-2 mb-2 p-3 bg-black/20 border border-white/5 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1.5 rounded-lg shrink-0">Day {idx + 1} URL</div>
                          <input
                            type="url"
                            required={idx === 0}
                            value={url}
                            onChange={e => {
                              const newUrls = [...newSession.playbackUrls];
                              newUrls[idx] = e.target.value;
                              setNewSession({...newSession, playbackUrls: newUrls});
                            }}
                            placeholder="https://example.com/stream.m3u8"
                            className="w-full bg-black/50 border border-white/10 dark:bg-black/50 dark:border-white/10 light:bg-slate-50 light:border-slate-300 light:text-slate-950 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                          />
                          {newSession.playbackUrls.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = newSession.playbackUrls.filter((_, i) => i !== idx);
                                const newDurs = (newSession.durationsMinutes || []).filter((_, i) => i !== idx);
                                setNewSession({...newSession, playbackUrls: newUrls, durationsMinutes: newDurs});
                              }}
                              className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 pl-[74px]">
                           <div className="flex items-center space-x-2">
                             <input 
                               type="number"
                               min="0"
                               className="w-16 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:border-purple-500"
                               value={Math.floor((newSession.durationsMinutes?.[idx] || 60) / 60)}
                               onChange={e => {
                                 const val = Math.max(0, parseInt(e.target.value) || 0);
                                 const newDurs = [...(newSession.durationsMinutes || newSession.playbackUrls.map(() => 60))];
                                 const currentMins = (newDurs[idx] || 60) % 60;
                                 newDurs[idx] = val * 60 + currentMins;
                                 setNewSession({...newSession, durationsMinutes: newDurs});
                               }}
                             />
                             <span className="text-xs text-white/40">hrs</span>
                             
                             <input 
                               type="number"
                               min="0"
                               max="59"
                               className="w-16 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:border-purple-500"
                               value={(newSession.durationsMinutes?.[idx] || 60) % 60}
                               onChange={e => {
                                 const val = Math.max(0, parseInt(e.target.value) || 0);
                                 const newDurs = [...(newSession.durationsMinutes || newSession.playbackUrls.map(() => 60))];
                                 const currentHrs = Math.floor((newDurs[idx] || 60) / 60);
                                 newDurs[idx] = currentHrs * 60 + val;
                                 setNewSession({...newSession, durationsMinutes: newDurs});
                               }}
                             />
                             <span className="text-xs text-white/40">min</span>
                           </div>
                        </div>
                      </div>
                    ))}`;

code = code.replace(createOld, createNew);

const editOld = `{editingSessionData.playbackUrls.map((url, idx) => (
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
                    ))}`;

const editNew = `{editingSessionData.playbackUrls.map((url, idx) => (
                      <div key={idx} className="flex flex-col space-y-2 mb-2 p-3 bg-black/20 border border-white/5 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1.5 rounded-lg shrink-0">Day {idx + 1} URL</div>
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
                                const newDurs = (editingSessionData.durationsMinutes || []).filter((_, i) => i !== idx);
                                setEditingSessionData({...editingSessionData, playbackUrls: newUrls, durationsMinutes: newDurs});
                              }}
                              className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 pl-[74px]">
                           <div className="flex items-center space-x-2">
                             <input 
                               type="number"
                               min="0"
                               className="w-16 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:border-purple-500"
                               value={Math.floor((editingSessionData.durationsMinutes?.[idx] || 60) / 60)}
                               onChange={e => {
                                 const val = Math.max(0, parseInt(e.target.value) || 0);
                                 const newDurs = [...(editingSessionData.durationsMinutes || editingSessionData.playbackUrls.map(() => 60))];
                                 const currentMins = (newDurs[idx] || 60) % 60;
                                 newDurs[idx] = val * 60 + currentMins;
                                 setEditingSessionData({...editingSessionData, durationsMinutes: newDurs});
                               }}
                             />
                             <span className="text-xs text-white/40">hrs</span>
                             
                             <input 
                               type="number"
                               min="0"
                               max="59"
                               className="w-16 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:border-purple-500"
                               value={(editingSessionData.durationsMinutes?.[idx] || 60) % 60}
                               onChange={e => {
                                 const val = Math.max(0, parseInt(e.target.value) || 0);
                                 const newDurs = [...(editingSessionData.durationsMinutes || editingSessionData.playbackUrls.map(() => 60))];
                                 const currentHrs = Math.floor((newDurs[idx] || 60) / 60);
                                 newDurs[idx] = currentHrs * 60 + val;
                                 setEditingSessionData({...editingSessionData, durationsMinutes: newDurs});
                               }}
                             />
                             <span className="text-xs text-white/40">min</span>
                           </div>
                        </div>
                      </div>
                    ))}`;

code = code.replace(editOld, editNew);

// Add the extra duration when pushing a new URL

code = code.replace(
  "setNewSession(prev => ({ ...prev, playbackUrls: [...prev.playbackUrls, ''] }))",
  "setNewSession(prev => ({ ...prev, playbackUrls: [...prev.playbackUrls, ''], durationsMinutes: [...(prev.durationsMinutes || prev.playbackUrls.map(() => 60)), 60] }))"
);

code = code.replace(
  "setEditingSessionData(prev => ({ ...prev, playbackUrls: [...prev.playbackUrls, ''] }))",
  "setEditingSessionData(prev => ({ ...prev, playbackUrls: [...prev.playbackUrls, ''], durationsMinutes: [...(prev.durationsMinutes || prev.playbackUrls.map(() => 60)), 60] }))"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
