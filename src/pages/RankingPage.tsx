import { PageHeader } from '@/components/PageHeader';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useFadeInAnimation } from '@/hooks/useFadeInAnimation';
import { Loader2 } from 'lucide-react';

export function RankingPage() {
  const { ranking, isLoading } = useData();

  // Ativa as animações de fade-in para os cards
  useFadeInAnimation('[data-animate]', 80);

  // Mostrar loading enquanto carrega dados do Supabase
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="px-4 pb-4 pt-0 space-y-3">
      <PageHeader
        title="SUPER COPA FF"
        subtitle="Ranking Oficial do Campeonato"
        showBanner
      />

      <div className="grid grid-cols-12 text-xs text-muted-foreground font-semibold px-4 py-2" data-animate>
        <span className="col-span-1">#</span>
        <span className="col-span-5">PLAYERS</span>
        <span className="col-span-2 text-center">PTS</span>
        <span className="col-span-2 text-center">B</span>
        <span className="col-span-2 text-center">KILLS</span>
      </div>

      {ranking.map((entry, index) => (
        <Card
          key={entry.id}
          data-animate
          className={cn(
            "overflow-hidden transition-all duration-200 hover:shadow-md",
            index < 3 && "border-l-4",
            index === 0 && "border-l-yellow-400",
            index === 1 && "border-l-gray-400",
            index === 2 && "border-l-amber-600"
          )}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-1">
                <span className={cn(
                  "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mr-2",
                  getMedalColor(entry.position)
                )}>
                  {entry.position}
                </span>
              </div>
              <div className="col-span-5 pl-1">
                <span className="font-semibold text-foreground">{entry.team}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-bold text-primary text-lg">{entry.points}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-muted-foreground">{entry.wins}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-muted-foreground">{entry.kills}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
