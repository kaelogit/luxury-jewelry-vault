'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function saveProduct(productData: any) {
  try {
    // --- DEBUG LOG START ---
    console.log("--- DEBUGGING KEYS ---")
    console.log("URL Exists?", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Service Key Exists?", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    // Check if the key starts correctly (should be 'ey...')
    const keyStart = process.env.SUPABASE_SERVICE_ROLE_KEY 
      ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) 
      : "MISSING"
    console.log("Key Start:", keyStart)
    // --- DEBUG LOG END ---

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(`Keys Missing! URL: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL}, Role: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}`)
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // ... (Rest of your code stays the same) ...
    // 2. AUTH CHECK
    const sessionClient = await createServer()
    const { data: { user } } = await sessionClient.auth.getUser()
    
    if (!user || user.app_metadata?.is_admin !== true) {
      return { error: "Access Denied: You are not an admin." }
    }
    
    // ... (rest of logic) ...
    const { id, ...payload } = productData
    // ...
    // ...
    // Return success
    return { success: true } 

  } catch (err: any) {
    console.error("Save Error:", err.message)
    return { error: err.message }
  }
}