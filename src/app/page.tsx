import React from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

// COMPONENTS
import Hero from '@/components/home/hero/Hero'
import ConciergeCall from '@/components/home/ConciergeCall'
import SecurityStandards from '@/components/home/SecurityStandards'
import ProductCard from '@/components/ui/ProductCard'

export default async function Home() {
  // 1. DYNAMIC FETCH: Pulling real assets for the "Best Sellers" grid
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-ivory-100 overflow-x-hidden selection:bg-gold selection:text-white">
      
      {/* 1. HERO: The Brand Hook */}
      <Hero />

      {/* 2. THE CATEGORY MANIFESTO (Zig-Zag Protocol) */}
      <section className="py-24 space-y-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <CategorySplit 
          title="Masterful Timepieces"
          subtitle="Horological Heritage"
          description="Curated excellence from the world's most prestigious maisons. Every timepiece is verified for provenance and mechanical integrity."
          cta="Explore Watches"
          href="/collection?cat=watches"
          image="/images/home/watches-home.jpg"
          reverse={false} // Image Left, Text Right
        />

        <CategorySplit 
          title="Exquisite Diamonds"
          subtitle="VVS1+ Exceptional Clarity"
          description="Only the rarest stones make it into our vault. Every diamond is GIA certified and hand-selected for its fire, brilliance, and sovereign lineage."
          cta="Explore Diamonds"
          href="/collection?cat=diamonds"
          image="/images/home/diamonds-home.jpg"
          reverse={true} // Text Left, Image Right
        />

        <CategorySplit 
          title="Pure 24K Bullion"
          subtitle="Physical Autonomy"
          description="Rich, heavy, and undeniably pure. Discover solid gold assets designed to be worn for a lifetime and held for generations."
          cta="Explore Gold"
          href="/collection?cat=gold"
          image="/images/home/gold-home.jpg"
          reverse={false} // Image Left, Text Right
        />
      </section>

      {/* 3. DYNAMIC REVEAL: Best Sellers */}
      <section className="bg-white py-24 px-6 md:px-12 border-y border-ivory-200">
        <div className="max-w-screen-2xl mx-auto space-y-16">
          <header className="text-center space-y-4">
            <p className="label-caps text-gold">The Collection</p>
            <h2 className="text-4xl md:text-6xl font-medium font-serif italic text-obsidian-900">
              Most <span className="text-gold not-italic">Coveted.</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            
            {(!bestSellers || bestSellers.length === 0) && (
                <div className="col-span-full py-20 text-center opacity-20 italic">
                    The Vault is currently being synchronized...
                </div>
            )}
          </div>

          <div className="text-center pt-12">
             <Link href="/collection" className="text-[10px] font-bold uppercase tracking-[0.4em] text-obsidian-400 hover:text-gold transition-colors">
                View Entire Registry —
             </Link>
          </div>
        </div>
      </section>

      {/* 4. INSTITUTIONAL SECURITY */}
      <SecurityStandards />

      {/* 5. THE ADVISORY CALL */}
      <section className="pb-32 bg-ivory-100">
        <ConciergeCall />
      </section>

    </main>
  )
}

/** * UI COMPONENT: Category Split
 */
function CategorySplit({ title, subtitle, description, cta, href, image, reverse }: any) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-32`}>
      {/* IMAGE SIDE */}
      <div className="w-full md:w-1/2 aspect-[4/5] bg-ivory-200 relative rounded-2xl overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-obsidian-900/10 group-hover:bg-transparent transition-all duration-1000 z-10" />
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
      </div>

      {/* TEXT SIDE */}
      <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
        <div className="space-y-4">
          <p className="label-caps text-gold">{subtitle}</p>
          <h2 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">{title}</h2>
        </div>
        <p className="text-lg text-obsidian-600 leading-relaxed max-w-md mx-auto md:mx-0 font-medium italic border-l-2 border-gold/10 pl-6">
          {description}
        </p>
        <div className="pt-6">
          <Link href={href} className="inline-block px-12 py-6 bg-obsidian-900 text-gold text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all duration-500 rounded-lg shadow-2xl">
            {cta}
          </Link>
        </div>
      </div>
    </div>
  )
}