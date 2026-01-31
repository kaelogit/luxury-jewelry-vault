'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// DELETE THE GLOBAL CLIENT HERE
// const adminSupabase = createClient(...) <--- REMOVE THIS

export async function saveProduct(productData: any) {
  try {
    // 1. INITIALIZE CLIENT HERE (Lazy Loading)
    // This fixes the "supabaseKey is required" error because it runs ON DEMAND.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase Keys in Vercel Settings.")
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

    // 2. AUTH CHECK
    const sessionClient = await createServer()
    const { data: { user } } = await sessionClient.auth.getUser()
    
    if (!user || user.app_metadata?.is_admin !== true) {
      return { error: "Access Denied: You are not an admin." }
    }

    // 3. PREPARE DATA
    const { id, ...payload } = productData

    if (!id && payload.name) {
      const baseSlug = payload.name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
      payload.slug = `${baseSlug}-${Math.random().toString(36).substring(7)}`
    }

    // Clean Numbers
    if (payload.price) payload.price = parseFloat(payload.price) || 0
    if (payload.weight_grams) payload.weight_grams = parseFloat(payload.weight_grams) || null
    if (payload.carat_weight) payload.carat_weight = parseFloat(payload.carat_weight) || null

    // 4. DATABASE WRITE
    const { data: result, error } = id 
      ? await adminSupabase.from('products').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([payload]).select().single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/inventory')
    revalidatePath('/collection')
    
    return { success: true, data: result }

  } catch (err: any) {
    console.error("Save Error:", err.message)
    return { error: err.message || "Failed to save to database." }
  }
}