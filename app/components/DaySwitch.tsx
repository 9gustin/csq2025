'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DaySwitch() {
  const pathname = usePathname();
  const isDay1 = pathname === '/dia1';
  const isDay2 = pathname === '/dia2';

  if (!isDay1 && !isDay2) return null;

  return (
    <Link
      href={isDay1 ? '/dia2' : '/dia1'}
      className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    >
      Ver {isDay1 ? 'Día 2' : 'Día 1'}
    </Link>
  );
} 