import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, History, Trash2, Loader2 } from 'lucide-react';
import { sendTestNotification } from '@/lib/pwa';
import { notificationService, NotificationRecord } from '@/lib/notificationService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotificationManager() {
    const [title, setTitle] = useState('SUPER COPA FF');
    const [message, setMessage] = useState('Nova atualização disponível! 🎮🏆');
    const [isSending, setIsSending] = useState(false);
    const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setIsLoadingHistory(true);
        try {
            const data = await notificationService.getNotifications(20);
            setNotifications(data);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            toast({
                title: 'Campos obrigatórios',
                description: 'Preencha o título e a mensagem',
                variant: 'destructive',
            });
            return;
        }

        setIsSending(true);
        try {
            // Enviar notificação push
            await sendTestNotification(title, message);

            // Salvar no histórico
            await notificationService.saveNotification(title, message, 'Admin');

            toast({
                title: 'Notificação enviada!',
                description: 'Os usuários do app receberão a notificação.',
            });

            // Recarregar histórico
            await loadNotifications();

            // Limpar campos (opcional)
            // setTitle('SUPER COPA FF');
            // setMessage('');
        } catch (error: any) {
            console.error('Erro ao enviar:', error);
            toast({
                title: 'Erro ao enviar',
                description: error.message || 'Verifique se as permissões estão ativadas.',
                variant: 'destructive',
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            toast({
                title: 'Notificação removida',
                description: 'A notificação foi removida do histórico.',
            });
            await loadNotifications();
        } catch (error) {
            toast({
                title: 'Erro ao remover',
                description: 'Não foi possível remover a notificação.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-4">
            {/* Card para compor e enviar */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Enviar Notificação Push
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="notification-title">Título</Label>
                        <Input
                            id="notification-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="SUPER COPA FF"
                            maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                            Máximo 50 caracteres
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notification-message">Mensagem</Label>
                        <Textarea
                            id="notification-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nova atualização disponível! 🎮🏆"
                            rows={4}
                            maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground">
                            Máximo 200 caracteres • Use emojis para destacar 🔥⚡🎯
                        </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold mb-2">📱 Preview:</p>
                        <div className="bg-background p-3 rounded-md border border-border">
                            <p className="font-bold text-sm">{title || 'Título'}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {message || 'Mensagem da notificação'}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleSendNotification}
                        disabled={isSending || !title.trim() || !message.trim()}
                        className="w-full"
                        size="lg"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Enviar para Todos os Usuários
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        ⚠️ A notificação será enviada para todos os usuários que autorizaram notificações
                    </p>
                </CardContent>
            </Card>

            {/* Card de histórico */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Histórico de Notificações
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadNotifications}
                        disabled={isLoadingHistory}
                    >
                        {isLoadingHistory ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            'Atualizar'
                        )}
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoadingHistory ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mt-2">Carregando...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8">
                            <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Nenhuma notificação enviada ainda
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="font-semibold">{notification.title}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span>
                                                    📅 {format(new Date(notification.sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                </span>
                                                {notification.sent_by && (
                                                    <span>👤 {notification.sent_by}</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteNotification(notification.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
