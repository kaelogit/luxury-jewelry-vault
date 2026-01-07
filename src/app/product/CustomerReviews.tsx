'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, Quote, Award } from 'lucide-react'

interface Review {
  id: string
  author: string
  location: string
  content: string
  date: string
  rating: number
  verified: boolean
}

interface Props {
  productId: string
  category: string 
}

// These are our "Institutional Samples" to fill the space during development
const MOCK_REVIEWS: Record<string, Review[]> = {
  gold: [
    { id: 'g1', author: 'Julian R.', location: 'Paris, FR', content: 'The 24K luster is unlike anything I have seen in modern retail. Truly investment-grade quality.', date: 'Jan 02, 2026', rating: 5, verified: true },
    { id: 'g2', author: 'Elena S.', location: 'Geneva, CH', content: 'A beautiful weight. The craftsmanship on the clasp is institutional and very secure.', date: 'Dec 28, 2025', rating: 5, verified: true },
  ],
  watches: [
    { id: 'w1', author: 'Marcus K.', location: 'Singapore', content: 'Movement is flawless. Arrived in a high-security vault box with all original documentation.', date: 'Jan 05, 2026', rating: 5, verified: true },
  ],
  diamonds: [
    { id: 'd1', author: 'Sophia L.', location: 'New York, USA', content: 'The GIA report matched the laser inscription perfectly. The fire in this stone is extraordinary.', date: 'Dec 15, 2025', rating: 5, verified: true },
  ]
}

export default function CustomerReviews({ productId, category }: Props) {
  // Logic: Pick reviews based on the category, or default to gold
  const displayReviews = MOCK_REVIEWS[category.toLowerCase()] || MOCK_REVIEWS.gold

  return (
    <section className="py-24 border-t border-ivory-300 bg-white/30">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-20">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Award className="text-gold" size={14} />
              <p className="label-caps !text-[10px] text-gold">Authenticity Guaranteed</p>
            </div>
            <h2 className="text-4xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight">
              Client <span className="text-gold not-italic">Appraisals.</span>
            </h2>
          </div>

          <div className="flex items-center gap-8 border-l border-ivory-300 pl-8 hidden md:flex">
             <div className="text-center">
                <p className="text-2xl font-serif italic text-obsidian-900">4.9/5</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-obsidian-400">Rating</p>
             </div>
             <div className="text-center">
                <p className="text-2xl font-serif italic text-obsidian-900">100%</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-obsidian-400">Authenticity</p>
             </div>
          </div>
        </div>

        {/* REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {displayReviews.map((rev) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-white border border-ivory-200 rounded-xl shadow-sm space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-obsidian-900 uppercase tracking-widest">{rev.author}</h4>
                  <p className="text-[10px] text-obsidian-400 font-medium uppercase tracking-widest">{rev.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="text-gold fill-gold" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-obsidian-600 leading-relaxed italic">
                "{rev.content}"
              </p>

              <div className="pt-4 border-t border-ivory-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-gold" />
                  <span className="text-[9px] font-bold text-gold uppercase tracking-[0.2em]">Verified Acquisition</span>
                </div>
                <span className="text-[9px] font-medium text-obsidian-300 uppercase tracking-widest">{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}