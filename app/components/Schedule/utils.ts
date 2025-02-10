import { Show, TimeGroup } from '@/types';

export function groupShowsByTimeWindow(shows: Show[], formatTime: (iso: string) => string) {
  const groups: TimeGroup[] = [];
  let currentGroup: Show[] = [];
  let groupStartTime: Date | null = null;

  const sortedShows = [...shows].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  sortedShows.forEach((show) => {
    const showTime = new Date(show.time);
    
    if (!groupStartTime) {
      groupStartTime = showTime;
      currentGroup = [show];
    } else {
      const timeDiff = (showTime.getTime() - groupStartTime.getTime()) / (1000 * 60);
      
      if (timeDiff <= 30) {
        currentGroup.push(show);
      } else {
        groups.push({
          startTime: formatTime(groupStartTime.toISOString()),
          endTime: currentGroup.length > 1 
            ? formatTime(currentGroup[currentGroup.length - 1].time)
            : formatTime(groupStartTime.toISOString()),
          shows: currentGroup
        });
        groupStartTime = showTime;
        currentGroup = [show];
      }
    }
  });

  if (currentGroup.length > 0 && groupStartTime) {
    groups.push({
      startTime: formatTime(groupStartTime.toISOString()),
      endTime: currentGroup.length > 1 
        ? formatTime(currentGroup[currentGroup.length - 1].time)
        : formatTime(groupStartTime.toISOString()),
      shows: currentGroup
    });
  }

  return groups;
}

export function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
} 