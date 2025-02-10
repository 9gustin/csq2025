'use client';

type Show = {
  band: string;
  time: string;
  location: string;
};

type TimeGroup = {
  startTime: string;
  endTime: string;
  shows: Show[];
};

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
      p-4 rounded-lg mb-4 border shadow-sm
      ${isAfterMidnight ? 'bg-gray-50' : 'bg-white'}
      ${isUpNext ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        <div className="text-xl font-bold text-gray-900">
          {timeRange}
          {isAfterMidnight && ' *'}
          {isUpNext && ' 🔜'}
        </div>
      </div>
      <div className="space-y-4">
        {shows?.map((show) => (
          <button
            key={`${show.time}-${show.band}`}
            className="w-full flex items-start gap-3 text-left hover:bg-gray-50 p-3 rounded-lg transition-colors"
            onClick={() => onToggleShow(show)}
          >
            <div className="mt-1 flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected(show)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleShow(show);
                }}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-grow">
              <div className="font-semibold text-base text-gray-900 mb-1">
                {show.band}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-600">
                  {show.location}
                </div>
                {show.time !== startTime && (
                  <div className="text-xs text-gray-500">
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