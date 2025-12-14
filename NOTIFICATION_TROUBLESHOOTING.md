# 🔔 Guia de Troubleshooting - Notificações PWA

## ❌ Problema: Notificações não aparecem

### ✅ Soluções (em ordem):

## 1. **Testar Notificação Simples (Console)**

Abra o **Console do Navegador** (F12) e execute:

```javascript
// 1. Verificar permissão
console.log('Permissão:', Notification.permission);

// 2. Solicitar permissão
await Notification.requestPermission();

// 3. Testar notificação direta
new Notification('Teste', {
  body: 'Se você vê isso, notificações funcionam!',
  icon: '/icon.svg'
});
```

### ✅ Se a notificação aparecer:
- O problema é no código do app
- Continue para o passo 2

### ❌ Se NÃO aparecer:
- Problema está no navegador/SO
- Vá para o passo 4

---

## 2. **Verificar Service Worker**

No Console (F12):

```javascript
// Verificar se SW está registrado
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});

// Verificar estado
navigator.serviceWorker.ready.then(reg => {
  console.log('SW Ready:', reg);
});
```

**Problema comum:** Service Worker não está carregado em localhost

---

## 3. **Testar via Painel Admin**

1. **Painel Admin** → Aba **PWA**
2. Clique em **"Solicitar Permissão"**
3. Na popup do navegador, clique **"Permitir"**
4. Preencha título e mensagem
5. Clique em **"Enviar para Todos os Usuários"**

**Observe o console** para erros

---

## 4. **Configurações do Windows/Chrome**

### Windows 10/11:

1. **Configurações do Windows**
2. **Sistema** → **Notificações e ações**
3. Verifique se **Google Chrome** está ATIVADO
4. Verifique "Modo não perturbe" (deve estar DESATIVADO)

### Chrome (Navegador):

1. **Configurações** (chrome://settings/content/notifications)
2. Verifique se "Sites podem perguntar para enviar notificações" está ATIVADO
3. Verifique se localhost:8080 está na lista de PERMITIDOS

---

## 5. **Solução Alternativa - Notificação Direta**

Adicione este código de teste temporário no NotificationManager:

```tsx
// Botão de teste direto
<Button
  onClick={() => {
    if (Notification.permission === 'granted') {
      new Notification('Teste Direto', {
        body: 'Notificação direta sem Service Worker',
        icon: '/icon.svg'
      });
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Teste Direto', {
            body: 'Permissão concedida!',
            icon: '/icon.svg'
          });
        }
      });
    }
  }}
>
  🔔 Teste Direto
</Button>
```

---

## 6. **Checklist Rápido**

| Item | Status | Como Verificar |
|------|--------|----------------|
| Permissão concedida | ⬜ | `Notification.permission` no console |
| Service Worker ativo | ⬜ | F12 → Application → Service Workers |
| Console sem erros | ⬜ | F12 → Console (procure erros em vermelho) |
| Windows permite Chrome | ⬜ | Configurações → Sistema → Notificações |
| Localhost permite notif | ⬜ | chrome://settings/content/notifications |

---

##  7. **Teste Final - Código Completo**

Cole isso no **Console** (F12):

```javascript
// Teste completo
async function testarNotificacao() {
  console.log('1. Verificando suporte...');
  if (!('Notification' in window)) {
    console.error('❌ Navegador não suporta notificações');
    return;
  }
  
  console.log('2. Permissão atual:', Notification.permission);
  
  if (Notification.permission !== 'granted') {
    console.log('3. Solicitando permissão...');
    const permission = await Notification.requestPermission();
    console.log('4. Permissão:', permission);
    
    if (permission !== 'granted') {
      console.error('❌ Permissão negada');
      return;
    }
  }
  
  console.log('5. Enviando notificação...');
  new Notification('🏆 SUPER COPA FF', {
    body: '✅ Notificações funcionando! 🎮',
    icon: '/icon.svg',
    tag: 'teste-' + Date.now()
  });
  
  console.log('✅ Notificação enviada!');
}

testarNotificacao();
```

---

## 🎯 Resultado Esperado

Você deve ver:
1. ✅ Console: "Notificação enviada!"
2. ✅ Popup de notificação no canto da tela
3. ✅ Som (se ativado no Windows)

---

## 🆘 Ainda não funciona?

1. **Reinicie o Chrome completamente**
2. **Teste em modo anônimo** (Ctrl+Shift+N)
3. **Teste em outro navegador** (Edge, Firefox)
4. **Verifique antivírus/firewall**

---

**💡 DICA:** Localhost às vezes tem problemas com PWA.  
Para produção, sempre use HTTPS!
