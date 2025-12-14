import { Link, useLocation } from 'react-router-dom';
import { Trophy, BookOpen, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/regras', icon: BookOpen, label: 'Regras' },
  { path: '/', icon: Trophy, label: 'Ranking', featured: true },
  { path: '/premiacoes', icon: Gift, label: 'Premiações' },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex justify-around items-center max-w-lg mx-auto px-4 py-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isFeatured = item.featured;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300",
                "rounded-2xl relative flex-1"
              )}
            >
              {isFeatured ? (
                <div className={cn(
                  "flex flex-col items-center justify-center",
                  "w-14 h-14 rounded-full shadow-lg transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-primary/90 text-primary-foreground hover:scale-100"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <>
                  <Icon
                    className={cn(
                      "h-6 w-6 mb-1 transition-transform duration-200",
                      isActive && "scale-110 text-primary"
                    )}
                  />
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-full mt-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
