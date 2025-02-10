'use client';

import Link from 'next/link';
import { PageLayout } from './components/PageLayout';

export default function HomePage() {
  return (
    <PageLayout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-foreground tracking-tight">
          Cosquín Rock
          <span className="text-brand-primary"> 2024</span>
        </h1>
        
        <p className="text-xl text-foreground/60 mb-12 max-w-2xl">
          Organizá tu agenda para los dos días del festival más importante de Latinoamérica
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
          <Link 
            href="/dia1"
            className="flex-1 px-8 py-4 rounded-xl font-semibold text-lg bg-card-background border border-card-border hover:bg-card-background/50 transition-colors group"
          >
            <div className="text-foreground/60 mb-1">15 de Febrero</div>
            <div className="text-brand-primary text-2xl font-bold">Día 1</div>
          </Link>

          <Link 
            href="/dia2"
            className="flex-1 px-8 py-4 rounded-xl font-semibold text-lg bg-card-background border border-card-border hover:bg-card-background/50 transition-colors group"
          >
            <div className="text-foreground/60 mb-1">16 de Febrero</div>
            <div className="text-brand-primary text-2xl font-bold">Día 2</div>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-primary/10 to-transparent -z-10" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/5 blur-3xl rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full -z-10" />
      </div>
    </PageLayout>
  );
} 