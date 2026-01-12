import { Metadata, ResolvingMetadata } from 'next'
import { createClient } from '@/lib/supabase' // Standardizing on the factory function
import ProductClient from './ProductClient'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }> 
}

/**
 * METADATA ENGINE: SEO Optimization for High-Net-Worth Visibility
 * Transformed from "Store Page" to "Official Asset Registry"
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const supabase = createClient() // Audit: Ensuring fresh client for SSR
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description, images, price, category, brand')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { 
      title: 'Asset Not Found | LUME VAULT',
      description: 'The requested asset signature does not exist in the current node.'
    }
  }

  const priceLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(product.price)

  // Standardizing labels to professional industry terms
  const classBranding = product.category === 'Watches' 
    ? `${product.brand || 'HOROLOGICAL'} MASTERPIECE` 
    : product.category === 'Diamonds' 
    ? 'CERTIFIED INVESTMENT GEMSTONE' 
    : 'INSTITUTIONAL PRECIOUS METAL BULLION'

  const ogImage = product.images?.[0] || ''

  return {
    title: `${product.name} | ${classBranding}`,
    description: product.description || `Secure acquisition of this ${product.category} asset via LUME Vault.`,
    openGraph: {
      title: `${product.name} — ${priceLabel}`,
      description: `Secured within the LUME Vault. Professional logistics and direct settlement active.`,
      images: [{ url: ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — LUME VAULT`,
      description: `Current Valuation: ${priceLabel}`,
      images: [ogImage],
    },
  }
}

/**
 * MASTER SERVER FETCH
 * Optimized for 1,000+ Product Scalability
 */
export default async function Page({ params }: Props) {
  const { slug } = await params
  const supabase = createClient()

  // 1. Fetch Primary Asset: Selecting '*' to ensure review-critical data (id/category) is present
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product || error) notFound()

  // 2. Fetch "Complementary Acquisitions" (Recommendations)
  // Audit: Filtering by the SAME category first for better relevance in high-end shopping
  const { data: recommendations } = await supabase
    .from('products')
    .select('id, name, price, images, slug, category, brand, gold_purity, diamond_clarity')
    .neq('id', product.id)
    .eq('is_visible', true)
    .eq('category', product.category) // Strategic logic: Show similar assets first
    .limit(4) 

  // 3. Fallback Fetch: If not enough in same category, fill with others
  let finalRecs = recommendations || []
  if (finalRecs.length < 4) {
    const { data: fallback } = await supabase
      .from('products')
      .select('id, name, price, images, slug, category, brand, gold_purity, diamond_clarity')
      .neq('id', product.id)
      .eq('is_visible', true)
      .neq('category', product.category) // Get different items
      .limit(4 - finalRecs.length)
    
    finalRecs = [...finalRecs, ...(fallback || [])]
  }

  // 4. Pass to Client Component
  // Audit: Passing the raw product ID and Category is vital for the Sovereign Review Generator
  return (
    <ProductClient 
      product={product} 
      recommendations={finalRecs} 
    />
  )
}