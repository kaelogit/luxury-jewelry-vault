'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck, Gem, Loader2 } from 'lucide-react'

// COMPONENTS
import Hero from '@/components/home/hero/Hero'
import ConciergeCall from '@/components/home/ConciergeCall'
import SecurityStandards from '@/components/home/SecurityStandards'
import ProductCard from '@/components/ui/ProductCard'

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      const supabase = createClient(); const { data } = await supabase
        .from('products')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false })
      
      if (data) setBestSellers(data)
      setLoading(false)
    }
    fetchAssets()
  }, [])

  return (
    <main className="min-h-screen bg-white overflow-x-hidden selection:bg-gold selection:text-white">
      
      {/* 1. HERO: The Brand Hook (Laptop Full-Height) */}
      <Hero />

      {/* 2. PROVENANCE BAR: Desktop Trust Signal */}
      <div className="hidden lg:block border-y border-gray-100 bg-gray-50/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-12 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">
           <div className="flex items-center gap-3">
             <ShieldCheck size={16} className="text-gold" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">GIA Certified Registry</span>
           </div>
           <div className="flex items-center gap-3">
             <Gem size={16} className="text-gold" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Physical Custody Guaranteed</span>
           </div>
           <div className="flex items-center gap-3">
             <ShieldCheck size={16} className="text-gold" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Insured Global Logistics</span>
           </div>
        </div>
      </div>

      {/* 3. THE CATEGORY MANIFESTO: Animated Zig-Zag */}
      <section className="py-20 md:py-40 space-y-32 md:space-y-60 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <CategorySplit 
          title="Masterful Timepieces"
          subtitle="Horological Heritage"
          description="Curated excellence from the world's most prestigious maisons. Every timepiece is verified for provenance and mechanical integrity."
          cta="Explore Watches"
          href="/collection?cat=watches"
          image="/watches-home.jpg"
          reverse={false}
        />

        <CategorySplit 
          title="Exquisite Diamonds"
          subtitle="Exceptional Clarity"
          description="Only the rarest stones make it into our vault. Every diamond is GIA certified and hand-selected for its fire, brilliance, and sovereign lineage."
          cta="Explore Diamonds"
          href="/collection?cat=diamonds"
          image="/diamonds-home.jpg"
          reverse={true}
        />

        <CategorySplit 
          title="Pure 24K Bullion"
          subtitle="Physical Autonomy"
          description="Rich, heavy, and undeniably pure. Discover solid gold assets designed to be worn for a lifetime and held for generations."
          cta="Explore Gold"
          href="/collection?cat=gold"
          image="/gold-home.jpg"
          reverse={false}gold-homediamonds-home
        />
      </section>

      {/* 4. DYNAMIC REVEAL: Best Sellers (Grid Audit) */}
      <section className="bg-black py-24 md:py-40 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto space-y-20">
          <header className="text-center space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]"
            >
              The Collection
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-medium font-serif italic tracking-tighter"
            >
              <span className="!text-white">Most</span> <span className="text-gold not-italic">Coveted.</span>
            </motion.h2>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-gold" size={32} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Syncing Vault...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {bestSellers.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center pt-12">
             <Link href="/collection" className="group inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-gold transition-all duration-500">
                View Entire Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* 5. INSTITUTIONAL SECURITY */}
      <SecurityStandards />

      {/* 6. THE ADVISORY CALL */}
      <section className="pb-32 bg-white">
        <ConciergeCall />
      </section>

    </main>
  )
}

/** * AUDITED UI COMPONENT: Category Split
 * Optimized for Laptop Side-by-Side and Mobile Stacking
 */
function CategorySplit({ title, subtitle, description, cta, href, image, reverse }: any) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 lg:gap-40`}>
      
      {/* IMAGE SIDE: Cinematic Reveal */}
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 aspect-[4/5] bg-gray-100 relative rounded-2xl md:rounded-[3rem] overflow-hidden group shadow-2xl"
      >
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[3s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
      </motion.div>

      {/* TEXT SIDE: Luxury Typography */}
      <div className="w-full md:w-1/2 space-y-10 text-center md:text-left">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-4"
        >
          <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">{subtitle}</p>
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-medium text-black font-serif italic tracking-tighter leading-[0.9]">{title}</h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md mx-auto md:mx-0 font-medium italic border-l-2 border-gold/20 pl-8"
        >
          {description}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Link href={href} className="inline-flex items-center gap-6 px-12 py-6 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 rounded-full group">
            {cta}
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}