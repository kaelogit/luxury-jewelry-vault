'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, Globe, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
        
        {/* I. HERO SECTION */}
        <header className="max-w-4xl space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">The Maison</p>
          <h1 className="text-5xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Our <span className="text-gold not-italic">Story.</span>
          </h1>
          <p className="text-obsidian-600 text-lg md:text-2xl leading-relaxed font-medium italic border-l-2 border-gold pl-8">
            Lume Vault was founded on a single principle: that the acquisition of exceptional jewelry and timepieces should be as secure as the assets themselves.
          </p>
        </header>

        {/* II. THE NARRATIVE BLOCKS */}
        <div className="space-y-32">
          
          {/* Chapter 1: The Vision */}
          <StoryBlock 
            number="01"
            title="A Legacy of Discretion"
            content="Born in the heart of the world's financial capitals, Lume Vault emerged as a private alternative to traditional luxury retail. We recognized a need for a platform that prioritized the privacy of the collector and the physical preservation of the asset above all else."
            image="https://images.unsplash.com/photo-1588444839799-eb00f490465c?auto=format&fit=crop&q=80&w=1000" // Sophisticated Vault Door
            reverse={false}
          />

          {/* Chapter 2: The Sourcing */}
          <StoryBlock 
            number="02"
            title="Uncompromising Standards"
            content="Every diamond, timepiece, and gold investment in our registry undergoes a rigorous multi-point appraisal. We partner exclusively with master maisons and certified gemological laboratories to ensure that every piece meets our standard of absolute authenticity and investment-grade quality."
            image="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1000" // Macro Jewelry Work
            reverse={true}
          />

        </div>

        {/* III. CORE VALUES GRID */}
        <section className="bg-white border border-ivory-300 rounded-[3rem] p-10 md:p-20 shadow-sm">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-obsidian-900">The Lume Pillars</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Our Commitment to Excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
          <h3 className="text-4xl md:text-6xl font-serif italic text-obsidian-900">Begin Your Acquisition.</h3>
          <Link 
            href="/collection"
            className="inline-flex items-center gap-4 bg-obsidian-900 text-white px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 shadow-xl active:scale-95"
          >
            Explore the Registry <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </main>
  )
}

function StoryBlock({ number, title, content, image, reverse }: any) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={`space-y-6 ${reverse ? 'lg:order-2' : ''}`}>
        <span className="text-5xl font-serif italic text-gold/20">{number}</span>
        <h3 className="text-3xl md:text-5xl font-serif italic text-obsidian-900 tracking-tight">{title}</h3>
        <p className="text-obsidian-600 text-base md:text-lg leading-relaxed font-medium">
          {content}
        </p>
      </div>
      <div className={`aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-ivory-200 shadow-2xl ${reverse ? 'lg:order-1' : ''}`}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
        />
      </div>
    </div>
  )
}

function ValueItem({ icon, title, desc }: any) {
  return (
    <div className="text-center space-y-4 group">
      <div className="w-16 h-16 bg-ivory-50 rounded-2xl flex items-center justify-center mx-auto border border-ivory-200 group-hover:bg-gold group-hover:text-white transition-all duration-500">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h4 className="text-lg font-serif italic text-obsidian-900">{title}</h4>
      <p className="text-xs text-obsidian-500 font-bold uppercase tracking-widest leading-relaxed">
        {desc}
      </p>
    </div>
  )
}