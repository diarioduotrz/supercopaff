# Animações Gradativas - Documentação

## 📖 Visão Geral

Este projeto possui um sistema de animações gradativas (fade-in com slide-up) que faz os elementos da página aparecerem de forma sequencial e suave, criando uma experiência visual agradável.

## 🎨 O que foi implementado

### 1. **CSS Animations** (`src/index.css`)

Foram adicionadas as seguintes animações:

- **fadeInUp**: Elementos sobem 30px e desvanecem de opacidade 0 para 1
- **fadeIn**: Elementos apenas desvanecem de opacidade 0 para 1

Classes disponíveis:
- `.animate-fade-in-up` - Animação com movimento vertical
- `.animate-fade-in` - Animação apenas de opacidade
- `.delay-0` até `.delay-1500` - Delays progressivos de 0ms a 1500ms

### 2. **Hook React** (`src/hooks/useFadeInAnimation.ts`)

Um hook personalizado que:
- Detecta automaticamente elementos com `data-animate`
- Aplica animações com delays progressivos
- Limpa as animações quando o componente é desmontado

**Parâmetros:**
- `selector` (padrão: `'[data-animate]'`) - Seletor CSS dos elementos a animar
- `delayIncrement` (padrão: `100`) - Incremento de delay em ms entre elementos

### 3. **Páginas com Animações**

As seguintes páginas já foram configuradas:
- ✅ `RankingPage.tsx` (delay: 80ms)
- ✅ `RulesPage.tsx` (delay: 100ms)
- ✅ `AwardsPage.tsx` (delay: 100ms)

## 🚀 Como usar em outras páginas

### Passo 1: Importar o hook

```tsx
import { useFadeInAnimation } from '@/hooks/useFadeInAnimation';
```

### Passo 2: Chamar o hook no componente

```tsx
export function MinhaPage() {
  // Ativa animações com delay de 100ms entre elementos
  useFadeInAnimation('[data-animate]', 100);
  
  return (
    // ... seu código
  );
}
```

### Passo 3: Adicionar `data-animate` aos elementos

```tsx
// Em um card individual
<Card data-animate>
  {/* conteúdo */}
</Card>

// Em um wrapper de componente
<div data-animate>
  <PageHeader title="Título" />
</div>

// Em uma lista
{items.map((item) => (
  <Card key={item.id} data-animate>
    {/* conteúdo */}
  </Card>
))}
```

## 🎯 Exemplos de uso

### Exemplo 1: Cards em lista

```tsx
export function ExemploPage() {
  useFadeInAnimation('[data-animate]', 120);
  
  return (
    <div className="space-y-4">
      <div data-animate>
        <PageHeader title="Exemplo" />
      </div>
      
      {items.map((item, index) => (
        <Card key={index} data-animate>
          <CardContent>{item.content}</CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Exemplo 2: Seções diferentes

```tsx
export function OutroExemploPage() {
  useFadeInAnimation('[data-animate]', 150);
  
  return (
    <div>
      <section data-animate>
        <h2>Seção 1</h2>
      </section>
      
      <section data-animate>
        <h2>Seção 2</h2>
      </section>
      
      <section data-animate>
        <h2>Seção 3</h2>
      </section>
    </div>
  );
}
```

## ⚙️ Customização

### Ajustar velocidade da animação

Edite `src/index.css`:

```css
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards; /* Era 0.6s */
  opacity: 0;
}
```

### Ajustar distância do movimento

Edite `src/index.css`:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px); /* Era 30px */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Criar delays maiores

Adicione mais classes em `src/index.css`:

```css
.delay-2000 {
  animation-delay: 2000ms;
}
```

## 💡 Dicas

1. **Delay incremento**: Use valores menores (60-80ms) para muitos elementos, maiores (120-150ms) para poucos
2. **Performance**: Evite animar centenas de elementos simultaneamente
3. **Acessibilidade**: As animações respeitam `prefers-reduced-motion` (pode ser implementado se necessário)
4. **Mobile**: As animações funcionam bem em dispositivos móveis

## 🐛 Solução de Problemas

**Animação não aparece:**
- Verifique se importou o hook corretamente
- Confirme que `data-animate` está no elemento
- Certifique-se de que o hook está sendo chamado no componente

**Animação muito rápida/lenta:**
- Ajuste o segundo parâmetro do hook: `useFadeInAnimation('[data-animate]', VALOR_EM_MS)`

**Elementos piscando:**
- Verifique se há conflitos de CSS
- Confirme que não há múltiplas chamadas do hook no mesmo seletor

## 📝 Notas

- Os warnings de `@tailwind` e `@apply` no CSS são normais com TailwindCSS
- As animações são aplicadas automaticamente quando o componente é renderizado
- O hook limpa as animações quando o componente é desmontado
