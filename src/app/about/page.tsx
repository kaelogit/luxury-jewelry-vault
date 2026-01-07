'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, ShieldCheck, Globe, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6">
      <div className="max-w-screen-2xl mx-auto space-y-32">
        
        {/* I. HERO SECTION: THE PHILOSOPHY */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="label-caps text-gold">Our Philosophy</p>
              <h1 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
                Purity in <br/> <span className="text-gold not-italic">Concentration.</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-obsidian-600 font-medium leading-relaxed max-w-xl">
              Lume Vault was founded on a singular obsession: the preservation of wealth through the most untainted forms of gold and craftsmanship.
            </p>
          </div>
          <div className="relative aspect-[4/5] bg-ivory-200 rounded-2xl overflow-hidden shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1588444839799-eb60f0066d47?auto=format&fit=crop&q=80" 
               className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
               alt="Molten Gold"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/40 to-transparent" />
          </div>
        </section>

        {/* II. THE THREE PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-ivory-300 pt-20">
          <Pillar 
            icon={<Crown className="text-gold" />}
            title="24K Sovereignty"
            desc="Unlike standard luxury brands that dilute gold to 14K or 18K, our collection celebrates the raw, heavy brilliance of 24K purity."
          />
          <Pillar 
            icon={<ShieldCheck className="text-gold" />}
            title="Institutional Security"
            desc="Your acquisitions are physically handled through secured vaults and armored transport, ensuring the chain of custody is never broken."
          />
          <Pillar 
            icon={<Globe className="text-gold" />}
            title="Global Settlement"
            desc="We bridge the gap between ancient wealth and modern technology, accepting direct transfers in Bitcoin, Ethereum, and Bank Wires."
          />
        </section>

        {/* III. EDITORIAL SPREAD: THE CRAFTSMANSHIP */}
        <section className="bg-obsidian-900 rounded-[3rem] p-12 md:p-24 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold blur-[120px]" />
          </div>
          
          <div className="max-w-4xl space-y-12 relative z-10">
            <h2 className="text-4xl md:text-7xl font-medium font-serif italic tracking-tight">
              Crafted for the <span className="text-gold not-italic">Generational</span> Collector.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-ivory-400 font-medium leading-relaxed">
              <p>
                Every piece in the Lume Vault is inspected by master gemologists and horologists. We do not mass-produce; we curate. Our watches are sourced from private estates, and our gold is poured by artisans who understand the weight of heritage.
              </p>
              <p>
                When you acquire from the Vault, you aren't just buying jewelry. You are securing a physical asset that carries its value across borders, through time, and into the hands of those who follow you.
              </p>
            </div>
            <Link href="/collection" className="inline-flex items-center gap-4 text-gold uppercase text-xs font-bold tracking-[0.3em] group">
              Explore the Registry <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}

function Pillar({ icon, title, desc }: any) {
  return (
    <div className="space-y-6">
      <div className="w-12 h-12 bg-white border border-ivory-300 rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-obsidian-900 uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-obsidian-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  )
}