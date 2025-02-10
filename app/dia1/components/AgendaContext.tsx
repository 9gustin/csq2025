'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Show = {
  band: string;
  time: string;
  location: string;
};

type AgendaContextType = {
  selectedShows: Show[];
  toggleShow: (show: Show) => void;
  isSelected: (show: Show) => boolean;
  clearAgenda: () => void;
  day: 1 | 2;
};

const STORAGE_KEY_BASE = 'agenda-cr25';

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export function AgendaProvider({ children, day }: { children: ReactNode; day: 1 | 2 }) {
  const [selectedShows, setSelectedShows] = useState<Show[]>([]);
  const storageKey = `${STORAGE_KEY_BASE}-day-${day}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(isValidShow)) {
          setSelectedShows(parsed);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error loading agenda:', error);
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const saveToStorage = (shows: Show[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(shows));
    } catch (error) {
      console.error('Error saving agenda:', error);
    }
  };

  const toggleShow = (show: Show) => {
    setSelectedShows(prev => {
      const isAlreadySelected = prev.some(
        s => s.band === show.band && s.time === show.time
      );

      const newSelection = isAlreadySelected
        ? prev.filter(s => !(s.band === show.band && s.time === show.time))
        : [...prev, show];

      saveToStorage(newSelection);
      return newSelection;
    });
  };

  const isSelected = (show: Show) => {
    return selectedShows.some(
      s => s.band === show.band && s.time === show.time
    );
  };

  const clearAgenda = () => {
    setSelectedShows([]);
    localStorage.removeItem(storageKey);
  };

  return (
    <AgendaContext.Provider value={{ selectedShows, toggleShow, isSelected, clearAgenda, day }}>
      {children}
    </AgendaContext.Provider>
  );
}

function isValidShow(show: any): show is Show {
  return (
    typeof show === 'object' &&
    typeof show.band === 'string' &&
    typeof show.time === 'string' &&
    typeof show.location === 'string'
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
} 