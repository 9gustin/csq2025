'use client';

import { DATA_DAY1 } from '@/data/day1';
import { Schedule } from '../components/Schedule';
import { PageLayout } from '../components/PageLayout';

export default function Day1Page() {
  return (
    <PageLayout>
      <Schedule
        data={DATA_DAY1}
        day={1}
        title="Cosquín Rock 2024 - Día 1"
        date="15 de Febrero"
        nextDayDate="16 de Febrero"
      />
    </PageLayout>
  );
} 