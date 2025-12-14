-- TABELA DE NOTIFICAÇÕES PUSH
-- Execute este script no SQL Editor do Supabase

-- Tabela para armazenar histórico de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    sent_by TEXT,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscar por data
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON public.notifications(sent_at DESC);

-- Trigger para updated_at
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS - Política de leitura pública
CREATE POLICY "Permitir leitura pública de notificações"
    ON public.notifications FOR SELECT
    USING (true);

-- RLS - Política de escrita liberada (ajuste conforme necessário)
CREATE POLICY "Permitir todas operações em notificações"
    ON public.notifications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
