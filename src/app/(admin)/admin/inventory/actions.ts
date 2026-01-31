'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function saveProduct(productData: any) {
  try {
    // 1. DYNAMIC KEY RESOLUTION
    // This looks for both the standard name and our 'MASTER_KEY' fallback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZWppaHptbHNodmVsc293enRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ3MjA2MCwiZXhwIjoyMDgzMDQ4MDYwfQ.z0cCDKxByOrPRC6Gc1FCf8RrTkAtzvXoY0CQ_HZWnr4";
    // --- CRITICAL AUDIT LOGS (Check Vercel Logs for these) ---
    console.log("--- PROD ENVIRONMENT AUDIT ---");
    console.log("URL Detection:", !!supabaseUrl);
    console.log("Standard Key Detection:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log("Master Key Detection:", !!process.env.MASTER_KEY);
    
    if (!supabaseUrl || !serviceKey) {
      const errorMsg = `Environment Check Failed. URL: ${!!supabaseUrl}, Key: ${!!serviceKey}`;
      console.error(errorMsg);
      return { error: "Server Configuration Error: Missing API Keys." };
    }

    // 2. INITIALIZE ADMIN CLIENT
    const adminSupabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 3. AUTHENTICATION AUDIT
    const sessionClient = await createServer();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    
    if (authError || !user || user.app_metadata?.is_admin !== true) {
      console.error("Auth Audit Failed:", authError?.message || "Not an Admin");
      return { error: "Access Denied: Admin session invalid or expired." };
    }

    // 4. DATA SANITIZATION
    const { id, ...payload } = productData;

    // Auto-generate slug for new acquisitions
    if (!id && payload.name) {
      const baseSlug = payload.name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      payload.slug = `${baseSlug}-${Math.random().toString(36).substring(7)}`;
    }

    // Force strict numeric types for DB compatibility
    if (payload.price) payload.price = parseFloat(payload.price) || 0;
    if (payload.weight_grams) payload.weight_grams = parseFloat(payload.weight_grams) || null;
    if (payload.carat_weight) payload.carat_weight = parseFloat(payload.carat_weight) || null;

    // 5. DATABASE OPERATION
    console.log(`Executing ${id ? 'UPDATE' : 'INSERT'} for asset: ${payload.name}`);
    
    const { data: result, error: dbError } = id 
      ? await adminSupabase.from('products').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([payload]).select().single();

    if (dbError) {
      console.error("Supabase Database Error:", dbError.message);
      return { error: `Registry Error: ${dbError.message}` };
    }

    // 6. CACHE INVALIDATION
    revalidatePath('/admin/inventory');
    revalidatePath('/collection');
    if (result?.slug) revalidatePath(`/product/${result.slug}`);
    
    return { success: true, data: result };

  } catch (err: any) {
    console.error("Critical Action Failure:", err.message);
    return { error: "A critical server error occurred. Check logs." };
  }
}