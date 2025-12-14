# PWA Setup - SUPER COPA FF

## Ícones necessários

Para completar a configuração do PWA, você precisa adicionar os seguintes ícones na pasta `public/`:

### icon-192x192.png
- Tamanho: 192x192 pixels
- Formato: PNG
- Design sugerido: Logo SUPER COPA FF com fundo escuro e detalhes em laranja

### icon-512x512.png  
- Tamanho: 512x512 pixels
- Formato: PNG
- Design sugerido: Mesmo design do ícone 192x192, em alta resolução

## Como criar os ícones:

1. Use uma ferramenta de design (Canva, Figma, etc.)
2. Crie um design quadrado com:
   - Fundo: #0a0a0a (preto escuro)
   - Cor principal: #f97316 (laranja)
   - Símbolo: Troféu ou chama estilizada
   - Texto: "SC" ou "SUPER COPA"

3. Exporte em 2 tamanhos: 192x192 e 512x512
4. Coloque os arquivos na pasta `public/` com os nomes exatos:
   - `icon-192x192.png`
   - `icon-512x512.png`

## Ferramentas online para criar ícones PWA:

- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/
- https://realfavicongenerator.net/

## Testar o PWA:

1. Execute `npm run build` para build de produção
2. Sirva os arquivos com um servidor local
3. Abra no navegador (Chrome/Edge)
4. Veja se aparece o botão "Instalar aplicativo"
5. Teste as notificações no painel Admin

## Notificações Push:

Para produção, você precisará:
1. Gerar chaves VAPID (https://web-push-codelab.glitch.me/)
2. Substituir a chave placeholder em `src/lib/pwa.ts`
3. Configurar um backend para enviar notificações
