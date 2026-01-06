import { Metadata, ResolvingMetadata } from 'next'
import { supabase } from '@/lib/supabase'
import ProductClient from './ProductClient'
import { notFound } from 'next/navigation'

type Props = {
  params: { slug: string }
}

/**
 * SOVEREIGN METADATA PROTOCOL
 * Generates dynamic SEO and Social data based on the Vault Inventory
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // We select the necessary fields for a high-end SEO preview
  const { data: product } = await supabase
    .from('products')
    .select('title, description, image_url, price, asset_class')
    .eq('slug', params.slug)
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

  // Dynamic Class Branding
  const classBranding = product.asset_class === 'WATCH' 
    ? 'HOROLOGICAL MASTERPIECE' 
    : product.asset_class === 'DIAMOND' 
    ? 'CERTIFIED GEMSTONE' 
    : 'PURE BULLION ASSET'

  return {
    title: `${product.title} | ${classBranding}`,
    description: product.description || `Secure acquisition of this ${product.asset_class} asset via LUME Sovereign Protocol.`,
    openGraph: {
      title: `${product.title} — ${priceLabel}`,
      description: `Secured in LUME Vault. Professional logistics and escrow-based settlement active.`,
      images: [{ url: product.image_url || '' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — LUME VAULT`,
      description: `Cryptographic Settlement: ${priceLabel}`,
      images: [product.image_url || ''],
    },
  }
}

/**
 * THE SERVER INGRESS
 * Performs a dual-fetch protocol to eliminate client-side loading flickers.
 */
export default async function Page({ params }: Props) {
  // 1. Fetch Primary Asset (Using * to ensure all technical specs are passed)
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!product || error) notFound()

  // 2. Fetch "Complementary Acquisitions" (20 Random Recommendations)
  // Change the select statement to include everything the interface needs:
const { data: recommendations } = await supabase
  .from('products')
  .select('id, title, price, image_url, slug, asset_class, specifications, gia_report_number, gold_purity, serial_number, description')
  .neq('id', product.id)
  .limit(20);

  // 3. Handshake with ProductClient
  return (
    <ProductClient 
      product={product} 
      recommendations={recommendations || []} 
    />
  )
}