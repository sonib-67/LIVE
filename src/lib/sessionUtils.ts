import { Session } from '../types';

export function getActiveClassInfo(session: Session, currentNowMs?: number) {
  const urls = session.playbackUrls && session.playbackUrls.length > 0 
    ? session.playbackUrls 
    : (session.playbackUrl ? [session.playbackUrl] : []);
    
  const nowMs = currentNowMs || Date.now();

  if (urls.length === 0) {
    return { dayIndex: 0, targetStartTimeMs: session.startTimeMs || nowMs, currentUrl: '', totalDays: 0, isDuringTraining: false, isTodayCompleted: false, isEnded: true, endMs: nowMs };
  }

  const startDate = new Date(session.startTimeMs || new Date(session.startTime).getTime());
  const now = new Date(nowMs);
  
  const startDayStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let dayIndex = Math.round((nowDayStart.getTime() - startDayStart.getTime()) / (1000 * 60 * 60 * 24));
  
  if (dayIndex < 0) dayIndex = 0;

  const effectiveDayIndex = Math.min(dayIndex, urls.length - 1);
  const targetStartTime = new Date(startDate);
  targetStartTime.setDate(targetStartTime.getDate() + effectiveDayIndex);
  
  const targetStartTimeMs = targetStartTime.getTime();
  const currentUrl = urls[effectiveDayIndex];
  const dayTitle = (session.dayTitles && session.dayTitles[effectiveDayIndex]) 
    ? session.dayTitles[effectiveDayIndex] 
    : `Day ${effectiveDayIndex + 1}`;
  const currentDurationMinutes = (session.durationsMinutes && session.durationsMinutes[effectiveDayIndex] !== undefined) 
    ? session.durationsMinutes[effectiveDayIndex] 
    : (session.durationMinutes || 60);
  const endMs = targetStartTimeMs + currentDurationMinutes * 60000;
  
  let isEnded = false;
  let isTodayCompleted = false;
  let isDuringTraining = false;

  if (dayIndex >= urls.length) {
     isEnded = true;
  } else {
     if (nowMs >= targetStartTimeMs && nowMs <= endMs) {
       isDuringTraining = true;
     } else if (nowMs > endMs) {
       if (dayIndex === urls.length - 1) {
         isEnded = true;
       } else {
         isTodayCompleted = true;
       }
     }
  }

  return { 
    dayIndex: effectiveDayIndex,
    dayTitle, 
    targetStartTimeMs, 
    currentUrl, 
    totalDays: urls.length,
    isDuringTraining,
    isTodayCompleted,
    isEnded,
    endMs
  };
}
