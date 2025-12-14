# 🚀 Configuração do Supabase - SUPER COPA FF

Este guia explica como configurar o Supabase para armazenar todos os dados do aplicativo.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Nome**: `super-copa-ff`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a mais próxima
5. Clique em **"Create new project"**

### 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (no menu lateral)
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** ou pressione `Ctrl+Enter`
6. Aguarde a mensagem de sucesso ✅

### 3. Obter Credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie os seguintes valores:
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública)

### 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie o arquivo `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
   ```

3. **IMPORTANTE**: O arquivo `.env` já está no `.gitignore`, não o commit!

### 5. Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:

1. **`ranking`** - Armazena o ranking dos times
   - `id`, `position`, `team`, `points`, `wins`, `kills`

2. **`rules`** - Armazena as regras do campeonato
   - `id`, `title`, `description`, `order`

3. **`awards`** - Armazena as premiações
   - `id`, `position`, `prize`, `icon`, `order`

4. **`config`** - Armazena configurações do app
   - `id`, `key`, `value` (JSONB)

### Políticas de Segurança (RLS):

- ✅ **Leitura pública**: Qualquer pessoa pode ver os dados
- ✅ **Escrita autenticada**: Apenas usuários autenticados podem modificar

## 🔐 Autenticação (Opcional)

Para habilitar autenticação no painel admin:

1. No Supabase, vá em **Authentication** → **Providers**
2. Habilite **Email** como provider
3. Configure conforme necessário

## 📝 Uso no Código

### Buscar Ranking:

```typescript
import { supabaseService } from '@/lib/supabaseService';

const ranking = await supabaseService.getRanking();
```

### Adicionar Item ao Ranking:

```typescript
await supabaseService.createRankingEntry({
  position: 1,
  team: 'Time A',
  points: 100,
  wins: 10,
  kills: 50
});
```

### Atualizar Configuração:

```typescript
await supabaseService.setConfig('ranking_title', 'SUPER COPA FF 2024');
```

## 🆘 Solução de Problemas

### Erro: "Invalid API key"
- Verifique se copiou a chave correta
- Confirme que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento

### Erro: "relation does not exist"
- Execute o script SQL novamente no SQL Editor
- Verifique se todas as tabelas foram criadas

### Erro de Permissão
- Verifique as políticas RLS no SQL Editor
- Teste com `SELECT * FROM ranking` no SQL Editor

## 📚 Recursos

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Próximos Passos

Após configurar o Supabase:

1. ✅ Integrar com `DataContext` para carregar dados do banco
2. ✅ Atualizar painel Admin para salvar no Supabase
3. ✅ Implementar upload de imagens (opcional)
4. ✅ Configurar autenticação para o painel Admin

---

**Dúvidas?** Consulte a documentação oficial ou abra uma issue!
