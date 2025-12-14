# 📱 Sistema de Notificações Push PWA

## 🚀 Configuração Inicial

### 1. Executar Script SQL no Supabase

1. Acesse https://supabase.com
2. Vá em **SQL Editor**
3. Copie o conteúdo do arquivo `notifications-schema.sql`
4. Execute o script
5. ✅ Tabela `notifications` criada!

### 2. Importar Componente no AdminPage

Na aba PWA do painel admin, substitua o conteúdo por:

```tsx
import { NotificationManager } from '@/components/NotificationManager';

// Dentro do TabsContent value="pwa":
<TabsContent value="pwa" className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold">Notificações Push</h2>
  </div>

  <NotificationManager />
  
  {/* Resto do conteúdo PWA */}
</TabsContent>
```

## 📋 Como Usar

### Enviar Notificação

1. Acesse o **Painel Admin** → aba **PWA**
2. Preencha:
   - **Título**: Nome da notificação (máx 50 caracteres)
   - **Mensagem**: Texto da notificação (máx 200 caracteres)
3. Veja o **Preview** de como ficará
4. Clique em **"Enviar para Todos os Usuários"**
5. ✅ Notificação enviada!

### Funcionalidades

✅ **Envio Instantâneo** - Notificação enviada para todos os usuários
✅ **Preview em Tempo Real** - Veja como ficará antes de enviar
✅ **Histórico Completo** - Todas as notificações ficam salvas
✅ **Filtro de Data** - Ordenadas por mais recentes
✅ **Deletar Registro** - Remova notificações do histórico
✅ **Emojis Suportados** - Use 🎮🏆🔥⚡ para destacar

## 📊 Estrutura da Tabela

```sql
notifications
├─ id (UUID)
├─ title (TEXT) - Título da notificação
├─ message (TEXT) - Mensagem
├─ sent_at (TIMESTAMPTZ) - Data/hora de envio
├─ sent_by (TEXT) - Quem enviou
├─ status (TEXT) - Status (sent, failed, etc)
└─ created_at (TIMESTAMPTZ)
```

## 🎯 Exemplos de Notificações

### Atualização de Ranking
```
Título: 🏆 Ranking Atualizado!
Mensagem: Confira as novas posições do campeonato. Será que seu time subiu? 🔥
```

### Nova Rodada
```
Título: 🎮 Nova Rodada Começou!
Mensagem: A 3ª rodada da SUPER COPA FF já começou! Boa sorte! ⚡
```

### Premiação
```
Título: 💰 Premiação Disponível
Mensagem: As recompensas da última rodada já estão disponíveis! 🎁
```

### Mudança nas Regras
```
Título: 📜 Regras Atualizadas
Mensagem: Novas regras foram adicionadas. Confira agora! ⚠️
```

## 🔧 Personalização

### Alterar Limite de Histórico

Em `NotificationManager.tsx`, linha do `loadNotifications`:

```tsx
const data = await notificationService.getNotifications(50); // Altere o número
```

### Adicionar Agendamento

Você pode estender o sistema para agendar notificações futuras:

```tsx
// TODO: Adicionar campo de data/hora
// TODO: Criar cron job no Supabase
// TODO: Implementar envio automático
```

## ⚠️ Limitações Atuais

- ✅ Envio para **todos os usuários** (não segmentado)
- ✅ Histórico limitado a 20 notificações
- ✅ Sem agendamento (apenas envio instantâneo)
- ✅ Sem estatísticas de entrega

## 🚀 Melhorias Futuras

1. **Segmentação** - Enviar para grupos específicos
2. **Agendamento** - Programar envio futuro
3. **Estatísticas** - Taxa de entrega e cliques
4. **Templates** - Modelos prontos de notificações
5. **Rich Notifications** - Imagens e ações

## 📞 Suporte

Para problemas ou dúvidas:
- Verifique se o script SQL foi executado
- Confirme que o arquivo foi importado corretamente
- Teste a conexão com Supabase na aba Admin

---

**🎉 Agora você tem controle total das notificações do seu app!**
