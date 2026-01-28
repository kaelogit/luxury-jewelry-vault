'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

/**
 * INSTITUTIONAL ADMIN CLIENT
 * Uses the Service Role Key to manage the vault inventory regardless of RLS.
 */
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * HELPER: Secure File Upload
 * Generates a unique path and returns the public URL for the asset.
 */
async function uploadFile(file: File, folder: string) {
  if (!file || !(file instanceof File) || file.size === 0) return null
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error } = await adminSupabase.storage
    .from('vault-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw new Error(`Media Upload Failed: ${error.message}`)

  const { data } = adminSupabase.storage
    .from('vault-media')
    .getPublicUrl(filePath)
    
  return data.publicUrl
}

/**
 * EXPOSED ACTIONS
 */
export async function createProduct(formData: FormData) {
  return processAsset(null, formData)
}

export async function updateProduct(id: string, formData: FormData) {
  return processAsset(id, formData)
}

/**
 * MASTER ASSET PROCESSOR
 * Audited for Next.js 15 and Supabase JSONB standards.
 */
async function processAsset(id: string | null, formData: FormData) {
  try {
    // 1. IDENTITY & AUTHENTICATION
    const sessionClient = await createServer()
    const { data: { user } } = await sessionClient.auth.getUser()
    
    // Safety: Verify is_admin metadata
    if (!user || user.app_metadata?.is_admin !== true) {
      throw new Error("Maison Security: Unauthorized Access Attempt")
    }

    // 2. DATA EXTRACTION
    const name = formData.get('name') as string
    const category = formData.get('category') as string 
    const sub_category = formData.get('sub_category') as string
    const priceRaw = formData.get('price') as string
    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''))

    // 3. MEDIA HANDLING (Audit: Fixed image merging logic)
    const videoFile = formData.get('video_file') as File
    const modelFile = formData.get('model_file') as File
    const newImages = formData.getAll('images') as File[]
    
    const existingImagesRaw = formData.get('existing_images') as string
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : []

    // Parallel uploads for performance
    const [uploadedNewImages, uploadedVideo, uploadedModel] = await Promise.all([
      Promise.all(newImages.map(file => uploadFile(file, 'products'))),
      uploadFile(videoFile, 'cinematics'),
      uploadFile(modelFile, 'spatial-models')
    ])

    const finalImages = [...existingImages, ...uploadedNewImages.filter(Boolean)]
    const video_url = uploadedVideo || (formData.get('video_url') as string) || null
    const three_d_model = uploadedModel || (formData.get('three_d_model') as string) || null

    // 4. SMART SLUG GENERATION (Audit: Added uniqueness)
    const baseSlug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    const finalSlug = id ? undefined : `${baseSlug}-${Math.random().toString(36).substring(7)}`

    // 5. CONSTRUCT ASSET PAYLOAD
    // We only map fields relevant to the category to keep DB clean
    const assetData: any = {
      name,
      price,
      description: formData.get('description') as string,
      category,
      sub_category: sub_category || null,
      brand: (formData.get('brand') as string) || null,
      sku: (formData.get('sku') as string) || null,
      images: finalImages,
      video_url,
      three_d_model,
      
      // Category Specific Attributes
      gold_purity: category === 'Gold' ? formData.get('gold_purity') : null,
      weight_grams: category === 'Gold' ? parseFloat(formData.get('weight_grams') as string) || 0 : null,
      carat_weight: category === 'Diamonds' ? parseFloat(formData.get('carat_weight') as string) || 0 : null,
      diamond_clarity: category === 'Diamonds' ? formData.get('diamond_clarity') : null,
      diamond_color: category === 'Diamonds' ? formData.get('diamond_color') : null,
      shape: category === 'Diamonds' ? formData.get('shape') : null,
      movement: category === 'Watches' ? formData.get('movement') : null,
      case_material: category === 'Watches' ? formData.get('case_material') : null,
    }

    if (!id) assetData.slug = finalSlug

    // 6. DATABASE EXECUTION
    const { data, error } = id 
      ? await adminSupabase.from('products').update(assetData).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([assetData]).select().single()

    if (error) throw error

    // 7. GLOBAL CACHE REVALIDATION
    revalidatePath('/admin/inventory')
    revalidatePath('/collection')
    if (id) {
      revalidatePath(`/product/${data.slug}`)
    }
    
    return { success: true, data }

  } catch (err: any) {
    console.error("Vault Registry Error:", err.message)
    return { error: err.message || "Failed to process asset" }
  }
}