import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseService } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';

export interface RankingEntry {
  id: string;
  position: number;
  team: string;
  points: number;
  wins: number;
  kills: number;
}

export interface Rule {
  id: string;
  title: string;
  description: string;
}

export interface Award {
  id: string;
  position: string;
  prize: string;
  icon: string;
}

export interface ScoringSystem {
  killPoints: number;
  positionPoints: number[]; // Array where index 0 is 1st place points
}

export interface RankingConfig {
  title: string;
  subtitle: string;
  showTitle: boolean;
  showSubtitle: boolean;
  bannerImage: string | null;
}

interface DataContextType {
  ranking: RankingEntry[];
  rules: Rule[];
  awards: Award[];
  scoringSystem: ScoringSystem;
  rankingConfig: RankingConfig;
  isLoading: boolean;
  updateRanking: (entries: RankingEntry[]) => Promise<void>;
  updateRules: (rules: Rule[]) => Promise<void>;
  updateAwards: (awards: Award[]) => Promise<void>;
  updateScoringSystem: (system: ScoringSystem) => Promise<void>;
  updateRankingConfig: (config: RankingConfig) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Dados iniciais (fallback se Supabase não tiver dados)
const initialRanking: RankingEntry[] = [
  { id: '1', position: 1, team: 'LOUD', points: 150, wins: 5, kills: 87 },
  { id: '2', position: 2, team: 'paiN Gaming', points: 142, wins: 4, kills: 79 },
  { id: '3', position: 3, team: 'Vivo Keyd', points: 135, wins: 4, kills: 71 },
  { id: '4', position: 4, team: 'Corinthians', points: 128, wins: 3, kills: 68 },
  { id: '5', position: 5, team: 'INTZ', points: 115, wins: 3, kills: 62 },
  { id: '6', position: 6, team: 'Fluxo', points: 108, wins: 2, kills: 55 },
  { id: '7', position: 7, team: 'Los Grandes', points: 95, wins: 2, kills: 48 },
  { id: '8', position: 8, team: 'Meta Gaming', points: 88, wins: 1, kills: 42 },
];

const initialRules: Rule[] = [
  {
    id: '1',
    title: 'Formato do Campeonato',
    description: 'O campeonato será disputado em formato de pontos corridos, com 6 rodadas no total. Cada rodada consiste em 3 partidas.',
  },
  {
    id: '2',
    title: 'Sistema de Pontuação',
    description: '1º lugar: 12 pontos | 2º lugar: 9 pontos | 3º lugar: 8 pontos | 4º-10º: pontuação decrescente. Cada kill vale 1 ponto.',
  },
  {
    id: '3',
    title: 'Composição das Equipes',
    description: 'Cada equipe deve ter 4 jogadores titulares e até 2 reservas. Substituições são permitidas entre as partidas.',
  },
  {
    id: '4',
    title: 'Requisitos Técnicos',
    description: 'Todos os jogadores devem ter conexão estável. Ping máximo permitido: 80ms. Uso de VPN é proibido.',
  },
  {
    id: '5',
    title: 'Conduta',
    description: 'É proibido o uso de hacks, exploits ou qualquer software não autorizado. Punições variam de advertência a desclassificação.',
  },
];

const initialAwards: Award[] = [
  { id: '1', position: '1º Lugar', prize: 'R$ 5.000 + Troféu', icon: '🏆' },
  { id: '2', position: '2º Lugar', prize: 'R$ 2.500 + Medalha', icon: '🥈' },
  { id: '3', position: '3º Lugar', prize: 'R$ 1.000 + Medalha', icon: '🥉' },
  { id: '4', position: 'MVP do Torneio', prize: 'R$ 500 + Skin Exclusiva', icon: '⭐' },
  { id: '5', position: 'Artilheiro', prize: 'R$ 300 + Skin Exclusiva', icon: '🎯' },
];

const initialScoringSystem: ScoringSystem = {
  killPoints: 1,
  positionPoints: [12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0]
};

const initialRankingConfig: RankingConfig = {
  title: 'SUPER COPA FF',
  subtitle: 'Ranking Oficial do Campeonato',
  showTitle: true,
  showSubtitle: true,
  bannerImage: null,
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>(initialScoringSystem);
  const [rankingConfig, setRankingConfig] = useState<RankingConfig>(initialRankingConfig);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar dados do Supabase ao inicializar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Carregar ranking
      const rankingData = await supabaseService.getRanking();
      if (rankingData) {
        setRanking(rankingData.map(r => ({ ...r, id: r.id })));
      }

      // Carregar regras
      const rulesData = await supabaseService.getRules();
      if (rulesData) {
        setRules(rulesData.map((r: any) => ({ id: r.id, title: r.title, description: r.description })));
      }

      // Carregar premiações
      const awardsData = await supabaseService.getAwards();
      if (awardsData) {
        setAwards(awardsData.map((a: any) => ({ id: a.id, position: a.position, prize: a.prize, icon: a.icon })));
      }

      // Carregar configurações
      const configData = await supabaseService.getAllConfig();
      if (configData.length > 0) {
        const configObj: any = {};
        configData.forEach((item: any) => {
          configObj[item.key] = item.value;
        });

        if (configObj.ranking_title) {
          setRankingConfig({
            title: configObj.ranking_title || initialRankingConfig.title,
            subtitle: configObj.ranking_subtitle || initialRankingConfig.subtitle,
            showTitle: configObj.show_title ?? initialRankingConfig.showTitle,
            showSubtitle: configObj.show_subtitle ?? initialRankingConfig.showSubtitle,
            bannerImage: configObj.banner_image || null,
          });
        }

        if (configObj.kill_points !== undefined) {
          setScoringSystem({
            killPoints: configObj.kill_points || 1,
            positionPoints: configObj.position_points || initialScoringSystem.positionPoints,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro ao conectar',
        description: 'Não foi possível carregar os dados do servidor. Verifique sua conexão.',
        variant: 'destructive',
      });
      // Não carregar dados falsos em caso de erro
      setRanking([]);
      setRules([]);
      setAwards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRanking = async (entries: RankingEntry[]) => {
    try {
      // Atualizar state local imediatamente
      setRanking(entries);

      // 1. Buscar itens existentes no banco
      const existingEntries = await supabaseService.getRanking();
      const existingIds = new Set(existingEntries.map(e => e.id));

      // 2. Identificar IDs que devem permanecer
      // IDs curtos (< 30) são temporários (novos), então não estão no banco ainda
      const currentIds = new Set(entries.filter(e => e.id.length > 30).map(e => e.id));

      // 3. Deletar itens que não estão mais na lista
      const idsToDelete = [...existingIds].filter(id => !currentIds.has(id));

      if (idsToDelete.length > 0) {
        // Deletar em paralelo
        await Promise.all(idsToDelete.map(id => supabaseService.deleteRankingEntry(id)));
        console.log(`🗑️ ${idsToDelete.length} jogadores removidos.`);
      }

      // 4. Upsert (Atualizar ou Inserir) itens da lista
      // Usamos Promise.all para velocidade, mas cuidado com rate limits se forem muitos
      // Para segurança, vamos em lotes ou sequencial se falhar.
      await Promise.all(entries.map(entry =>
        supabaseService.upsertRankingEntry({
          id: entry.id, // O serviço trata IDs temporários dentro do upsertRankingEntry
          position: entry.position,
          team: entry.team,
          points: entry.points,
          wins: entry.wins,
          kills: entry.kills,
        })
      ));

      console.log('✅ Ranking sincronizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar ranking:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível sincronizar o ranking com o banco.',
        variant: 'destructive',
      });
      // Sincronizar dados reais em caso de erro
      refreshData();
    }
  };

  const updateRules = async (newRules: Rule[]) => {
    try {
      setRules(newRules);

      const existingRules = await supabaseService.getRules();
      const existingIds = new Set(existingRules.map(r => r.id));
      const currentIds = new Set(newRules.filter(r => r.id.length > 30).map(r => r.id));

      const idsToDelete = [...existingIds].filter(id => !currentIds.has(id));

      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map(id => supabaseService.deleteRule(id)));
      }

      await Promise.all(newRules.map((rule, index) =>
        supabaseService.upsertRule({
          id: rule.id,
          title: rule.title,
          description: rule.description,
          order: index + 1,
        })
      ));

      console.log('✅ Regras sincronizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar regras:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível sincronizar as regras.',
        variant: 'destructive',
      });
      refreshData();
    }
  };

  const updateAwards = async (newAwards: Award[]) => {
    try {
      setAwards(newAwards);

      const existingAwards = await supabaseService.getAwards();
      const existingIds = new Set(existingAwards.map(a => a.id));
      const currentIds = new Set(newAwards.filter(a => a.id.length > 30).map(a => a.id));

      const idsToDelete = [...existingIds].filter(id => !currentIds.has(id));

      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map(id => supabaseService.deleteAward(id)));
      }

      await Promise.all(newAwards.map((award, index) =>
        supabaseService.upsertAward({
          id: award.id,
          position: award.position,
          prize: award.prize,
          icon: award.icon,
          order: index + 1,
        })
      ));

      console.log('✅ Premiações sincronizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar premiações:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível sincronizar as premiações.',
        variant: 'destructive',
      });
      refreshData();
    }
  };

  const updateScoringSystem = async (system: ScoringSystem) => {
    try {
      setScoringSystem(system);

      await supabaseService.setConfig('kill_points', system.killPoints);
      await supabaseService.setConfig('position_points', system.positionPoints);

      console.log('✅ Sistema de pontuação salvo no Supabase');
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o sistema de pontuação.',
        variant: 'destructive',
      });
    }
  };

  const updateRankingConfig = async (config: RankingConfig) => {
    try {
      setRankingConfig(config);

      await supabaseService.setConfig('ranking_title', config.title);
      await supabaseService.setConfig('ranking_subtitle', config.subtitle);
      await supabaseService.setConfig('show_title', config.showTitle);
      await supabaseService.setConfig('show_subtitle', config.showSubtitle);
      await supabaseService.setConfig('banner_image', config.bannerImage);

      console.log('✅ Configurações salvas no Supabase');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    }
  };

  const refreshData = async () => {
    await loadAllData();
  };

  return (
    <DataContext.Provider
      value={{
        ranking,
        rules,
        awards,
        scoringSystem,
        rankingConfig,
        isLoading,
        updateRanking,
        updateRules,
        updateAwards,
        updateScoringSystem,
        updateRankingConfig,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
