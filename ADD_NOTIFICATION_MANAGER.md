# INSTRUÇÕES: Adicionar NotificationManager no AdminPage.tsx

## ✅ JÁ FEITO:
1. Import adicionado na linha 16:
   ```tsx
   import { NotificationManager } from '@/components/NotificationManager';
   ```

## ⚠️ FAZER MANUALMENTE:

### Passo 1: Abra o arquivo
`src/pages/AdminPage.tsx`

### Passo 2: Encontre a linha 717
Procure por:
```tsx
</div>

<Card>
  <CardHeader>
    <CardTitle className="text-base">Status do PWA</CardTitle>
```

### Passo 3: Adicione o NotificationManager
**ENTRE** `</div>` e `<Card>`, adicione:

```tsx
</div>

<NotificationManager />

<Card>
  <CardHeader>
```

## RESULTADO FINAL (linhas 716-720):

```tsx
            </div>

            <NotificationManager />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status do PWA</CardTitle>
```

## ✅ Após salvar:
- Recarregue o navegador
- Abra Painel Admin → aba PWA
- Você verá os campos para enviar notificações!

---

**NOTA:** O componente NotificationManager já está criado e pronto. 
Só precisa ser importado (✅ já feito) e usado (⚠️ fazer manualmente).
