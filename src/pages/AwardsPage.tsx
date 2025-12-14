import { PageHeader } from '@/components/PageHeader';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useFadeInAnimation } from '@/hooks/useFadeInAnimation';
import { Loader2 } from 'lucide-react';

export function AwardsPage() {
  const { awards, isLoading } = useData();

  useFadeInAnimation('[data-animate]', 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando premiações...</p>
        </div>
      </div>
    );
  }

  const getCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border-yellow-400/50';
      case 1:
        return 'bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/50';
      case 2:
        return 'bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-amber-600/50';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 pb-4 pt-0 space-y-4">
      <PageHeader
        title="Premiações"
        subtitle="Prêmios e recompensas do campeonato"
      />

      {awards.map((award, index) => (
        <Card
          key={award.id}
          data-animate
          className={cn(
            "overflow-hidden transition-all duration-200 hover:shadow-md",
            getCardStyle(index)
          )}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <span className="text-4xl">{award.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{award.position}</h3>
              <p className="text-primary font-semibold">{award.prize}</p>
            </div>
          </CardContent>
        </Card>
      ))}


    </div>
  );
}
