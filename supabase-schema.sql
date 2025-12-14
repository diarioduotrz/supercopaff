-- SUPER COPA FF - Database Schema
-- Execute este script no SQL Editor do Supabase

-- Tabela de Ranking
CREATE TABLE IF NOT EXISTS public.ranking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position INTEGER NOT NULL,
    team TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    kills INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Regras
CREATE TABLE IF NOT EXISTS public.rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Premiações
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position TEXT NOT NULL,
    prize TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '🏆',
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS public.config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ranking_position ON public.ranking(position);
CREATE INDEX IF NOT EXISTS idx_rules_order ON public.rules("order");
CREATE INDEX IF NOT EXISTS idx_awards_order ON public.awards("order");
CREATE INDEX IF NOT EXISTS idx_config_key ON public.config(key);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_ranking_updated_at BEFORE UPDATE ON public.ranking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON public.rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON public.awards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON public.config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - Leitura pública
CREATE POLICY "Permitir leitura pública de ranking"
    ON public.ranking FOR SELECT
    USING (true);

CREATE POLICY "Permitir leitura pública de regras"
    ON public.rules FOR SELECT
    USING (true);

CREATE POLICY "Permitir leitura pública de premiações"
    ON public.awards FOR SELECT
    USING (true);

CREATE POLICY "Permitir leitura pública de configurações"
    ON public.config FOR SELECT
    USING (true);

-- Políticas de segurança - Escrita apenas para usuários autenticados
CREATE POLICY "Permitir inserção para autenticados"
    ON public.ranking FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização para autenticados"
    ON public.ranking FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir exclusão para autenticados"
    ON public.ranking FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserção de regras para autenticados"
    ON public.rules FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de regras para autenticados"
    ON public.rules FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir exclusão de regras para autenticados"
    ON public.rules FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserção de premiações para autenticados"
    ON public.awards FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de premiações para autenticados"
    ON public.awards FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir exclusão de premiações para autenticados"
    ON public.awards FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserção de config para autenticados"
    ON public.config FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de config para autenticados"
    ON public.config FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir exclusão de config para autenticados"
    ON public.config FOR DELETE
    TO authenticated
    USING (true);

-- Dados iniciais de exemplo (opcional)
INSERT INTO public.config (key, value) VALUES
    ('ranking_title', '"SUPER COPA FF"'),
    ('ranking_subtitle', '"Ranking Oficial do Campeonato"'),
    ('show_title', 'true'),
    ('show_subtitle', 'true'),
    ('banner_image', 'null')
ON CONFLICT (key) DO NOTHING;
