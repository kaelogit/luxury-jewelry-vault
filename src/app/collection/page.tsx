import { createServer } from '@/lib/supabase-server'
import CollectionClient from './CollectionClient'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Fisher-Yates Shuffle: Randomize display order on the server
function shuffleArray(array: any[]) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function CollectionPage() {
  const supabase = await createServer()
  
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)

  const products = data ? shuffleArray(data) : []

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CollectionClient initialProducts={products} />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-4 text-obsidian-300">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Loading Collection</p>
    </div>
  )
}