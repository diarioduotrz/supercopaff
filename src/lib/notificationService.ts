import { supabase } from './supabase';

export interface NotificationRecord {
    id: string;
    title: string;
    message: string;
    sent_at: string;
    sent_by?: string;
    status: string;
    created_at: string;
}

export const notificationService = {
    // Salvar notificação no histórico
    async saveNotification(title: string, message: string, sentBy?: string): Promise<NotificationRecord> {
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                title,
                message,
                sent_by: sentBy || 'Sistema',
                status: 'sent'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Buscar histórico de notificações
    async getNotifications(limit: number = 50): Promise<NotificationRecord[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('sent_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    // Buscar notificação por ID
    async getNotificationById(id: string): Promise<NotificationRecord | null> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Deletar notificação
    async deleteNotification(id: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
