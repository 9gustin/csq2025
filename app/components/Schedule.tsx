'use client';

import { useMemo, useEffect, useState } from 'react';
import { AgendaProvider, useAgenda } from '../dia1/components/AgendaContext';
import Link from 'next/link';
import { DaySwitch } from './DaySwitch';
import { MobileTimeSlot } from './MobileTimeSlot';
import { Show, TimeGroup } from '@/types';
import { ALL_SHOWS } from '@/app/data';
import { useSearchParams } from 'next/navigation';
import { SearchInput } from './Schedule/SearchInput';

type ScheduleProps = {
  data: Show[];
  day: 1 | 2;
  title: string;
  date: string;
  nextDayDate: string;
};

function groupShowsByTimeWindow(shows: Show[], formatTime: (iso: string) => string) {
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

function SearchIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="h-5 w-5 text-foreground/40"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function ScheduleContent({ data, day, title, date, nextDayDate }: ScheduleProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOnlyAgenda, setShowOnlyAgenda] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(`cosquin-rock-2024-show-only-agenda-day-${day}`);
    return saved ? JSON.parse(saved) : false;
  });
  const { selectedShows, toggleShow, isSelected, clearAgenda } = useAgenda();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'list' : 'table');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      `cosquin-rock-2024-show-only-agenda-day-${day}`,
      JSON.stringify(showOnlyAgenda)
    );
  }, [showOnlyAgenda, day]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const sortedShows = useMemo(() => {
    let shows = [...data].sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    if (searchTerm.trim()) {
      shows = shows.filter(show => 
        show.band.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showOnlyAgenda) {
      shows = shows.filter(show => isSelected(show));
    }

    return shows;
  }, [data, showOnlyAgenda, isSelected, searchTerm]);

  const locations = [...new Set(data.map(show => show.location))];

  const isShowDay = currentTime.getDate() === (day === 1 ? 15 : 16) && 
                   currentTime.getMonth() === 1 && // 1 = February
                   currentTime.getFullYear() === 2024;

  const timeGroups = useMemo(() => {
    return groupShowsByTimeWindow(sortedShows, formatTime);
  }, [sortedShows]);

  const findShowsInOtherDay = (term: string) => {
    const otherDay = day === 1 ? 2 : 1;
    const otherDayShows = ALL_SHOWS[otherDay];
    
    return otherDayShows.filter(show => 
      show.band.toLowerCase().includes(term.toLowerCase())
    );
  };

  const otherDayResults = useMemo(() => {
    if (!searchTerm.trim() || sortedShows.length > 0) return [];
    return findShowsInOtherDay(searchTerm);
  }, [searchTerm, sortedShows.length, day]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/"
          className="text-brand-primary text-lg font-semibold hover:bg-brand-primary/10 px-3 py-1 rounded-lg transition-colors -ml-3"
        >
          ← Inicio
        </Link>
        <DaySwitch />
      </div>

      <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
        {title}
      </h1>
      <h2 className="text-xl text-center mb-8 text-foreground/60">
        {date}
      </h2>

      <div className="mb-6 space-y-4">
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm}
          resultsCount={sortedShows.length}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-foreground/60 order-2 sm:order-1">
            {selectedShows.length} shows seleccionados
            {searchTerm && (
              <span className="ml-2">
                • {sortedShows.length} resultados
              </span>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
            {selectedShows.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="secondary-button"
              >
                Limpiar Día {day}
              </button>
            )}
            <button
              onClick={() => setShowOnlyAgenda(!showOnlyAgenda)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-colors ${
                showOnlyAgenda 
                  ? 'bg-card-background text-foreground border border-card-border' 
                  : 'brand-button'
              }`}
            >
              {showOnlyAgenda ? 'Ver Todo' : 'Ver Mi Agenda'}
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-card-background shadow-lg rounded-lg">
            <thead>
              <tr className="bg-card-background border-b border-card-border">
                <th className="sticky left-0 bg-card-background px-6 py-3 text-left text-foreground/60">Hora</th>
                {locations.map((location) => (
                  <th key={location} className="px-6 py-3 text-left text-foreground/60">
                    {location}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {sortedShows?.map((show) => {
                const showsAtSameTime = sortedShows.filter(
                  (s) => s.time === show.time
                );
                
                if (showsAtSameTime[0] === show) {
                  const isAfterMidnight = new Date(show.time).getHours() < 12;
                  const showDate = new Date(show.time);
                  const isUpNext = isShowDay ? (
                    showDate.getTime() - currentTime.getTime() <= 30 * 60 * 1000 &&
                    showDate.getTime() > currentTime.getTime()
                  ) : false;

                  return (
                    <tr 
                      key={`${show.time}-${show.band}`}
                      className={`
                        hover:bg-card-background/5
                        ${isAfterMidnight ? 'bg-card-background/5' : ''}
                        ${isUpNext ? 'bg-brand-secondary/5' : ''}
                      `}
                    >
                      <td className={`
                        sticky left-0 
                        ${isAfterMidnight ? 'bg-card-background/5' : 'bg-card-background'}
                        ${isUpNext ? 'bg-brand-secondary/5' : ''}
                        px-6 py-4 whitespace-nowrap font-medium text-foreground
                      `}>
                        {formatTime(show.time)}
                        {isAfterMidnight && ' *'}
                        {isUpNext && ' 🔜'}
                      </td>
                      {locations.map((location) => {
                        const showAtLocation = showsAtSameTime.find(
                          (s) => s.location === location
                        );
                        return (
                          <td
                            key={location}
                            className={`
                              px-6 py-4 whitespace-nowrap text-foreground/60
                              ${showAtLocation ? 'font-medium text-foreground' : ''}
                              ${isUpNext ? 'text-foreground' : ''}
                              ${showAtLocation ? 'cursor-pointer hover:bg-card-background/5' : ''}
                            `}
                            onClick={() => {
                              if (showAtLocation) {
                                toggleShow(showAtLocation);
                              }
                            }}
                          >
                            {showAtLocation && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected(showAtLocation)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleShow(showAtLocation);
                                  }}
                                  className="h-4 w-4 text-brand-primary rounded border-card-border focus:ring-brand-primary"
                                />
                                <span 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleShow(showAtLocation);
                                  }}
                                >
                                  {showAtLocation.band}
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="md:hidden">
          {timeGroups.map((group) => {
            if (group.shows.length === 0) return null;
            
            const firstShow = group.shows[0];
            const showDate = new Date(firstShow.time);
            const isAfterMidnight = showDate.getHours() < 12;
            const isUpNext = isShowDay ? (
              showDate.getTime() - currentTime.getTime() <= 30 * 60 * 1000 &&
              showDate.getTime() > currentTime.getTime()
            ) : false;

            return (
              <MobileTimeSlot
                key={group.startTime}
                timeGroup={group}
                isAfterMidnight={isAfterMidnight}
                isUpNext={isUpNext}
                onToggleShow={toggleShow}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      )}
      
      <div className="mt-4 space-y-1 text-sm">
        <div className="text-foreground/60">
          * Shows después de medianoche ({nextDayDate})
        </div>
        {isShowDay && (
          <div className="text-foreground/60">
            🔜 Próximos 30 minutos
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card-background rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-foreground mb-4">
              ¿Estás seguro?
            </h3>
            <p className="text-foreground/60 mb-6">
              Esta acción eliminará todos los shows seleccionados de tu agenda.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg font-medium text-foreground border border-card-border"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAgenda();
                  setShowClearConfirm(false);
                }}
                className="secondary-button"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {searchTerm && sortedShows.length === 0 && otherDayResults.length > 0 && (
        <div className="mt-8 p-4 rounded-lg bg-card-background border border-card-border">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Encontrado en Día {day === 1 ? '2' : '1'}
          </h3>
          <div className="space-y-3">
            {otherDayResults.map(show => (
              <div 
                key={`${show.time}-${show.band}`}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-foreground">{show.band}</div>
                  <div className="text-sm text-foreground/60">
                    {new Date(show.time).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })} - {show.location}
                  </div>
                </div>
                <Link
                  href={`/dia${day === 1 ? '2' : '1'}?search=${encodeURIComponent(searchTerm)}`}
                  className="px-4 py-2 rounded-lg text-brand-primary text-sm font-medium border border-brand-primary/20 hover:bg-brand-primary/10 transition-colors"
                >
                  Ver en Día {day === 1 ? '2' : '1'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function Schedule(props: ScheduleProps) {
  return (
    <AgendaProvider day={props.day}>
      <ScheduleContent {...props} />
    </AgendaProvider>
  );
} 