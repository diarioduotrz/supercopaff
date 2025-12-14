# Mudanças no AdminPage.tsx

## 1. Aba Supabase foi removida

- ✅ Removido import Database
- ✅ TabsList alterado de grid-cols-6 para grid-cols-5
- ✅ Removido TabsTrigger "Supabase"
- ❌ Ainda precisa remover o TabsContent (linhas 821-850)

## 2. Campos PWA adicionados

- ✅ Adicionado estado `notificationTitle` e `notificationMessage`
- ❌ Ainda precisa adicionar os campos Input/Textarea na aba PWA

## Para completar manualmente:

### Passo 1: Deletar TabsContent Supabase
Encontre e delete as linhas 821-850 que contêm:
```tsx
<TabsContent value="supabase" className="space-y-4">
  ...
</TabsContent>
```

### Passo 2: Adicionar campos PWA
Antes do Card "Testar Notificações" (linha ~752), adicione:

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-base">Mensagem de Notificação</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="notification-title">Título da Notificação</Label>
      <Input
        id="notification-title"
        value={notificationTitle}
        onChange={(e) => setNotificationTitle(e.target.value)}
        placeholder="SUPER 'COP FF"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="notification-message">Mensagem</Label>
      <Textarea
        id="notification-message"
        value={notificationMessage}
        onChange={(e) => setNotificationMessage(e.target.value)}
        placeholder="Nova atualização disponível! 🎮🏆"
        rows={3}
      />
      <p className="text-xs text-muted-foreground">
        💡 Use emojis para tornar a notificação mais atrativa
      </p>
    </div>
  </CardContent>
</Card>
```

### Passo 3: Atualizar teste de notificação
Na linha ~784, altere de:
```tsx
await sendTestNotification(
  'SUPER COPA FF',
  'Teste de notificação! O sistema está funcionando perfeitamente. 🎮🏆'
);
```

Para:
```tsx
await sendTestNotification(
  notificationTitle,
  notificationMessage
);
```
