# Guia de Deploy na Vercel

## 1. Enviar Código para o GitHub
Certifique-se de que você já rodou o comando final no seu terminal para enviar o código:
```bash
git push -u origin main --force
```

## 2. Configurar Projeto na Vercel
1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** -> **"Project"**
3. Importe o repositório **diarioduotrz/supercopaff**
   - Se não aparecer, verifique se você deu permissão para a Vercel acessar seus repositórios no GitHub.

## 3. Configurar Variáveis de Ambiente (MUITO IMPORTANTE)
Antes de clicar em "Deploy", você precisa configurar as variáveis de ambiente para o site conseguir conectar no Supabase.

Na tela de configuração do projeto na Vercel, procure a seção **"Environment Variables"** e adicione estas duas:

| Name (Nome) | Value (Valor) |
|-------------|---------------|
| `VITE_SUPABASE_URL` | *Sua URL do Supabase* |
| `VITE_SUPABASE_ANON_KEY` | *Sua Chave Anon (Public) do Supabase* |

> **Onde encontrar esses valores?**
> No painel do Supabase: vá em **Settings (Ícone Engrenagem)** -> **API**.

## 4. Finalizar
4. Clique em **"Deploy"**.
5. Aguarde a construção do projeto.
6. Seu site estará no ar! 🚀
