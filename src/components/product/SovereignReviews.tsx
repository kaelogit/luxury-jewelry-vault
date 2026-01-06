'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, ShieldCheck, User, Quote } from 'lucide-react'

interface Props {
  productId: string
  assetClass: string
}

const MOCK_REVIEWS = [
  { id: 1, name: "Member_4821", location: "Geneva, CH", text: "The settlement process was seamless. Armored delivery was precise and the asset verification matched the GIA registry perfectly.", rating: 5 },
  { id: 2, name: "Member_9920", location: "Zurich, CH", text: "Exceptional horological expertise. The Patek arrived in a hermetically sealed transit case. Sovereign status confirmed.", rating: 5 },
  { id: 3, name: "Member_1024", location: "Dubai, UAE", text: "First acquisition via LUME. No legacy bank delays, just pure cryptographic settlement. This is the future of wealth.", rating: 5 },
]

export default function SovereignReviews({ productId, assetClass }: Props) {
  return (
    <section className="mt-48 space-y-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <ShieldCheck className="text-gold" size={16} />
             <p className="text-[10px] font-black text-gold uppercase tracking-[0.5em] italic">Member Ledger</p>
          </div>
          <h2 className="text-5xl md:text-7xl font-light text-obsidian-900 italic tracking-tighter leading-none">
            24h Member <span className="text-obsidian-400">Testimony.</span>
          </h2>
        </div>
        <div className="flex items-center gap-6 pb-2">
           <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
           </div>
           <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-widest leading-none border-l border-ivory-300 pl-6">
             100% Protocol Satisfaction
           </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {MOCK_REVIEWS.map((rev, i) => (
          <motion.div 
            key={rev.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="p-10 bg-white border border-ivory-300 rounded-[3rem] space-y-8 shadow-sm hover:shadow-2xl transition-all duration-700 group"
          >
            <Quote className="text-ivory-300 group-hover:text-gold transition-colors duration-700" size={32} />
            <p className="text-obsidian-600 text-sm italic font-medium leading-relaxed">
              "{rev.text}"
            </p>
            <div className="pt-8 border-t border-ivory-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ivory-50 rounded-xl flex items-center justify-center text-obsidian-200">
                    <User size={18} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-obsidian-900 uppercase tracking-widest">{rev.name}</h5>
                    <p className="text-[8px] text-obsidian-300 uppercase tracking-widest font-bold">{rev.location}</p>
                  </div>
               </div>
               <ShieldCheck className="text-gold/20" size={16} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}