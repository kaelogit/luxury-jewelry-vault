'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, ShieldCheck, Headphones, Globe, Sparkles } from 'lucide-react'

export default function ConciergeCall() {
  return (
    <section id="concierge" className="py-20 md:py-32 px-6 md:px-12 bg-ivory-100 border-t border-ivory-300 relative overflow-hidden">
      
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        
        {/* LEFT SIDE: THE SERVICE NARRATIVE */}
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-3">
             <p className="label-caps text-gold">Private Advisory</p>
             <h2 className="text-5xl md:text-8xl font-medium text-obsidian-900 leading-[0.9] tracking-tight font-serif italic">
               Personalized <br/> 
               <span className="text-gold not-italic">Service.</span> <br/>
               <span className="text-obsidian-900">Bespoke Care.</span>
             </h2>
          </div>

          <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed max-w-md border-l border-gold/40 pl-8 font-medium">
            For acquisitions of exceptional rarity or custom commissions, our private advisors are available to guide you through every detail of the process.
          </p>
          
          <div className="pt-4">
            <button className="group relative bg-obsidian-900 text-white px-10 py-6 rounded-lg text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold transition-all duration-500 flex items-center gap-4 shadow-xl">
              <span>Contact a Specialist</span>
              <MessageSquare size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: THE EXPERIENCE STAGES */}
        <div className="space-y-12">
          <ServiceStep 
            number="01" 
            icon={<Sparkles size={20} strokeWidth={1.5} />} 
            title="Discovery & Curation" 
            desc="Work directly with an advisor to source rare stones or vintage timepieces tailored to your specific collection goals."
          />
          <ServiceStep 
            number="02" 
            icon={<Headphones size={20} strokeWidth={1.5} />} 
            title="Private Consultation" 
            desc="Enjoy an end-to-end personal dialogue to discuss specifications, custom engravings, or bespoke design adjustments."
          />
          <ServiceStep 
            number="03" 
            icon={<Globe size={20} strokeWidth={1.5} />} 
            title="White-Glove Delivery" 
            desc="Your acquisition is delivered via fully insured, specialized luxury couriers to ensure it reaches you in pristine condition."
          />
        </div>

      </div>
    </section>
  )
}

function ServiceStep({ number, icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex gap-8 group"
    >
      <div className="text-gold/10 text-6xl font-serif italic group-hover:text-gold/30 transition-colors duration-700 select-none">
        {number}
      </div>
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-4">
          <div className="text-gold">
            {icon}
          </div>
          <h4 className="text-xl font-medium text-obsidian-900 font-serif italic">{title}</h4>
        </div>
        <p className="text-xs text-obsidian-600 leading-relaxed max-w-sm">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}