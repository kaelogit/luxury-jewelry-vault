'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Using Service Role to ensure the Admin can write to the "Vault" without RLS restrictions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * MASTER INVENTORY INGESTION
 * Synchronizes new luxury assets with the frontend Gallery and Product pages.
 */
export async function createLuxuryAsset(formData: FormData) {
  try {
    // 1. EXTRACT CORE IDENTITY
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string // e.g., 'Watches'
    const sub_category = formData.get('sub_category') as string // e.g., 'Heritage'
    const type = formData.get('type') as string // e.g., 'Automatic'
    
    // 2. LUXURY SPECIFICATIONS
    const gold_purity = formData.get('gold_purity') as string // 18K, 24K, N/A
    const carat_weight = formData.get('carat_weight') as string // For Diamonds
    const gia_report = formData.get('gia_report') as string // Serial Number
    const serial_number = formData.get('serial_number') as string // LV-XXXX

    // 3. FILE EXTRACTION
    const imageFile = formData.get('image') as File
    const videoFile = formData.get('video') as File
    const modelFile = formData.get('model') as File

    // 4. PARSE DYNAMIC SPECS (For the 'Specifications' table on Product pages)
    // We capture things like "Movement", "Clasp", "Strap Material" here.
    const rawSpecs = formData.get('specifications') as string
    const specifications = rawSpecs ? JSON.parse(rawSpecs) : {}

    // 5. SLUG GENERATION
    const slug = name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')

    let imageUrl = ''
    let videoUrl = ''
    let modelUrl = ''

    // 6. STORAGE: IMAGE (The primary asset visual)
    if (imageFile && imageFile.size > 0) {
      const fileName = `products/${Date.now()}-${imageFile.name}`
      const { data, error } = await supabase.storage.from('vault-media').upload(fileName, imageFile)
      if (data) {
        const { data: publicUrl } = supabase.storage.from('vault-media').getPublicUrl(fileName)
        imageUrl = publicUrl.publicUrl
      }
    }

    // 7. STORAGE: VIDEO (The 4K cinematic loop)
    if (videoFile && videoFile.size > 0) {
      const fileName = `cinematics/${Date.now()}-${videoFile.name}`
      const { data } = await supabase.storage.from('vault-media').upload(fileName, videoFile)
      if (data) {
        const { data: publicUrl } = supabase.storage.from('vault-media').getPublicUrl(fileName)
        videoUrl = publicUrl.publicUrl
      }
    }

    // 8. STORAGE: 3D MODEL (Spatial reality file)
    if (modelFile && modelFile.size > 0) {
      const fileName = `spatial-models/${Date.now()}-${modelFile.name}`
      const { data } = await supabase.storage.from('vault-media').upload(fileName, modelFile)
      if (data) {
        const { data: publicUrl } = supabase.storage.from('vault-media').getPublicUrl(fileName)
        modelUrl = publicUrl.publicUrl
      }
    }

    // 9. DATABASE SYNC
    // This matches the schema we use in our frontend filters!
    const { error } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        price: parseFloat(price),
        description,
        category,        // Used in Collection filters
        sub_category,    // Used in Collection filters
        type,            // Used in Collection filters
        gold_purity,
        carat_weight,
        gia_report,
        serial_number,
        image: imageUrl,
        video_url: videoUrl,
        three_d_model: modelUrl,
        specifications,  // JSONB for technical details
        status: 'available',
        is_visible: true,
        created_at: new Date().toISOString()
      }])

    if (error) throw error

    // 10. REVALIDATION
    revalidatePath('/collection')
    revalidatePath(`/product/${slug}`)
    
    return { success: true }

  } catch (err: any) {
    console.error("Inventory Sync Failure:", err.message)
    return { error: err.message }
  }
}