'use client';

import { Show, TimeGroup } from '@/types';

type Props = {
  timeGroup: TimeGroup;
  isAfterMidnight: boolean;
  isUpNext: boolean;
  onToggleShow: (show: Show) => void;
  isSelected: (show: Show) => boolean;
};

export function MobileTimeSlot({ timeGroup, isAfterMidnight, isUpNext, onToggleShow, isSelected }: Props) {
  const { startTime, endTime, shows } = timeGroup;
  const timeRange = startTime === endTime ? startTime : `${startTime} - ${endTime}`;

  return (
    <div className={`
      p-4 rounded-lg mb-4 border card
      ${isAfterMidnight ? 'bg-card-background/5' : ''}
      ${isUpNext ? 'bg-brand-secondary/5 border-brand-secondary/20' : ''}
    `}>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-card-border">
        <div className="text-xl font-bold text-foreground">
          {timeRange}
          {isAfterMidnight && ' *'}
          {isUpNext && ' 🔜'}
        </div>
      </div>
      <div className="space-y-4">
        {shows?.map((show) => (
          <button
            key={`${show.time}-${show.band}`}
            className="w-full flex items-start gap-3 text-left hover:bg-card-background/5 p-3 rounded-lg transition-colors"
            onClick={() => onToggleShow(show)}
          >
            <div 
              className="mt-1 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={isSelected(show)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleShow(show);
                }}
                className="h-5 w-5 text-brand-primary rounded border-card-border focus:ring-brand-primary"
              />
            </div>
            <div className="flex-grow">
              <div className="font-semibold text-base text-foreground mb-1">
                {show.band}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-foreground/60">
                  {show.location}
                </div>
                {show.time !== startTime && (
                  <div className="text-xs text-foreground/40">
                    {new Date(show.time).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 