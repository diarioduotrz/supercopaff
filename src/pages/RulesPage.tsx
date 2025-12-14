import { PageHeader } from '@/components/PageHeader';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Loader2 } from 'lucide-react';
import { useFadeInAnimation } from '@/hooks/useFadeInAnimation';

export function RulesPage() {
  const { rules, isLoading } = useData();

  useFadeInAnimation('[data-animate]', 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando regras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 pt-0 space-y-4">
      <PageHeader
        title="Regras"
        subtitle="Regulamento oficial do campeonato"
      />

      {rules.map((rule, index) => (
        <Card key={rule.id} className="overflow-hidden" data-animate>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {index + 1}
              </span>
              {rule.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {rule.description}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-primary/10 border-primary/20" data-animate>
        <CardContent className="p-4 flex items-center gap-3">
          <ScrollText className="h-5 w-5 text-primary" />
          <p className="text-sm text-foreground">
            <strong>Importante:</strong> O descumprimento de qualquer regra pode resultar em punições.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
