'use client';

import { useMemo, useEffect, useState } from 'react';
import { AgendaProvider, useAgenda } from '../dia1/components/AgendaContext';
import Link from 'next/link';
import { DaySwitch } from './DaySwitch';
import { MobileTimeSlot } from './MobileTimeSlot';
import { Show, TimeGroup } from '@/types';

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

function ScheduleContent({ data, day, title, date, nextDayDate }: ScheduleProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOnlyAgenda, setShowOnlyAgenda] = useState(false);
  const { selectedShows, toggleShow, isSelected, clearAgenda } = useAgenda();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');

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

    if (showOnlyAgenda) {
      shows = shows.filter(show => isSelected(show));
    }

    return shows;
  }, [data, showOnlyAgenda, isSelected]);

  const locations = [...new Set(data.map(show => show.location))];

  const isShowDay = currentTime.getDate() === (day === 1 ? 15 : 16) && 
                   currentTime.getMonth() === 1 && // 1 = February
                   currentTime.getFullYear() === 2024;

  const timeGroups = useMemo(() => {
    return groupShowsByTimeWindow(sortedShows, formatTime);
  }, [sortedShows]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Inicio
          </Link>
          <DaySwitch />
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          {title}
        </h1>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          {date}
        </h2>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            {selectedShows.length} shows seleccionados
          </div>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
            {selectedShows.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 rounded-lg font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-white"
              >
                Limpiar Agenda
              </button>
            )}
            <button
              onClick={() => setShowOnlyAgenda(!showOnlyAgenda)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium ${
                showOnlyAgenda 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {showOnlyAgenda ? 'Ver Todo' : 'Ver Mi Agenda'}
            </button>
          </div>
        </div>
        
        {viewMode === 'table' ? (
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="sticky left-0 bg-gray-800 px-6 py-3 text-left">Hora</th>
                  {locations.map((location) => (
                    <th key={location} className="px-6 py-3 text-left">
                      {location}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                          ${isAfterMidnight ? 'bg-gray-50' : ''}
                          ${isUpNext ? 'bg-yellow-50' : ''}
                        `}
                      >
                        <td className={`
                          sticky left-0 
                          ${isAfterMidnight ? 'bg-gray-50' : 'bg-white'}
                          ${isUpNext ? 'bg-yellow-50' : ''}
                          px-6 py-4 whitespace-nowrap font-medium text-gray-900
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
                                px-6 py-4 whitespace-nowrap text-gray-700
                                ${showAtLocation ? 'font-medium' : ''}
                                ${isUpNext ? 'text-gray-900' : ''}
                                ${showAtLocation ? 'cursor-pointer hover:bg-gray-50' : ''}
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
                                    onChange={() => toggleShow(showAtLocation)}
                                    className="h-4 w-4 text-indigo-600 rounded"
                                  />
                                  <span>{showAtLocation.band}</span>
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
          <div className="text-gray-600">
            * Shows después de medianoche ({nextDayDate})
          </div>
          {isShowDay && (
            <div className="text-gray-600">
              🔜 Próximos 30 minutos
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ¿Estás seguro?
              </h3>
              <p className="text-gray-600 mb-6">
                Esta acción eliminará todos los shows seleccionados de tu agenda.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 border border-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearAgenda();
                    setShowClearConfirm(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Schedule(props: ScheduleProps) {
  return (
    <AgendaProvider day={props.day}>
      <ScheduleContent {...props} />
    </AgendaProvider>
  );
} 