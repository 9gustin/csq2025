'use client';

type Show = {
  band: string;
  time: string;
  location: string;
};

type Props = {
  time: string;
  shows: Show[];
  isAfterMidnight: boolean;
  isUpNext: boolean;
  onToggleShow: (show: Show) => void;
  isSelected: (show: Show) => boolean;
};

export function MobileTimeSlot({ time, shows, isAfterMidnight, isUpNext, onToggleShow, isSelected }: Props) {
  return (
    <div className={`
      p-4 rounded-lg mb-4 border
      ${isAfterMidnight ? 'bg-gray-50' : 'bg-white'}
      ${isUpNext ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-lg font-bold">
          {time}
          {isAfterMidnight && ' *'}
          {isUpNext && ' 🔜'}
        </div>
      </div>
      <div className="space-y-3">
        {shows.map((show) => (
          <button
            key={`${show.time}-${show.band}`}
            className="w-full flex items-start gap-3 text-left"
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
                className="h-5 w-5 text-indigo-600 rounded"
              />
            </div>
            <div className="flex-grow">
              <div className="font-medium text-base">{show.band}</div>
              <div className="text-sm text-gray-600">{show.location}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 