'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, ShieldCheck, Globe, Search, CheckCircle2, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ConciergeCall() {
  return (
    <section id="concierge" className="py-20 md:py-32 px-6 md:px-12 bg-ivory-100 border-t border-ivory-300 relative overflow-hidden">
      
      {/* Subtle Aesthetic Aura */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        
        {/* I. THE NARRATIVE: Professional Advisory */}
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <ShieldCheck size={14} className="text-gold" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Concierge Standard</p>
             </div>
             <h2 className="text-5xl md:text-8xl font-medium text-obsidian-900 leading-[0.9] tracking-tight font-serif italic">
               Personal <br/> 
               <span className="text-gold not-italic">Guidance.</span> <br/>
               <span className="text-obsidian-900">Professional Care.</span>
             </h2>
          </div>

          <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed max-w-md border-l-2 border-gold pl-8 font-medium italic">
            Whether you are seeking a specific rare timepiece or a particular diamond cut, our advisors provide the professional support needed to manage your acquisition.
          </p>
          
          <div className="pt-4">
            <Link href="/contact" className="inline-flex">
              <button className="group relative bg-obsidian-900 text-white px-12 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-obsidian-900 transition-all duration-500 flex items-center gap-6 shadow-2xl active:scale-[0.98]">
                <span>Contact an Advisor</span>
                <div className="w-8 h-[1px] bg-white/30 group-hover:bg-obsidian-900/30 transition-colors" />
                <Phone size={16} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* II. THE PROCESS: From Inquiry to Handover */}
        <div className="space-y-10 md:space-y-16">
          <ServiceStep 
            number="01" 
            icon={<Search size={18} strokeWidth={1.5} />} 
            title="Inquiry & Sourcing" 
            desc="Our team assists in locating specific items within our global collection that meet your exact aesthetic and investment criteria."
          />
          <ServiceStep 
            number="02" 
            icon={<CheckCircle2 size={18} strokeWidth={1.5} />} 
            title="Authentication & Inspection" 
            desc="Every piece undergoes a final, rigorous professional audit and quality inspection before it is cleared for departure from our vault."
          />
          <ServiceStep 
            number="03" 
            icon={<Globe size={18} strokeWidth={1.5} />} 
            title="Insured Logistics" 
            desc="We manage the entire delivery process via private couriers, ensuring a secure and professional handover directly to your location."
          />
        </div>

      </div>
    </section>
  )
}

function ServiceStep({ number, icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col sm:flex-row gap-6 md:gap-10 group"
    >
      {/* Editorial Numbering */}
      <div className="text-gold/10 text-6xl md:text-7xl font-serif italic group-hover:text-gold/20 transition-colors duration-700 select-none leading-none">
        {number}
      </div>
      
      <div className="space-y-3 pt-0 sm:pt-4">
        <div className="flex items-center gap-4">
          <div className="text-gold bg-white p-3 rounded-xl shadow-sm border border-ivory-300 group-hover:bg-gold group-hover:text-white transition-all duration-500">
            {icon}
          </div>
          <h4 className="text-xl md:text-2xl font-medium text-obsidian-900 font-serif italic">{title}</h4>
        </div>
        <p className="text-[11px] md:text-xs text-obsidian-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}