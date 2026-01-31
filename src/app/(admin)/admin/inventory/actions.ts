'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// --- THE MISSING FUNCTION ---
export async function saveProduct(productData: any) {
  try {
    // 1. Verify Admin
    const sessionClient = await createServer()
    const { data: { user } } = await sessionClient.auth.getUser()
    
    if (!user || user.app_metadata?.is_admin !== true) {
      return { error: "Access Denied: You do not have admin permissions." }
    }

    // 2. Separate ID from the rest of the data
    const { id, ...payload } = productData

    // 3. Generate Slug if it's a new item
    if (!id && payload.name) {
      const baseSlug = payload.name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
      payload.slug = `${baseSlug}-${Math.random().toString(36).substring(7)}`
    }

    // 4. Clean Data (Ensure numbers are valid)
    // Supabase hates 'NaN', so we force them to 0 or null if invalid
    if (payload.price) payload.price = parseFloat(payload.price) || 0
    if (payload.weight_grams) payload.weight_grams = parseFloat(payload.weight_grams) || null
    if (payload.carat_weight) payload.carat_weight = parseFloat(payload.carat_weight) || null

    // 5. Database Operation
    const { data: result, error } = id 
      ? await adminSupabase.from('products').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([payload]).select().single()

    if (error) {
      console.error("Database Error:", error.message)
      throw new Error(error.message)
    }

    // 6. Refresh Pages
    revalidatePath('/admin/inventory')
    revalidatePath('/collection')
    if (result?.slug) revalidatePath(`/product/${result.slug}`)
    
    return { success: true, data: result }

  } catch (err: any) {
    console.error("Save Action Error:", err.message)
    return { error: err.message || "Failed to save to database." }
  }
}