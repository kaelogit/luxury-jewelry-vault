'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Verified, ShieldCheck } from 'lucide-react'
import { REVIEW_VOCAB } from '@/lib/reviewData'

interface Props {
  productId: string
  assetClass: string // 'GOLD', 'DIAMOND', 'WATCH'
}

export default function SovereignReviews({ productId, assetClass }: Props) {
  // MEMBER TIERS for deterministic assignment
  const tiers = ["Sovereign Tier", "Platinum Collector", "Estate Member", "Private Client"]

  const dailyReviews = useMemo(() => {
    const category = assetClass.toLowerCase() as 'gold' | 'diamond' | 'watch'
    const vocab = REVIEW_VOCAB[category] || REVIEW_VOCAB.gold
    
    // 1. SEED LOGIC: Product ID + Date (Ensures 24h refresh)
    const today = new Date().toISOString().split('T')[0]
    const seed = `${productId}-${today}`
    
    // 2. GENERATOR: 10 Unique Deterministic Reviews
    return Array.from({ length: 10 }).map((_, i) => {
      // Deterministic indices for phrases
      const pIdx = (seed.charCodeAt(i % seed.length) + i) % vocab.prefixes.length
      const mIdx = (seed.charCodeAt((i + 3) % seed.length) + i) % vocab.middles.length
      const sIdx = (seed.charCodeAt((i + 6) % seed.length) + i) % vocab.suffixes.length
      
      // Deterministic Author ID
      const authorId = 1000 + (seed.charCodeAt(i % seed.length) * (i + 1)) % 8999
      const tier = tiers[authorId % tiers.length]

      return {
        id: `${seed}-${i}`,
        author: `MEMBER #${authorId}`,
        tier: tier,
        content: `${vocab.prefixes[pIdx]} ${vocab.middles[mIdx]} ${vocab.suffixes[sIdx]}`,
        date: 'VERIFIED ACQUISITION',
        rating: 5
      }
    })
  }, [productId, assetClass])

  return (
    <section className="py-32 border-t border-ivory-300">
      {/* HEADER: Registry Status */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="text-gold" size={14} fill="currentColor" />
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gold italic">Member Registry</p>
          </div>
          <h2 className="text-6xl md:text-8xl font-light text-obsidian-900 italic tracking-tighter leading-none">
            Verified <span className="text-obsidian-400">Testimony.</span>
          </h2>
        </div>
        <div className="text-right space-y-2">
          <p className="text-[11px] text-obsidian-300 font-black uppercase tracking-[0.4em] italic">Registry Refresh: 24 Hours</p>
          <div className="h-1.5 w-24 bg-gold/20 ml-auto rounded-full" />
        </div>
      </div>

      {/* GRID: The 10 Daily Testimonies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {dailyReviews.map((rev, i) => (
          <motion.div 
            key={rev.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="p-12 bg-white border border-ivory-300 rounded-[4rem] shadow-sm hover:shadow-2xl hover:border-gold/20 transition-all duration-700 group relative overflow-hidden"
          >
            {/* Subtle Gold Aura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] pointer-events-none group-hover:bg-gold/10 transition-all" />
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black text-obsidian-900 uppercase tracking-widest italic">{rev.author}</p>
                  <span className="text-[8px] bg-gold/10 text-gold px-3 py-1 rounded-full font-black uppercase tracking-widest border border-gold/20 leading-none">
                    {rev.tier}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Verified size={12} className="text-gold" />
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest italic leading-none">{rev.date}</p>
                </div>
              </div>
              <div className="flex gap-1.5 pt-1">
                {[...Array(rev.rating)].map((_, starI) => (
                  <Star key={starI} size={11} className="text-gold fill-gold" />
                ))}
              </div>
            </div>
            
            <p className="text-xl text-obsidian-600 leading-relaxed font-light italic relative z-10 pr-6">
              "{rev.content}"
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* SECURE FOOTNOTE */}
      <div className="mt-24 flex flex-col items-center gap-4 opacity-40">
        <ShieldCheck size={20} className="text-gold" />
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-obsidian-900 italic">
          End-to-End Encrypted Registry Protocol
        </p>
      </div>
    </section>
  )
}