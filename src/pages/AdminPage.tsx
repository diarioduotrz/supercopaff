import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useData, RankingEntry, Rule, Award, ScoringSystem, RankingConfig } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Trophy, BookOpen, Gift, LogOut, Save, Trash2, Plus, Calculator, Upload, FileImage, Loader2, CheckCircle, AlertCircle, Smartphone, Bell } from 'lucide-react';
import { analyzeImage, ExtractedData } from '@/lib/gemini';
import { requestNotificationPermission, sendTestNotification } from '@/lib/pwa';
import { NotificationManager } from '@/components/NotificationManager';

interface ProcessedResult {
  fileName: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  data?: ExtractedData[];
  error?: string;
}

export function AdminPage() {
  const { isAuthenticated, logout, user } = useAuth();
  const { ranking, rules, awards, scoringSystem, rankingConfig, updateRanking, updateRules, updateAwards, updateScoringSystem, updateRankingConfig } = useData();
  const { toast } = useToast();

  const [editedRanking, setEditedRanking] = useState<RankingEntry[]>(ranking);
  const [editedRules, setEditedRules] = useState<Rule[]>(rules);
  const [editedAwards, setEditedAwards] = useState<Award[]>(awards);
  const [editedScoring, setEditedScoring] = useState<ScoringSystem>(scoringSystem);
  const [editedRankingConfig, setEditedRankingConfig] = useState<RankingConfig>(rankingConfig);

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<ProcessedResult[]>([]);
  const [notificationTitle, setNotificationTitle] = useState('SUPER COPA FF');
  const [notificationMessage, setNotificationMessage] = useState('Nova atualização disponível! 🎮🏆');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSaveRankingAndConfig = () => {
    const sorted = [...editedRanking].sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, position: index + 1 }));
    updateRanking(sorted);
    setEditedRanking(sorted);
    updateRankingConfig(editedRankingConfig);
    toast({ title: 'Ranking atualizado!', description: 'Todas as alterações foram salvas.' });
  };

  const handleSaveRules = () => {
    updateRules(editedRules);
    toast({ title: 'Regras atualizadas!', description: 'As alterações foram salvas.' });
  };

  const handleSaveAwards = () => {
    updateAwards(editedAwards);
    toast({ title: 'Premiações atualizadas!', description: 'As alterações foram salvas.' });
  };

  const handleSaveScoring = () => {
    updateScoringSystem(editedScoring);
    toast({ title: 'Pontuação atualizada!', description: 'As regras de pontuação foram salvas.' });
  };

  const handleSaveAwardsAndScoring = () => {
    updateAwards(editedAwards);
    updateScoringSystem(editedScoring);
    toast({ title: 'Premiações e Pontuação salvas!', description: 'Todas as alterações foram aplicadas.' });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setEditedRankingConfig({ ...editedRankingConfig, bannerImage: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () => {
    setEditedRankingConfig({ ...editedRankingConfig, bannerImage: null });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newResults: ProcessedResult[] = files.map(file => ({
        fileName: file.name,
        status: 'pending'
      }));

      setUploadResults(newResults);
      setIsProcessing(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Update status to processing
        setUploadResults(prev => prev.map((res, idx) =>
          idx === i ? { ...res, status: 'processing' } : res
        ));

        try {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          await new Promise((resolve) => {
            reader.onload = async () => {
              try {
                const base64 = reader.result as string;
                const data = await analyzeImage(base64, file.type);

                setUploadResults(prev => prev.map((res, idx) =>
                  idx === i ? { ...res, status: 'success', data } : res
                ));
              } catch (err) {
                console.error(err);
                setUploadResults(prev => prev.map((res, idx) =>
                  idx === i ? { ...res, status: 'error', error: 'Falha ao analisar imagem' } : res
                ));
              }
              resolve(null);
            };
          });
        } catch (error) {
          setUploadResults(prev => prev.map((res, idx) =>
            idx === i ? { ...res, status: 'error', error: 'Erro ao ler arquivo' } : res
          ));
        }
      }
      setIsProcessing(false);
    }
  };

  const applyResultsToRanking = () => {
    const newRanking = [...editedRanking];
    let updatesCount = 0;

    uploadResults.forEach(result => {
      if (result.status === 'success' && result.data) {
        result.data.forEach(extracted => {
          // Calculate points for this entry
          const positionPoints = scoringSystem.positionPoints[extracted.position - 1] || 0;
          const killPoints = extracted.kills * scoringSystem.killPoints;
          const totalPoints = positionPoints + killPoints;

          // Find existing team (simple normalization)
          const existingTeamIndex = newRanking.findIndex(
            r => r.team.toLowerCase().trim() === extracted.team.toLowerCase().trim()
          );

          if (existingTeamIndex >= 0) {
            // Update existing team
            newRanking[existingTeamIndex].points += totalPoints;
            newRanking[existingTeamIndex].wins += extracted.position === 1 ? 1 : 0;
            newRanking[existingTeamIndex].kills += extracted.kills;
            updatesCount++;
          } else {
            // Add new team if not found (optional - maybe ask user? For now auto-add)
            newRanking.push({
              id: Date.now().toString() + Math.random(),
              position: newRanking.length + 1, // temporary
              team: extracted.team,
              points: totalPoints,
              wins: extracted.position === 1 ? 1 : 0,
              kills: extracted.kills
            });
            updatesCount++;
          }
        });
      }
    });

    // Re-sort ranking
    const sortedRanking = newRanking.sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({ ...entry, position: idx + 1 }));

    updateRanking(sortedRanking);
    setEditedRanking(sortedRanking);
    setUploadResults([]); // Clear results after applying

    toast({
      title: 'Ranking Atualizado!',
      description: `${updatesCount} registros foram processados e aplicados.`
    });
  };

  const addNewTeam = () => {
    const newTeam: RankingEntry = {
      id: Date.now().toString(),
      position: editedRanking.length + 1,
      team: 'Nova Equipe',
      points: 0,
      wins: 0,
      kills: 0,
    };
    setEditedRanking([...editedRanking, newTeam]);
  };

  const addNewRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      title: 'Nova Regra',
      description: 'Descrição da regra...',
    };
    setEditedRules([...editedRules, newRule]);
  };

  const addNewAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      position: 'Novo Prêmio',
      prize: 'Descrição do prêmio',
      icon: '🎁',
    };
    setEditedAwards([...editedAwards, newAward]);
  };

  const removeTeam = (id: string) => {
    setEditedRanking(editedRanking.filter(t => t.id !== id));
  };

  const removeRule = (id: string) => {
    setEditedRules(editedRules.filter(r => r.id !== id));
  };

  const removeAward = (id: string) => {
    setEditedAwards(editedAwards.filter(a => a.id !== id));
  };

  return (
    <div>
      <PageHeader title="Painel Admin" subtitle={`Olá, ${user?.name}`} />

      <div className="p-4">
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="ranking" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="upload" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Ranking</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Regras</span>
            </TabsTrigger>
            <TabsTrigger value="awards" className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Premiações</span>
            </TabsTrigger>
            <TabsTrigger value="pwa" className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">PWA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upload de Resultados</h2>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FileImage className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Arraste os prints aqui</h3>
                      <p className="text-sm text-muted-foreground">Ou clique para selecionar arquivos</p>
                    </div>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Selecionar Imagens
                      </span>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                      />
                    </Label>
                  </div>
                </div>

                {uploadResults.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-semibold text-lg">Resultados da Análise</h3>

                    <div className="grid gap-3">
                      {uploadResults.map((result, idx) => (
                        <Card key={idx} className={`border-l-4 ${result.status === 'success' ? 'border-l-green-500' :
                          result.status === 'error' ? 'border-l-destructive' : 'border-l-primary'
                          }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium flex items-center gap-2">
                                {result.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {result.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {result.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                                {result.fileName}
                              </span>
                              <span className="text-sm text-muted-foreground capitalize">
                                {result.status === 'processing' ? 'Analisando...' : result.status}
                              </span>
                            </div>

                            {result.data && result.data.length > 0 && (
                              <div className="mt-3 text-sm bg-muted p-2 rounded">
                                <div className="grid grid-cols-12 font-medium text-muted-foreground mb-1">
                                  <span className="col-span-1 text-center">#</span>
                                  <span className="col-span-7">Equipe</span>
                                  <span className="col-span-4 text-center">Kills</span>
                                </div>
                                {result.data.map((item, i) => (
                                  <div key={i} className="grid grid-cols-12 py-1 border-t border-border/50">
                                    <span className="col-span-1 text-center">{item.position}</span>
                                    <span className="col-span-7 truncate">{item.team}</span>
                                    <span className="col-span-4 text-center">{item.kills}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {result.error && (
                              <p className="text-sm text-destructive mt-1">{result.error}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={applyResultsToRanking}
                        disabled={isProcessing || !uploadResults.some(r => r.status === 'success')}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Aplicar ao Ranking Geral
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gerenciar Ranking</h2>
              <Button size="sm" onClick={addNewTeam}>
                <Plus className="h-4 w-4 mr-1" /> Equipe
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Banner da Página de Ranking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedRankingConfig.bannerImage ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <img
                        src={editedRankingConfig.bannerImage}
                        alt="Banner preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Label htmlFor="ranking-banner-upload" className="flex-1 cursor-pointer">
                        <span className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors w-full flex items-center justify-center text-sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Trocar
                        </span>
                        <Input
                          id="ranking-banner-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBannerUpload}
                        />
                      </Label>
                      <Button variant="outline" size="sm" onClick={handleRemoveBanner} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed rounded-lg text-center">
                    <Label htmlFor="ranking-banner-initial" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <FileImage className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Clique para adicionar banner</span>
                      </div>
                      <Input
                        id="ranking-banner-initial"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerUpload}
                      />
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Título e Descrição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ranking-title">Título</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="show-title"
                        className="rounded border-gray-300"
                        checked={editedRankingConfig.showTitle}
                        onChange={(e) => setEditedRankingConfig({
                          ...editedRankingConfig,
                          showTitle: e.target.checked
                        })}
                      />
                      <Label htmlFor="show-title" className="text-sm font-normal">Exibir</Label>
                    </div>
                  </div>
                  <Input
                    id="ranking-title"
                    value={editedRankingConfig.title}
                    onChange={(e) => setEditedRankingConfig({
                      ...editedRankingConfig,
                      title: e.target.value
                    })}
                    placeholder="SUPER COPA FF"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ranking-subtitle">Descrição</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="show-subtitle"
                        className="rounded border-gray-300"
                        checked={editedRankingConfig.showSubtitle}
                        onChange={(e) => setEditedRankingConfig({
                          ...editedRankingConfig,
                          showSubtitle: e.target.checked
                        })}
                      />
                      <Label htmlFor="show-subtitle" className="text-sm font-normal">Exibir</Label>
                    </div>
                  </div>
                  <Input
                    id="ranking-subtitle"
                    value={editedRankingConfig.subtitle}
                    onChange={(e) => setEditedRankingConfig({
                      ...editedRankingConfig,
                      subtitle: e.target.value
                    })}
                    placeholder="Ranking Oficial do Campeonato"
                  />
                </div>
              </CardContent>
            </Card>

            {editedRanking.map((entry, index) => (
              <Card key={entry.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">#{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeTeam(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Equipe</Label>
                      <Input
                        value={entry.team}
                        onChange={(e) => {
                          const updated = [...editedRanking];
                          updated[index].team = e.target.value;
                          setEditedRanking(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Pontos</Label>
                      <Input
                        type="number"
                        value={entry.points}
                        onChange={(e) => {
                          const updated = [...editedRanking];
                          updated[index].points = parseInt(e.target.value) || 0;
                          setEditedRanking(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Booyah</Label>
                      <Input
                        type="number"
                        value={entry.wins}
                        onChange={(e) => {
                          const updated = [...editedRanking];
                          updated[index].wins = parseInt(e.target.value) || 0;
                          setEditedRanking(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Kills</Label>
                      <Input
                        type="number"
                        value={entry.kills}
                        onChange={(e) => {
                          const updated = [...editedRanking];
                          updated[index].kills = parseInt(e.target.value) || 0;
                          setEditedRanking(updated);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={handleSaveRankingAndConfig} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Salvar Ranking
            </Button>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gerenciar Regras</h2>
              <Button size="sm" onClick={addNewRule}>
                <Plus className="h-4 w-4 mr-1" /> Regra
              </Button>
            </div>

            {editedRules.map((rule, index) => (
              <Card key={rule.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Regra {index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={rule.title}
                      onChange={(e) => {
                        const updated = [...editedRules];
                        updated[index].title = e.target.value;
                        setEditedRules(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={rule.description}
                      onChange={(e) => {
                        const updated = [...editedRules];
                        updated[index].description = e.target.value;
                        setEditedRules(updated);
                      }}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={handleSaveRules} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Salvar Regras
            </Button>
          </TabsContent>

          <TabsContent value="awards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gerenciar Premiações</h2>
              <Button size="sm" onClick={addNewAward}>
                <Plus className="h-4 w-4 mr-1" /> Prêmio
              </Button>
            </div>

            {editedAwards.map((award, index) => (
              <Card key={award.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{award.icon}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeAward(award.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ícone (emoji)</Label>
                      <Input
                        value={award.icon}
                        onChange={(e) => {
                          const updated = [...editedAwards];
                          updated[index].icon = e.target.value;
                          setEditedAwards(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Posição</Label>
                      <Input
                        value={award.position}
                        onChange={(e) => {
                          const updated = [...editedAwards];
                          updated[index].position = e.target.value;
                          setEditedAwards(updated);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Prêmio</Label>
                    <Input
                      value={award.prize}
                      onChange={(e) => {
                        const updated = [...editedAwards];
                        updated[index].prize = e.target.value;
                        setEditedAwards(updated);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuração de Pontuação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <Label>Pontos por Kill</Label>
                  <Input
                    type="number"
                    value={editedScoring.killPoints}
                    onChange={(e) => setEditedScoring({
                      ...editedScoring,
                      killPoints: parseInt(e.target.value) || 0
                    })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Pontuação por Posição</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {editedScoring.positionPoints.map((points, index) => (
                      <div key={index} className="space-y-1">
                        <Label className="text-xs">{index + 1}º</Label>
                        <Input
                          type="number"
                          value={points}
                          onChange={(e) => {
                            const newPoints = [...editedScoring.positionPoints];
                            newPoints[index] = parseInt(e.target.value) || 0;
                            setEditedScoring({
                              ...editedScoring,
                              positionPoints: newPoints
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveAwardsAndScoring} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Salvar Premiações e Pontuação
            </Button>
          </TabsContent>

          <TabsContent value="pwa" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">PWA & Notificações</h2>
            </div>
            <NotificationManager />
            <Card>
              <CardHeader>

                <CardTitle className="text-base">Status do PWA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Service Worker:</span>
                    <p className="font-medium">
                      {'serviceWorker' in navigator ? '✅ Suportado' : '❌ Não suportado'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Notificações:</span>
                    <p className="font-medium">
                      {'Notification' in window ? '✅ Suportado' : '❌ Não suportado'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Permissão:</span>
                    <p className="font-medium">
                      {typeof Notification !== 'undefined' ? Notification.permission : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modo:</span>
                    <p className="font-medium">
                      {window.matchMedia('(display-mode: standalone)').matches ? 'Instalado' : 'Navegador'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Testar Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Teste o sistema de notificações push do aplicativo.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={async () => {
                      const permission = await requestNotificationPermission();
                      if (permission === 'granted') {
                        toast({ title: 'Permissão concedida!', description: 'Você receberá notificações.' });
                      } else {
                        toast({
                          title: 'Permissão negada',
                          description: 'Ative nas configurações do navegador.',
                          variant: 'destructive'
                        });
                      }
                    }}
                    className="w-full"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Solicitar Permissão
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        await sendTestNotification(
                          'SUPER COPA FF',
                          'Teste de notificação! O sistema está funcionando perfeitamente. 🎮🏆'
                        );
                        toast({ title: 'Notificação enviada!', description: 'Verifique sua central de notificações.' });
                      } catch (error) {
                        toast({
                          title: 'Erro ao enviar',
                          description: 'Solicite permissão primeiro.',
                          variant: 'destructive'
                        });
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Enviar Notificação Teste
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Como Instalar (Mobile)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Abra o menu do navegador (⋮ ou ⋯)</li>
                  <li>Procure por "Adicionar à tela inicial" ou "Instalar app"</li>
                  <li>Confirme a instalação</li>
                  <li>O ícone aparecerá na sua tela inicial</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supabase" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Conexão Supabase</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  O Supabase é usado para armazenar todos os dados do aplicativo de forma persistente.
                </p>
                <p>
                  <strong>Tabelas criadas:</strong>
                </p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>ranking</strong> - Times, pontos, vitórias e kills</li>
                  <li><strong>rules</strong> - Regras do campeonato</li>
                  <li><strong>awards</strong> - Premiações</li>
                  <li><strong>config</strong> - Configurações gerais do app</li>
                </ul>
                <p className="mt-3">
                  📖 Consulte <code className="text-xs bg-muted px-1 py-0.5 rounded">SUPABASE_SETUP.md</code> para instruções detalhadas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
