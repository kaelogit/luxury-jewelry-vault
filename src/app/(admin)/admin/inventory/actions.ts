'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use Service Role for Admin bypass of RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * SOVEREIGN INGESTION PROTOCOL
 * Handles file uploads to the Pearl Vault and synchronizes the Asset Registry
 */
export async function createLuxuryAsset(formData: FormData) {
  // 1. EXTRACT CORE IDENTITY
  const title = formData.get('title') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  const asset_class = formData.get('asset_class') as string // GOLD, DIAMOND, WATCH, BESPOKE
  const serial_number = formData.get('serial_number') as string // Internal LV-XXXX
  
  // 2. EXTRACT CLASS-SPECIFIC IDENTITY
  const gia_report_number = formData.get('gia_report_number') as string
  const gold_purity = formData.get('gold_purity') as string
  
  // 3. EXTRACT FILES
  const imageFile = formData.get('image') as File
  const videoFile = formData.get('video') as File
  const modelFile = formData.get('model') as File

  // 4. PARSE DYNAMIC SPECIFICATIONS (The JSONB Data)
  // This captures things like "movement", "carat", "color" from the form
  const rawSpecs = formData.get('specifications') as string
  const specifications = rawSpecs ? JSON.parse(rawSpecs) : {}

  // 5. SLUG GENERATION (Essential for /product/[slug] routing)
  const slug = title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')

  let imageUrl = ''
  let videoUrl = ''
  let modelUrl = ''

  try {
    // 6. STORAGE PROTOCOL: IMAGE (Thumbnail)
    if (imageFile && imageFile.size > 0) {
      const fileName = `thumbnails/${Date.now()}-${imageFile.name}`
      const { data } = await supabase.storage.from('vault-media').upload(fileName, imageFile)
      if (data) {
        const { data: publicUrl } = supabase.storage.from('vault-media').getPublicUrl(fileName)
        imageUrl = publicUrl.publicUrl
      }
    }

    // 7. STORAGE PROTOCOL: 4K VIDEO LOOP
    if (videoFile && videoFile.size > 0) {
      const fileName = `videos/${Date.now()}-${videoFile.name}`
      const { data } = await supabase.storage.from('vault-media').upload(fileName, videoFile)
      if (data) {
        const { data: publicUrl } = supabase.storage.from('vault-media').getPublicUrl(fileName)
        videoUrl = publicUrl.publicUrl
      }
    }

    // 8. STORAGE PROTOCOL: 3D SPATIAL MODEL
    if (modelFile && modelFile.size > 0) {
      const fileName = `models/${Date.now()}-${modelFile.name}`
      const { data } = await supabase.storage.from('vault-media').upload(fileName, modelFile)
      if (data) {
        const { data: publicUrl } = supabase.storage.from('vault-media').getPublicUrl(fileName)
        modelUrl = publicUrl.publicUrl
      }
    }

    // 9. REGISTRY SYNCHRONIZATION (Database Insert)
    const { error } = await supabase
      .from('products')
      .insert([{
        title,
        slug,
        price: parseFloat(price),
        description,
        asset_class,
        serial_number,
        gia_report_number,
        gold_purity,
        image_url: imageUrl,
        video_loop_url: videoUrl,
        three_d_model_url: modelUrl,
        specifications, // Injected JSONB for the 'Whale' Filters
        status: 'AVAILABLE'
      }])

    if (error) throw error

    // 10. CACHE INVALIDATION
    revalidatePath('/collection')
    return { success: true }

  } catch (err: any) {
    console.error("Sovereign Ingress Failure:", err.message)
    return { error: err.message }
  }
}