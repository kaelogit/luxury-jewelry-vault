'use server'

import { createClient } from '@supabase/supabase-js'
import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// --- 1. CRITICAL SAFETY CHECK ---
// This prevents the "Infinite Spinner" by failing instantly if Vercel keys are missing.
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SERVER ERROR: Supabase Environment Variables are missing. Check Vercel Settings.")
}

// Connect to Supabase with Admin privileges
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper: Uploads a file only if it is real
async function uploadFile(file: File, folder: string) {
  // CRITICAL FIX: If file is empty or undefined, STOP immediately.
  if (!file || file.size === 0 || file.name === 'undefined') return null
  
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error } = await adminSupabase.storage
      .from('vault-media')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (error) {
        console.error(`Upload failed for ${filePath}:`, error.message)
        return null
    }

    const { data } = adminSupabase.storage
      .from('vault-media')
      .getPublicUrl(filePath)
      
    return data.publicUrl
  } catch (error) {
    console.error("Upload Exception:", error)
    return null
  }
}

export async function createProduct(formData: FormData) {
  return processAsset(null, formData)
}

export async function updateProduct(id: string, formData: FormData) {
  return processAsset(id, formData)
}

async function processAsset(id: string | null, formData: FormData) {
  try {
    // 1. Verify Admin
    const sessionClient = await createServer()
    const { data: { user } } = await sessionClient.auth.getUser()
    
    if (!user || user.app_metadata?.is_admin !== true) {
      return { error: "Access Denied: You do not have admin permissions." }
    }

    // 2. Extract Basic Data
    const name = formData.get('name') as string
    const category = formData.get('category') as string 
    const sub_category = formData.get('sub_category') as string
    const price = parseFloat((formData.get('price') as string).replace(/[^0-9.]/g, ''))

    // 3. Handle Files (The Fix for Infinite Loading)
    const videoFile = formData.get('video_file') as File
    const modelFile = formData.get('model_file') as File
    const rawImages = formData.getAll('images') as File[]
    
    // Filter out "Ghost" images (files with size 0)
    const validImages = rawImages.filter(img => img.size > 0)

    // Handle existing images (for edits)
    const existingImagesRaw = formData.get('existing_images') as string
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : []

    // Upload everything in parallel
    const [uploadedImages, uploadedVideo, uploadedModel] = await Promise.all([
      Promise.all(validImages.map(f => uploadFile(f, 'products'))),
      uploadFile(videoFile, 'cinematics'),
      uploadFile(modelFile, 'spatial-models')
    ])

    // Combine old images + new uploaded images
    const finalImages = [...existingImages, ...uploadedImages.filter(Boolean)]
    
    // Keep old video/model if no new one was uploaded
    const video_url = uploadedVideo || (formData.get('existing_video') as string) || null
    const three_d_model = uploadedModel || (formData.get('existing_model') as string) || null

    // 4. Create Unique ID (Slug)
    // Only generate slug for NEW items
    const baseSlug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    const slug = id ? undefined : `${baseSlug}-${Math.random().toString(36).substring(7)}`

    // 5. Prepare Database Object
    const productData: any = {
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
      // Smart Attributes (Only save what matters for the category)
      gold_purity: category === 'Gold' ? formData.get('gold_purity') : null,
      weight_grams: category === 'Gold' ? parseFloat(formData.get('weight_grams') as string) || 0 : null,
      carat_weight: category === 'Diamonds' ? parseFloat(formData.get('carat_weight') as string) || 0 : null,
      diamond_clarity: category === 'Diamonds' ? formData.get('diamond_clarity') : null,
      diamond_color: category === 'Diamonds' ? formData.get('diamond_color') : null,
      shape: category === 'Diamonds' ? formData.get('shape') : null,
      movement: category === 'Watches' ? formData.get('movement') : null,
      case_material: category === 'Watches' ? formData.get('case_material') : null,
    }

    if (slug) productData.slug = slug

    // 6. Save to Database
    const { data, error } = id 
      ? await adminSupabase.from('products').update(productData).eq('id', id).select().single()
      : await adminSupabase.from('products').insert([productData]).select().single()

    if (error) throw new Error(error.message)

    // 7. Refresh Pages
    revalidatePath('/admin/inventory')
    revalidatePath('/collection')
    if (data?.slug) revalidatePath(`/product/${data.slug}`)
    
    return { success: true, data }

  } catch (err: any) {
    console.error("Upload Error:", err.message)
    return { error: err.message || "Something went wrong processing the asset." }
  }
}