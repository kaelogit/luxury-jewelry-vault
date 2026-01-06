import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * 1. THE SOVEREIGN CLIENT (Public)
 * Used for standard client-side interactions. 
 * Configured with strict session persistence to prevent "auth-ghosting".
 */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'lume-vault-auth-token', // Custom key for clearer debugging
  },
})

/**
 * 2. THE ADMINISTRATIVE OVERRIDE (Private/Server-Only)
 * This is the "Master Key" used in Server Actions to bypass RLS.
 * SECURITY: This must NEVER be imported into a client component.
 */
export const getAdminClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error("Critical Protocol Failure: Administrative Service Key Missing.")
  }
  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  })
}

/**
 * 3. THE UTILITY FACTORY
 * Provides a fresh client on-demand for specific logic blocks.
 */
export const createClient = () => createSupabaseClient(supabaseUrl, supabaseAnonKey)