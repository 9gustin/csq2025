'use client';

import { DATA_DAY1 } from '@/data/day1';
import { useMemo, useEffect, useState } from 'react';
import { AgendaProvider, useAgenda } from './components/AgendaContext';
import Link from 'next/link';
import { DaySwitch } from '../components/DaySwitch';

function Schedule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOnlyAgenda, setShowOnlyAgenda] = useState(false);
  const { selectedShows, toggleShow, isSelected, clearAgenda } = useAgenda();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const sortedShows = useMemo(() => {
    let shows = [...DATA_DAY1].sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    if (showOnlyAgenda) {
      shows = shows.filter(show => isSelected(show));
    }

    return shows;
  }, [showOnlyAgenda, isSelected]);

  const locations = [...new Set(DATA_DAY1.map(show => show.location))];

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const isShowDay = currentTime.getDate() === 15 && 
                    currentTime.getMonth() === 1 && // 1 = February
                    currentTime.getFullYear() === 2024;

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
          Cosquín Rock 2024 - Día 1
        </h1>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          15 de Febrero
        </h2>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedShows.length} shows seleccionados
          </div>
          <div className="flex gap-2">
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
              className={`px-4 py-2 rounded-lg font-medium ${
                showOnlyAgenda 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {showOnlyAgenda ? 'Ver Todo' : 'Ver Mi Agenda'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
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
              {sortedShows.map((show) => {
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
        
        <div className="mt-4 space-y-1 text-sm">
          <div className="text-gray-600">
            * Shows después de medianoche (16 de Febrero)
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

// Wrap the main component with the AgendaProvider
export default function SchedulePage() {
  return (
    <AgendaProvider day={1}>
      <Schedule />
    </AgendaProvider>
  );
} 