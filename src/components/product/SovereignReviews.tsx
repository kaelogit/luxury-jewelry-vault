'use client'

import React, { useMemo } from 'react'
import { Star, CheckCircle2, MapPin } from 'lucide-react'
import { generateSovereignReviews } from '@/lib/reviewGenerator'

interface ReviewProps {
  productId: string
  category: 'Watches' | 'Diamonds' | 'Gold'
}

export default function SovereignReviews({ productId, category }: ReviewProps) {
  // useMemo ensures the reviews don't re-shuffle on every re-render
  const reviews = useMemo(() => 
    generateSovereignReviews(productId, category, 2), 
    [productId, category]
  );

  return (
    <section className="py-24 bg-white border-t border-ivory-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Client Registry</p>
            <h3 className="text-4xl md:text-6xl font-serif italic text-obsidian-900 leading-none">
              The Sovereign <br/> <span className="text-gold not-italic">Verdict.</span>
            </h3>
          </div>
          {/* Rating Summary Block */}
          <div className="flex items-center gap-6 border-l border-ivory-200 pl-8">
             <span className="text-6xl font-serif italic text-obsidian-900">5.0</span>
             <div className="space-y-1">
               <div className="flex text-gold gap-0.5">
                 {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-obsidian-400">Verified Acquisitions</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {reviews.map((review, idx) => (
            <div key={idx} className="space-y-6 p-8 md:p-12 bg-ivory-50 rounded-[2.5rem] border border-ivory-200 relative">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-obsidian-900 uppercase tracking-tight">{review.author}</h4>
                    <CheckCircle2 size={12} className="text-gold" />
                  </div>
                  <div className="flex items-center gap-1.5 text-obsidian-400">
                    <MapPin size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{review.location}</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gold/40 uppercase tracking-[0.2em]">Verified</span>
              </div>

              <p className="text-obsidian-700 text-lg md:text-xl font-medium leading-relaxed italic">
                &ldquo;{review.content}&rdquo;
              </p>

              <div className="flex text-gold/40 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}