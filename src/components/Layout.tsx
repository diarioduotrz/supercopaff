import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-32">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
