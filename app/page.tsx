'use client';

import Link from 'next/link';
import { PageLayout } from './components/PageLayout';
import { useEffect } from 'react';
import { registerServiceWorker } from './pwa';
import { InstagramIcon, LinkedInIcon } from './components/icons/Social';

export default function HomePage() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <PageLayout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-foreground tracking-tight">
          Agenda <span className="text-brand-primary">Cosquín Rock</span>
          <span className="text-brand-secondary"> 2025</span>
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

      <footer className="fixed bottom-0 left-0 w-full py-4 px-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-foreground/60 text-sm">
            by{' '}
            <a 
              href="https://twitter.com/9gustin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-primary hover:opacity-80 transition-opacity"
            >
              @9gustin
            </a>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://linkedin.com/in/9gustin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/40 hover:text-foreground transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon />
            </a>
            <a 
              href="https://instagram.com/9gustin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/40 hover:text-foreground transition-colors"
              aria-label="Instagram Profile"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
} 