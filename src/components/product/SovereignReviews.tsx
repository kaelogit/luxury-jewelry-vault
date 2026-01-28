'use client'

import React, { useMemo } from 'react'
import { Star, CheckCircle2, MapPin } from 'lucide-react'

interface ReviewProps {
  productId: string
  category: 'Watches' | 'Diamonds' | 'Gold' | string
}

export default function SovereignReviews({ productId, category }: ReviewProps) {
  // Use local deterministic data generator
  const reviews = useMemo(() => 
    getMockReviews(category), 
    [category]
  );

  return (
    <section className="py-24 bg-white border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Verified Owners</p>
            <h3 className="text-4xl md:text-6xl font-serif italic text-obsidian-900 leading-none">
              Client <span className="text-gold not-italic">Reviews.</span>
            </h3>
          </div>
          
          {/* RATING SUMMARY */}
          <div className="flex items-center gap-6 border-l border-gray-100 pl-8">
             <span className="text-6xl font-serif italic text-obsidian-900">5.0</span>
             <div className="space-y-1">
               <div className="flex text-gold gap-0.5">
                 {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
               </div>
               <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">100% Authenticated</p>
             </div>
          </div>
        </div>

        {/* REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="space-y-6 p-8 md:p-12 bg-gray-50 rounded-3xl border border-gray-100 relative group hover:border-gold/30 transition-colors duration-500">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-obsidian-900 uppercase tracking-tight">{review.author}</h4>
                    <CheckCircle2 size={14} className="text-gold" />
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MapPin size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{review.location}</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gold/60 uppercase tracking-[0.2em] border border-gold/20 px-2 py-1 rounded-full">
                  Verified Purchase
                </span>
              </div>

              <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed italic">
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

// LOCAL HELPER: Deterministic Mock Data
function getMockReviews(category: string) {
  const base = [
    {
      author: 'Julian R.',
      location: 'Zurich, CH',
      content: 'The condition was exactly as described. The vault handover process was seamless and incredibly professional.'
    },
    {
      author: 'Elena S.',
      location: 'New York, USA',
      content: 'Authenticity was my main concern, but the documentation provided was exhaustive. A truly secure acquisition.'
    }
  ]

  if (category === 'Watches') {
    return [
      {
        author: 'Marcus K.',
        location: 'Singapore',
        content: 'The movement is flawless. Arrived in a high-security vault box with all original papers intact.'
      },
      ...base.slice(0,1)
    ]
  }
  
  if (category === 'Diamonds') {
    return [
      {
        author: 'Sophia L.',
        location: 'London, UK',
        content: 'The GIA report matched the laser inscription perfectly. The fire in this stone is extraordinary.'
      },
      ...base.slice(1)
    ]
  }

  return base
}