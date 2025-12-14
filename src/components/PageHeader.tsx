import heroBanner from '@/assets/hero-banner.jpg';
import { useData } from '@/contexts/DataContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBanner?: boolean;
}

export function PageHeader({ title, subtitle, showBanner = false }: PageHeaderProps) {
  const { rankingConfig } = useData();

  if (showBanner) {
    const backgroundImage = rankingConfig.bannerImage || heroBanner;
    const displayTitle = rankingConfig.showTitle ? rankingConfig.title : title;
    const displaySubtitle = rankingConfig.showSubtitle ? rankingConfig.subtitle : subtitle;

    return (
      <header className="sticky top-0 z-40 relative h-48 md:h-64 overflow-hidden rounded-b-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {rankingConfig.showTitle && (
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-lg">
              {displayTitle}
            </h1>
          )}
          {rankingConfig.showSubtitle && displaySubtitle && (
            <p className="text-primary-foreground/80 mt-1 drop-shadow">{displaySubtitle}</p>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-2xl">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-primary-foreground/80 mt-1">{subtitle}</p>}
    </header>
  );
}
