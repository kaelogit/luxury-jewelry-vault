import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * STANDARD CLIENT (Public Only)
 * Used for user-facing interactions: Login, Signup, Collection Browsing.
 * This client is restricted by Row Level Security (RLS).
 */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'lume-vault-session',
  },
})

/**
 * CLIENT FACTORY
 * Provides fresh instances for specific client-side lifecycle operations.
 */
export const createClient = () => createSupabaseClient(supabaseUrl, supabaseAnonKey)