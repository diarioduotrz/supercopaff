import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later
            setDeferredPrompt(e);
            // Show custom install prompt
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // localStorage dismissal removed
    };

    // Check local storage removed
    useEffect(() => {
        // No persistent check
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-4 pb-4">
            <div className="max-w-lg mx-auto bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Download className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">Instalar SUPER COPA</h3>
                    <p className="text-xs text-muted-foreground">
                        Adicione à tela inicial para acesso rápido
                    </p>
                </div>
                <Button onClick={handleInstall} size="sm">
                    Instalar
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDismiss}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
