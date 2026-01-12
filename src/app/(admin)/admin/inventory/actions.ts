'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Institutional Admin Access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * HELPER: File Upload Handler
 * Centralized logic for uploading images, videos, and 3D models
 */
async function uploadFile(file: File, folder: string) {
  if (!file || file.size === 0) return null
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from('vault-media')
    .upload(filePath, file)

  if (error) throw error

  const { data: publicUrl } = supabase.storage
    .from('vault-media')
    .getPublicUrl(filePath)
    
  return publicUrl.publicUrl
}

/**
 * CREATE ACTION
 */
export async function createProduct(formData: FormData) {
  return processAsset(null, formData)
}

/**
 * UPDATE ACTION
 */
export async function updateProduct(id: string, formData: FormData) {
  return processAsset(id, formData)
}

/**
 * CORE LOGIC: MASTER ASSET PROCESSOR
 * Synchronizes multi-media and technical specs with the Vault database
 */
async function processAsset(id: string | null, formData: FormData) {
  try {
    // 1. EXTRACT CORE IDENTITY
    const name = formData.get('name') as string
    const category = formData.get('category') as string 
    const brand = formData.get('brand') as string
    const sku = formData.get('sku') as string 
    const priceRaw = formData.get('price') as string
    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''))

    // 2. EXTRACT TECHNICAL ATTRIBUTES
    const gold_purity = formData.get('gold_purity') as string 
    const weight_grams = formData.get('weight_grams') as string 
    const carat_weight = formData.get('carat_weight') as string 
    const diamond_clarity = formData.get('diamond_clarity') as string
    const diamond_color = formData.get('diamond_color') as string
    const shape = formData.get('shape') as string
    const movement = formData.get('movement') as string
    const case_material = formData.get('case_material') as string

    // 3. MEDIA PROCESSING (Files vs URLs)
    const videoFile = formData.get('video_file') as File
    const modelFile = formData.get('model_file') as File
    const imageFiles = formData.getAll('images') as File[]
    const existingImagesRaw = formData.get('existing_images') as string
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : []

    // Upload New Media
    const newImageUrls = await Promise.all(imageFiles.map(file => uploadFile(file, 'products')))
    const uploadedVideoUrl = await uploadFile(videoFile, 'cinematics')
    const uploadedModelUrl = await uploadFile(modelFile, 'spatial-models')

    // Final Media State
    const finalImages = [...existingImages, ...newImageUrls.filter(url => url !== null)]
    const video_url = uploadedVideoUrl || (formData.get('video_url') as string)
    const three_d_model = uploadedModelUrl || (formData.get('three_d_model') as string)

    // 4. SLUG GENERATION (For new items only)
    const slug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')

    const assetData: any = {
      name,
      price,
      description: formData.get('description') as string,
      category,
      brand: brand || null,
      sku: sku || null,
      images: finalImages,
      video_url: video_url || null,
      three_d_model: three_d_model || null,
      
      // Dynamic Mappings
      gold_purity: category === 'Gold' ? gold_purity : null,
      weight_grams: category === 'Gold' ? parseFloat(weight_grams) : null,
      carat_weight: category === 'Diamonds' ? parseFloat(carat_weight) : null,
      diamond_clarity: category === 'Diamonds' ? diamond_clarity : null,
      diamond_color: category === 'Diamonds' ? diamond_color : null,
      shape: category === 'Diamonds' ? shape : null,
      movement: category === 'Watches' ? movement : null,
      case_material: category === 'Watches' ? case_material : null,
    }

    if (!id) assetData.slug = slug // Only set slug on create

    // 5. DATABASE SYNC
    const query = id 
      ? supabase.from('products').update(assetData).eq('id', id)
      : supabase.from('products').insert([assetData])

    const { error } = await query
    if (error) throw error

    // 6. CACHE REFRESH
    revalidatePath('/collection')
    revalidatePath('/admin/inventory')
    if (!id) revalidatePath(`/product/${slug}`)
    
    return { success: true }

  } catch (err: any) {
    console.error("Vault Registry Error:", err.message)
    return { error: err.message }
  }
}