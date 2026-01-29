'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// Use Service Role Key to bypass RLS policies for admin uploads
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadFile(file: File, folder: string) {
  // CRITICAL FIX: Ignore empty file inputs
  if (!file || !(file instanceof File) || file.size === 0 || file.name === 'undefined') return null
  
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

export async function createProduct(formData: FormData) {
  return processAsset(null, formData)
}

export async function updateProduct(id: string, formData: FormData) {
  return processAsset(id, formData)
}

async function processAsset(id: string | null, formData: FormData) {
  try {
    const sessionClient = await createServer()
    const { data: { user } } = await sessionClient.auth.getUser()
    
    // Auth Check
    if (!user || user.app_metadata?.is_admin !== true) {
      throw new Error("Maison Security: Unauthorized Access")
    }

    const name = formData.get('name') as string
    const category = formData.get('category') as string 
    const sub_category = formData.get('sub_category') as string
    const priceRaw = formData.get('price') as string
    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''))

    // MEDIA HANDLING - FIX: Filter out empty/ghost files
    const videoFile = formData.get('video_file') as File
    const modelFile = formData.get('model_file') as File
    const imagesArray = formData.getAll('images') as File[]
    
    // Only process images that actually have content
    const validNewImages = imagesArray.filter(f => f.size > 0)

    const existingImagesRaw = formData.get('existing_images') as string
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : []

    // Parallel Uploads
    const [uploadedNewImages, uploadedVideo, uploadedModel] = await Promise.all([
      Promise.all(validNewImages.map(file => uploadFile(file, 'products'))),
      uploadFile(videoFile, 'cinematics'),
      uploadFile(modelFile, 'spatial-models')
    ])

    // Clean nulls from the array
    const finalImages = [...existingImages, ...uploadedNewImages.filter(Boolean)]
    const video_url = uploadedVideo || (formData.get('video_url') as string) || null
    const three_d_model = uploadedModel || (formData.get('three_d_model') as string) || null

    // Slug Generator
    const baseSlug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    const finalSlug = id ? undefined : `${baseSlug}-${Math.random().toString(36).substring(7)}`

    // Data Mapping
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
      
      // Attributes
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

    // DB Operation
    const { data, error } = id 
      ? await adminSupabase.from('products').update(assetData).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([assetData]).select().single()

    if (error) throw error

    // Revalidate paths to update UI instantly
    revalidatePath('/admin/inventory')
    revalidatePath('/collection')
    
    return { success: true, data }

  } catch (err: any) {
    console.error("Vault Registry Error:", err.message)
    return { error: err.message || "Failed to process asset" }
  }
}