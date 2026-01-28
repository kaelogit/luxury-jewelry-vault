import { Metadata, ResolvingMetadata } from 'next'
import { createServer } from '@/lib/supabase-server'
import ProductClient from './ProductClient'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }> 
}

/**
 * SEO METADATA
 * Optimized for luxury search intent
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServer()
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description, images, price, category, brand')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { 
      title: 'Item Not Found | Lume Vault',
      description: 'The requested item is no longer available.'
    }
  }

  const priceLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(product.price)

  const titleCategory = product.category === 'Watches' 
    ? `${product.brand || 'Timepiece'}` 
    : product.category

  return {
    title: `${product.name} | ${titleCategory}`,
    description: product.description?.slice(0, 160) || `Secure acquisition of this ${product.category} via Lume Vault.`,
    openGraph: {
      title: `${product.name}`,
      description: `Available now. ${priceLabel}.`,
      images: [{ url: product.images?.[0] || '' }],
      type: 'website',
    },
  }
}

/**
 * MASTER SERVER FETCH
 */
export default async function Page({ params }: Props) {
  const { slug } = await params
  const supabase = await createServer()

  // 1. Fetch Primary Product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product || error) notFound()

  // 2. Fetch Related Items (Same category first, then fallback)
  const { data: recommendations } = await supabase
    .from('products')
    .select('id, name, price, images, slug, category, brand, gold_purity')
    .neq('id', product.id)
    .eq('is_visible', true)
    .eq('category', product.category)
    .limit(4) 

  // 3. Fallback if recommendation pool is small
  let finalRecs = recommendations || []
  if (finalRecs.length < 4) {
    const { data: fallback } = await supabase
      .from('products')
      .select('id, name, price, images, slug, category, brand, gold_purity')
      .neq('id', product.id)
      .eq('is_visible', true)
      .neq('category', product.category)
      .limit(4 - finalRecs.length)
    
    finalRecs = [...finalRecs, ...(fallback || [])]
  }

  return (
    <ProductClient 
      product={product} 
      recommendations={finalRecs} 
    />
  )
}