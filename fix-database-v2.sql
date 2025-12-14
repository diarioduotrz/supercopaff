-- SCRIPT CORRIGIDO DE BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase para corrigir TODOS os problemas de salvamento

-- 1. Helper Function para updated_at (Recria para garantir existência)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Corrigir Tabela NOTIFICATIONS (Se não existir cria, se existir altera)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    sent_by TEXT,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar updated_at se faltar (Para corrigir bug anterior)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'updated_at') THEN
        ALTER TABLE public.notifications ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Recriar trigger de notifications
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Habilitar RLS em todas as tabelas
ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. DROPAR POLÍTICAS ANTIGAS (Para limpar conflitos)
DROP POLICY IF EXISTS "Permitir leitura pública de notificações" ON public.notifications;
DROP POLICY IF EXISTS "Permitir todas operações em notificações" ON public.notifications;

DROP POLICY IF EXISTS "Permitir todas operações em ranking" ON public.ranking;
DROP POLICY IF EXISTS "Permitir todas operações em regras" ON public.rules;
DROP POLICY IF EXISTS "Permitir todas operações em premiações" ON public.awards;
DROP POLICY IF EXISTS "Permitir todas operações em config" ON public.config;

-- Dropar políticas restritivas antigas se ainda existirem
DROP POLICY IF EXISTS "Permitir inserção para autenticados" ON public.ranking;
DROP POLICY IF EXISTS "Permitir atualização para autenticados" ON public.ranking;
DROP POLICY IF EXISTS "Permitir exclusão para autenticados" ON public.ranking;

-- 5. CRIAR POLÍTICAS PERMISSIVAS (Corrige o erro de "não salva")
-- RANKING
CREATE POLICY "Permitir todas operações em ranking"
    ON public.ranking FOR ALL USING (true) WITH CHECK (true);

-- RULES
CREATE POLICY "Permitir todas operações em regras"
    ON public.rules FOR ALL USING (true) WITH CHECK (true);

-- AWARDS
CREATE POLICY "Permitir todas operações em premiações"
    ON public.awards FOR ALL USING (true) WITH CHECK (true);

-- CONFIG
CREATE POLICY "Permitir todas operações em config"
    ON public.config FOR ALL USING (true) WITH CHECK (true);

-- NOTIFICATIONS
CREATE POLICY "Permitir todas operações em notificações"
    ON public.notifications FOR ALL USING (true) WITH CHECK (true);
