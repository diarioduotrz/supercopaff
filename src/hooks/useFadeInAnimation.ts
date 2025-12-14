import { useEffect } from 'react';

/**
 * Hook para aplicar animações de fade-in gradativas aos elementos da página
 * @param selector - Seletor CSS dos elementos que devem ser animados (padrão: elementos com data-animate)
 * @param delayIncrement - Incremento de delay entre elementos em ms (padrão: 100ms)
 */
export function useFadeInAnimation(
    selector: string = '[data-animate]',
    delayIncrement: number = 100
) {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element, index) => {
            const htmlElement = element as HTMLElement;

            // Adiciona a classe de animação
            htmlElement.classList.add('animate-fade-in-up');

            // Calcula e aplica o delay
            const delay = index * delayIncrement;
            htmlElement.style.animationDelay = `${delay}ms`;
        });

        // Cleanup: remove animações quando o componente desmontar
        return () => {
            elements.forEach((element) => {
                const htmlElement = element as HTMLElement;
                htmlElement.classList.remove('animate-fade-in-up');
                htmlElement.style.animationDelay = '';
            });
        };
    }, [selector, delayIncrement]);
}
