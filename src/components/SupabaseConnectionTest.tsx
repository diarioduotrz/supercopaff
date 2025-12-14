import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/lib/supabaseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, Database } from 'lucide-react';

export function SupabaseConnectionTest() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [message, setMessage] = useState('Testando conexão...');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        try {
            setStatus('loading');
            setMessage('Verificando conexão com Supabase...');

            // Teste 1: Verificar se as credenciais estão configuradas
            const url = import.meta.env.VITE_SUPABASE_URL;
            const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!url || !key || url.includes('your-project-url') || key.includes('your-anon-key')) {
                throw new Error('Credenciais do Supabase não configuradas corretamente no .env');
            }

            // Teste 2: Tentar buscar dados de uma tabela
            const { data: ranking, error: rankingError } = await supabase
                .from('ranking')
                .select('*')
                .limit(1);

            if (rankingError) {
                throw rankingError;
            }

            // Teste 3: Buscar configurações
            const { data: config, error: configError } = await supabase
                .from('config')
                .select('*')
                .limit(1);

            if (configError && configError.code !== 'PGRST116') {
                throw configError;
            }

            // Teste 4: Contar registros em cada tabela
            const [
                { count: rankingCount },
                { count: rulesCount },
                { count: awardsCount },
                { count: configCount }
            ] = await Promise.all([
                supabase.from('ranking').select('*', { count: 'exact', head: true }),
                supabase.from('rules').select('*', { count: 'exact', head: true }),
                supabase.from('awards').select('*', { count: 'exact', head: true }),
                supabase.from('config').select('*', { count: 'exact', head: true })
            ]);

            setDetails({
                url: url.substring(0, 30) + '...',
                tables: {
                    ranking: rankingCount || 0,
                    rules: rulesCount || 0,
                    awards: awardsCount || 0,
                    config: configCount || 0
                }
            });

            setStatus('connected');
            setMessage('✅ Conectado com sucesso ao Supabase!');
        } catch (error: any) {
            console.error('Erro de conexão:', error);
            setStatus('error');
            setMessage(`❌ Erro: ${error.message || 'Falha ao conectar'}`);
            setDetails({ error: error.message, code: error.code });
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    Teste de Conexão Supabase
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                    {status === 'connected' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                    <span className={
                        status === 'connected' ? 'text-green-600 font-medium' :
                            status === 'error' ? 'text-red-600 font-medium' :
                                'text-muted-foreground'
                    }>
                        {message}
                    </span>
                </div>

                {details && status === 'connected' && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-semibold">Detalhes da Conexão:</p>
                        <div className="text-sm space-y-1">
                            <p><strong>URL:</strong> {details.url}</p>
                            <p className="font-semibold mt-3">Registros nas Tabelas:</p>
                            <ul className="space-y-1 ml-4">
                                <li>📊 Ranking: {details.tables.ranking} times</li>
                                <li>📜 Regras: {details.tables.rules} regras</li>
                                <li>🏆 Premiações: {details.tables.awards} prêmios</li>
                                <li>⚙️ Configurações: {details.tables.config} itens</li>
                            </ul>
                        </div>
                    </div>
                )}

                {details && status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-semibold text-red-600">Detalhes do Erro:</p>
                        <div className="text-sm text-red-600 space-y-1">
                            {details.error && <p>{details.error}</p>}
                            {details.code && <p><strong>Código:</strong> {details.code}</p>}
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-semibold">Possíveis soluções:</p>
                            <ul className="list-disc ml-5 space-y-1 mt-1">
                                <li>Verifique se executou o script SQL no Supabase</li>
                                <li>Confirme que as credenciais no .env estão corretas</li>
                                <li>Reinicie o servidor de desenvolvimento</li>
                                <li>Verifique as políticas RLS no Supabase</li>
                            </ul>
                        </div>
                    </div>
                )}

                <button
                    onClick={testConnection}
                    className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Testando...' : 'Testar Novamente'}
                </button>
            </CardContent>
        </Card>
    );
}
