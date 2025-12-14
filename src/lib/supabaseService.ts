import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type RankingRow = Database['public']['Tables']['ranking']['Row'];
type RulesRow = Database['public']['Tables']['rules']['Row'];
type AwardsRow = Database['public']['Tables']['awards']['Row'];

export const supabaseService = {
    // RANKING
    async getRanking() {
        const { data, error } = await supabase
            .from('ranking')
            .select('*')
            .order('position', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async createRankingEntry(entry: Omit<RankingRow, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('ranking')
            .insert(entry)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateRankingEntry(id: string, updates: Partial<RankingRow>) {
        const { data, error } = await supabase
            .from('ranking')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async upsertRankingEntry(entry: Partial<RankingRow>) {
        // Remove id if it looks like a temporary ID (numbers or short strings)
        // UUIDs are 36 chars. Date.now() is much shorter.
        const entryToSave = { ...entry };
        if (entry.id && entry.id.length < 30) {
            delete entryToSave.id;
        }

        const { data, error } = await supabase
            .from('ranking')
            .upsert(entryToSave as any)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteRankingEntry(id: string) {
        const { error } = await supabase
            .from('ranking')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // REGRAS
    async getRules() {
        const { data, error } = await supabase
            .from('rules')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async createRule(rule: Omit<RulesRow, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('rules')
            .insert(rule)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateRule(id: string, updates: Partial<RulesRow>) {
        const { data, error } = await supabase
            .from('rules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async upsertRule(rule: Partial<RulesRow>) {
        const ruleToSave = { ...rule };
        if (rule.id && rule.id.length < 30) {
            delete ruleToSave.id;
        }

        const { data, error } = await supabase
            .from('rules')
            .upsert(ruleToSave as any)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteRule(id: string) {
        const { error } = await supabase
            .from('rules')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // PREMIAÇÕES
    async getAwards() {
        const { data, error } = await supabase
            .from('awards')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async createAward(award: Omit<AwardsRow, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('awards')
            .insert(award)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateAward(id: string, updates: Partial<AwardsRow>) {
        const { data, error } = await supabase
            .from('awards')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async upsertAward(award: Partial<AwardsRow>) {
        const awardToSave = { ...award };
        if (award.id && award.id.length < 30) {
            delete awardToSave.id;
        }

        const { data, error } = await supabase
            .from('awards')
            .upsert(awardToSave as any)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteAward(id: string) {
        const { error } = await supabase
            .from('awards')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // CONFIGURAÇÕES
    async getConfig(key: string) {
        const { data, error } = await supabase
            .from('config')
            .select('value')
            .eq('key', key)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = não encontrado
        return data?.value;
    },

    async setConfig(key: string, value: any) {
        const { data, error } = await supabase
            .from('config')
            .upsert({ key, value }, { onConflict: 'key' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllConfig() {
        const { data, error } = await supabase
            .from('config')
            .select('*');

        if (error) throw error;
        return data || [];
    },
};
