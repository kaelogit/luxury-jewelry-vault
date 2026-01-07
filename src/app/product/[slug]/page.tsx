import { Metadata, ResolvingMetadata } from 'next'
import { supabase } from '@/lib/supabase'
import ProductClient from './ProductClient'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }> // Next.js 15 requires params to be a Promise
}

/**
 * METADATA ENGINE
 * Generates dynamic SEO based on the standardized Master SQL columns
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description, image, price, category')
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

  // Class Branding Logic synced with Master SQL
  const classBranding = product.category === 'Watches' 
    ? 'HOROLOGICAL MASTERPIECE' 
    : product.category === 'Diamonds' 
    ? 'CERTIFIED GEMSTONE' 
    : 'PURE 24K BULLION'

  return {
    title: `${product.name} | ${classBranding}`,
    description: product.description || `Secure acquisition of this ${product.category} asset via LUME Vault.`,
    openGraph: {
      title: `${product.name} — ${priceLabel}`,
      description: `Secured in LUME Vault. Insured logistics and direct settlement active.`,
      images: [{ url: product.image || '' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — LUME VAULT`,
      description: `Current Valuation: ${priceLabel}`,
      images: [product.image || ''],
    },
  }
}

/**
 * MASTER SERVER FETCH
 * Standardized for the new SQL Schema
 */
export default async function Page({ params }: Props) {
  const { slug } = await params

  // 1. Fetch Primary Asset using updated column names
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product || error) notFound()

  // 2. Fetch "Complementary Acquisitions" (Recommendations)
  // Standardized columns: name, category, image
  const { data: recommendations } = await supabase
    .from('products')
    .select('id, name, price, image, slug, category, specifications, gia_report, gold_purity, serial_number, description')
    .neq('id', product.id)
    .limit(20)

  // 3. Sync with ProductClient
  // We pass the product and recommendations with corrected keys
  return (
    <ProductClient 
      product={product} 
      recommendations={recommendations || []} 
    />
  )
}