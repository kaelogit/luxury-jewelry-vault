'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, Award } from 'lucide-react'

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

// Institutional Mock Data
const MOCK_REVIEWS: Record<string, Review[]> = {
  gold: [
    { id: 'g1', author: 'Julian R.', location: 'Paris, FR', content: 'The 24K luster is unlike anything I have seen in modern retail. Truly investment-grade quality.', date: 'Jan 02, 2026', rating: 5, verified: true },
    { id: 'g2', author: 'Elena S.', location: 'Geneva, CH', content: 'A beautiful weight. The craftsmanship on the clasp is institutional and very secure.', date: 'Dec 28, 2025', rating: 5, verified: true },
  ],
  watches: [
    { id: 'w1', author: 'Marcus K.', location: 'Singapore', content: 'Movement is flawless. Arrived in a high-security vault box with all original documentation.', date: 'Jan 05, 2026', rating: 5, verified: true },
    { id: 'w2', author: 'David L.', location: 'London, UK', content: 'The service was impeccable. Delivered securely by private courier.', date: 'Jan 10, 2026', rating: 5, verified: true },
  ],
  diamonds: [
    { id: 'd1', author: 'Sophia L.', location: 'New York, USA', content: 'The GIA report matched the laser inscription perfectly. The fire in this stone is extraordinary.', date: 'Dec 15, 2025', rating: 5, verified: true },
    { id: 'd2', author: 'James H.', location: 'Toronto, CA', content: 'Stunning clarity. The setting allows light to enter from all angles.', date: 'Jan 08, 2026', rating: 5, verified: true },
  ]
}

export default function CustomerReviews({ productId, category }: Props) {
  // Logic: Pick reviews based on the category, or default to gold
  const displayReviews = MOCK_REVIEWS[category.toLowerCase()] || MOCK_REVIEWS.gold

  return (
    <section className="py-24 border-t border-ivory-200 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-16">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Award className="text-gold" size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Authenticity Guaranteed</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight">
              Client <span className="text-gold not-italic">Reviews.</span>
            </h2>
          </div>

          <div className="flex items-center gap-8 border-l border-gray-100 pl-8 hidden md:flex">
             <div className="text-center">
                <p className="text-2xl font-serif italic text-black">4.9/5</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Rating</p>
             </div>
             <div className="text-center">
                <p className="text-2xl font-serif italic text-black">100%</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Verified</p>
             </div>
          </div>
        </div>

        {/* REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayReviews.map((rev) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-50 border border-gray-100 rounded-xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-black uppercase tracking-widest">{rev.author}</h4>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{rev.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-gold fill-gold" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                "{rev.content}"
              </p>

              <div className="pt-4 border-t border-gray-200/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-gold" />
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest">Verified Owner</span>
                </div>
                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}