'use client';

import { DATA_DAY2 } from '@/data/day2';
import { Schedule } from '../components/Schedule';

export default function Day2Page() {
  return (
    <Schedule
      data={DATA_DAY2}
      day={2}
      title="Cosquín Rock 2024 - Día 2"
      date="16 de Febrero"
      nextDayDate="17 de Febrero"
    />
  );
} 