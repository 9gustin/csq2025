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
      href={pathname === '/dia1' ? '/dia2' : '/dia1'}
      className="px-4 py-2 rounded-lg text-foreground text-lg font-semibold border border-card-border hover:bg-card-background/50 transition-colors"
    >
      Ver Día {pathname === '/dia1' ? '2' : '1'}
    </Link>
  );
} 