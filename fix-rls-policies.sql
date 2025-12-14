-- CORREÇÃO DAS POLÍTICAS RLS - Execute este script no SQL Editor do Supabase

-- Deletar políticas antigas que estão muito restritivas
DROP POLICY IF EXISTS "Permitir inserção para autenticados" ON public.ranking;
DROP POLICY IF EXISTS "Permitir atualização para autenticados" ON public.ranking;
DROP POLICY IF EXISTS "Permitir exclusão para autenticados" ON public.ranking;
DROP POLICY IF EXISTS "Permitir inserção de regras para autenticados" ON public.rules;
DROP POLICY IF EXISTS "Permitir atualização de regras para autenticados" ON public.rules;
DROP POLICY IF EXISTS "Permitir exclusão de regras para autenticados" ON public.rules;
DROP POLICY IF EXISTS "Permitir inserção de premiações para autenticados" ON public.awards;
DROP POLICY IF EXISTS "Permitir atualização de premiações para autenticados" ON public.awards;
DROP POLICY IF EXISTS "Permitir exclusão de premiações para autenticados" ON public.awards;
DROP POLICY IF EXISTS "Permitir inserção de config para autenticados" ON public.config;
DROP POLICY IF EXISTS "Permitir atualização de config para autenticados" ON public.config;
DROP POLICY IF EXISTS "Permitir exclusão de config para autenticados" ON public.config;

-- Criar políticas LIBERADAS (permitir todas operações - use com cuidado!)
-- NOTA: Isso permite que qualquer um com a chave anon possa modificar dados
-- Para produção, você deve implementar autenticação adequada

-- RANKING - Políticas liberadas
CREATE POLICY "Permitir todas operações em ranking"
    ON public.ranking
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- RULES - Políticas liberadas
CREATE POLICY "Permitir todas operações em regras"
    ON public.rules
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- AWARDS - Políticas liberadas
CREATE POLICY "Permitir todas operações em premiações"
    ON public.awards
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- CONFIG - Políticas liberadas
CREATE POLICY "Permitir todas operações em config"
    ON public.config
    FOR ALL
    USING (true)
    WITH CHECK (true);
