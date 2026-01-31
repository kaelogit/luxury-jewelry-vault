'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function saveProduct(productData: any) {
  try {
    // 1. DYNAMIC KEY DETECTION
    // We look for the standard name OR a shorter fallback name
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return { error: `Vercel Config Error: URL=${!!supabaseUrl}, Key=${!!serviceKey}` };
    }

    const adminSupabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // 2. AUTH & SAVE LOGIC (Keep your working logic here)
    const sessionClient = await createServer();
    const { data: { user } } = await sessionClient.auth.getUser();
    
    if (!user || user.app_metadata?.is_admin !== true) {
      return { error: "Access Denied." };
    }

    const { id, ...payload } = productData;

    // Numerical cleaning
    if (payload.price) payload.price = parseFloat(payload.price) || 0;

    const { data: result, error: dbError } = id 
      ? await adminSupabase.from('products').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([payload]).select().single();

    if (dbError) throw new Error(dbError.message);

    revalidatePath('/admin/inventory');
    return { success: true, data: result };

  } catch (err: any) {
    return { error: err.message };
  }
}