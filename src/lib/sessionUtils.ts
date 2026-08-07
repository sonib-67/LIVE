import { Session } from '../types';

export function getActiveClassInfo(session: Session, currentNowMs?: number) {
  const urls = session.playbackUrls && session.playbackUrls.length > 0 
    ? session.playbackUrls 
    : (session.playbackUrl ? [session.playbackUrl] : []);
    
  const nowMs = currentNowMs || Date.now();
  if (urls.length === 0) {
    return { dayIndex: 0, targetStartTimeMs: session.startTimeMs || nowMs, currentUrl: '', totalDays: 0, isDuringTraining: false, isEnded: true };
  }

  const startDate = new Date(session.startTimeMs || new Date(session.startTime).getTime());
  const now = new Date(nowMs);
  
  // Calculate midnight-based day difference in local time
  const startDayStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let dayIndex = Math.round((nowDayStart.getTime() - startDayStart.getTime()) / (1000 * 60 * 60 * 24));
  
  if (dayIndex < 0) dayIndex = 0;
  
  let isEnded = false;
  if (dayIndex >= urls.length) {
    // If we've passed the last day, but check if the last day's class is still running
    const lastDayStart = new Date(startDate);
    lastDayStart.setDate(lastDayStart.getDate() + urls.length - 1);
    const lastDayEndMs = lastDayStart.getTime() + (session.durationMinutes || 60) * 60000;
    
    if (nowMs > lastDayEndMs) {
      isEnded = true;
    }
    dayIndex = urls.length - 1; // point to the last valid index
  }
  
  // Calculate the target start time for the current dayIndex
  const targetStartTime = new Date(startDate);
  targetStartTime.setDate(targetStartTime.getDate() + dayIndex);
  
  const targetStartTimeMs = targetStartTime.getTime();
  const currentUrl = urls[dayIndex];
  const endMs = targetStartTimeMs + (session.durationMinutes || 60) * 60000;
  
  const isDuringTraining = nowMs >= targetStartTimeMs && nowMs <= endMs;
  
  return { 
    dayIndex, 
    targetStartTimeMs, 
    currentUrl, 
    totalDays: urls.length,
    isDuringTraining,
    isEnded,
    endMs
  };
}
