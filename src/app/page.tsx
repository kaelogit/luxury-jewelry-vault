'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
      const supabase = createClient()
      const { data } = await supabase
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
    <main className="min-h-screen bg-white overflow-x-hidden selection:bg-gold selection:text-white font-sans">
      
      {/* 1. HERO */}
      <Hero />

      {/* 2. TRUST SIGNAL */}
      <div className="hidden lg:block border-y border-gray-100 bg-gray-50/30 py-8">
        <div className="max-w-screen-2xl mx-auto px-12 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity duration-500 cursor-default">
           <div className="flex items-center gap-3">
             <ShieldCheck size={16} className="text-gold" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Certified Authentic</span>
           </div>
           <div className="flex items-center gap-3">
             <Gem size={16} className="text-gold" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Expertly Curated</span>
           </div>
           <div className="flex items-center gap-3">
             <ShieldCheck size={16} className="text-gold" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Insured Shipping</span>
           </div>
        </div>
      </div>

      {/* 3. COLLECTIONS */}
      <section className="py-24 md:py-32 space-y-32 md:space-y-48 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <CategorySplit 
          title="Timepieces"
          subtitle="Precision Engineering"
          description="Curated excellence from the world's most prestigious brands. Every timepiece is verified for provenance and mechanical integrity."
          cta="View Watches"
          href="/collection?cat=watches"
          image="/watches-home.jpg"
          reverse={false}
        />

        <CategorySplit 
          title="Diamonds"
          subtitle="Rare Brilliance"
          description="Only the finest stones make it into our collection. Every diamond is certified and hand-selected for its fire and clarity."
          cta="View Diamonds"
          href="/collection?cat=diamonds"
          image="/diamonds-home.jpg"
          reverse={true}
        />

        <CategorySplit 
          title="Gold Bullion"
          subtitle="Pure Investment"
          description="Rich, heavy, and undeniably pure. Discover solid gold assets designed to be worn for a lifetime and held for generations."
          cta="View Gold"
          href="/collection?cat=gold"
          image="/gold-home.jpg"
          reverse={false}
        />
      </section>

      {/* 4. BEST SELLERS */}
      <section className="bg-obsidian-900 py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto space-y-20">
          <header className="text-center space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold text-[10px] font-bold uppercase tracking-[0.4em]"
            >
              Curated Selection
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-medium font-serif italic tracking-tight !text-white"
            >
              Most <span className="text-gold not-italic">Coveted.</span>
            </motion.h2>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-gold" size={32} strokeWidth={1.5} />
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
                  {/* Assuming ProductCard handles dark mode via props or CSS variables context */}
                  <div className="bg-white rounded-xl p-4">
                      <ProductCard product={product} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center pt-12">
             <Link href="/collection" className="group inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-gold transition-all duration-500">
                Browse Full Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* 5. SECURITY */}
      <SecurityStandards />

      {/* 6. CONCIERGE */}
      <section className="pb-32 bg-white">
        <ConciergeCall />
      </section>

    </main>
  )
}

/** HELPER COMPONENTS */

function CategorySplit({ title, subtitle, description, cta, href, image, reverse }: any) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 lg:gap-32`}>
      
      {/* IMAGE */}
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 aspect-[4/5] bg-gray-100 relative rounded-[2.5rem] overflow-hidden group shadow-xl"
      >
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-1000" />
      </motion.div>

      {/* TEXT */}
      <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-4"
        >
          <p className="text-gold text-[10px] font-bold uppercase tracking-[0.4em]">{subtitle}</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black font-serif italic tracking-tight leading-none">{title}</h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md mx-auto md:mx-0 font-medium"
        >
          {description}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-6"
        >
          <Link href={href} className="inline-flex items-center gap-4 px-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-300 rounded-xl shadow-lg active:scale-95 group">
            {cta}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}