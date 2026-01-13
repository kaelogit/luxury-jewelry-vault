import { createServer } from '@/lib/supabase-server'
import CollectionClient from './CollectionClient'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

/**
 * THE RANDOMIZATION ENGINE (Fisher-Yates Shuffle)
 * Moved to server to ensure the vault looks fresh immediately on load 
 * without triggering a client-side layout shift.
 */
function shuffleVault(array: any[]) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function CollectionPage() {
  const supabase = await createServer()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)

  const products = data ? shuffleVault(data) : []

  return (
    // The Suspense boundary is REQUIRED for useSearchParams() on Vercel
    <Suspense fallback={
      <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-4 text-obsidian-300">
        <Loader2 className="animate-spin" size={32} strokeWidth={1} />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Opening the Vault...</p>
      </div>
    }>
      <CollectionClient initialProducts={products} />
    </Suspense>
  )
}