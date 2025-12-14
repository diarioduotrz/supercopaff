import { createClient } from '@supabase/supabase-js'

// Variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
})

// Tipos para o banco de dados
export interface Database {
    public: {
        Tables: {
            ranking: {
                Row: {
                    id: string
                    position: number
                    team: string
                    points: number
                    wins: number
                    kills: number
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['ranking']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['ranking']['Insert']>
            }
            rules: {
                Row: {
                    id: string
                    title: string
                    description: string
                    order: number
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['rules']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['rules']['Insert']>
            }
            awards: {
                Row: {
                    id: string
                    position: string
                    prize: string
                    icon: string
                    order: number
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['awards']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['awards']['Insert']>
            }
            config: {
                Row: {
                    id: string
                    key: string
                    value: string
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['config']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['config']['Insert']>
            }
        }
    }
}
