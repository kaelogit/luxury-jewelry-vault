'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, Globe, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-4 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
        
        {/* I. HERO SECTION */}
        <header className="max-w-4xl space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">The Maison</p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium text-obsidian-900 font-serif italic tracking-tighter leading-[0.85]">
              Our <span className="text-gold not-italic">Story.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl border-l-2 border-gold pl-8"
          >
            <p className="text-xl md:text-2xl text-obsidian-600 leading-relaxed font-medium italic">
              Lume Vault was founded on a single principle: that the acquisition of exceptional jewelry and timepieces should be as secure as the assets themselves.
            </p>
          </motion.div>
        </header>

        {/* II. THE NARRATIVE BLOCKS */}
        <div className="space-y-32 md:space-y-48">
          
          {/* Chapter 1: The Vision */}
          <StoryBlock 
            number="01"
            title="A Legacy of Discretion"
            content="Born in the heart of the world's financial capitals, Lume Vault emerged as a private alternative to traditional luxury retail. We recognized a need for a platform that prioritized the privacy of the collector and the physical preservation of the asset above all else."
            // IMAGE: High-end architectural vault/safe detail
            image="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1000" 
           
            reverse={false}
          />

          {/* Chapter 2: The Sourcing */}
          <StoryBlock 
            number="02"
            title="Uncompromising Standards"
            content="Every diamond, timepiece, and gold investment in our registry undergoes a rigorous multi-point appraisal. We partner exclusively with master maisons and certified gemological laboratories to ensure that every piece meets our standard of absolute authenticity and investment-grade quality."
            // IMAGE: White-glove inspection of a luxury watch movement
            image="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200"
            reverse={true}
          />

        </div>

        {/* III. CORE VALUES GRID */}
        <section className="bg-white border border-ivory-300 rounded-[3rem] p-8 md:p-20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="text-center mb-16 space-y-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif italic text-obsidian-900 tracking-tight">The Lume Pillars</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Our Commitment to Excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            <ValueItem 
              icon={<ShieldCheck className="text-gold" />}
              title="Absolute Security"
              desc="From encrypted settlements to private concierge handovers, your security is integrated into every stage of the journey."
            />
            <ValueItem 
              icon={<Award className="text-gold" />}
              title="Verified Origin"
              desc="We provide full documentation and lineage for every acquisition, ensuring transparency and long-term value."
            />
            <ValueItem 
              icon={<Globe className="text-gold" />}
              title="Global Reach"
              desc="Our logistics network spans continents, providing the same level of white-glove service in New York, Dubai, or London."
            />
          </div>
        </section>

        {/* IV. CALL TO ACTION */}
        <section className="text-center space-y-10 py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h3 className="text-5xl md:text-7xl font-serif italic text-obsidian-900 leading-tight">Begin Your <br/> <span className="text-gold not-italic">Acquisition.</span></h3>
            <Link 
              href="/collection"
              className="inline-flex items-center gap-4 bg-obsidian-900 text-white px-10 md:px-14 py-5 md:py-7 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500 shadow-2xl active:scale-95 group"
            >
              Explore the Registry 
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </section>

      </div>
    </main>
  )
}

function StoryBlock({ number, title, content, image, reverse }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center">
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`space-y-8 ${reverse ? 'lg:order-2' : ''}`}
      >
        <div className="space-y-2">
          <span className="text-6xl md:text-8xl font-serif italic text-gold/10 block leading-none">{number}</span>
          <h3 className="text-4xl md:text-6xl font-serif italic text-obsidian-900 tracking-tighter leading-tight">{title}</h3>
        </div>
        <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed font-medium">
          {content}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-ivory-200 shadow-3xl group ${reverse ? 'lg:order-1' : ''}`}
      >
        <div className="absolute inset-0 bg-obsidian-900/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out"
        />
      </motion.div>
    </div>
  )
}

function ValueItem({ icon, title, desc }: any) {
  return (
    <div className="text-center space-y-6 group">
      <div className="w-20 h-20 bg-ivory-50 rounded-[2rem] flex items-center justify-center mx-auto border border-ivory-200 group-hover:bg-gold group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm">
        {React.cloneElement(icon, { size: 32, strokeWidth: 1.5 })}
      </div>
      <div className="space-y-3">
        <h4 className="text-2xl font-serif italic text-obsidian-900">{title}</h4>
        <p className="text-[10px] text-obsidian-500 font-black uppercase tracking-[0.2em] leading-relaxed max-w-[240px] mx-auto">
          {desc}
        </p>
      </div>
    </div>
  )
}