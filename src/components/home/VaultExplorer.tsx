'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Gem, Clock, Fingerprint } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    title: "Investment Grade Bullion",
    desc: "LBMA Certified Gold & Silver",
    icon: <ShieldCheck size={18} />,
    image: "/images/gold-bullion-vault.jpg", // REPLACE WITH REAL 4K IMAGE
    href: "/collection/bullion"
  },
  {
    title: "VVS1+ Diamond Assets",
    desc: "GIA Graded, Conflict-Free",
    icon: <Gem size={18} />,
    image: "/images/diamond-macro.jpg", // REPLACE WITH REAL 4K IMAGE
    href: "/collection/diamonds"
  },
  {
    title: "Horological Masterpieces",
    desc: "Patek Philippe, AP, Rolex",
    icon: <Clock size={18} />,
    image: "/images/patek-watch.jpg", // REPLACE WITH REAL 4K IMAGE
    href: "/collection/watches"
  }
]

export default function VaultExplorer() {
  return (
    <section id="vault-explorer" className="py-20 md:py-32 px-6 md:px-12 bg-ivory-100 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* HEADER: Institutional Authority */}
        <header className="mb-24 space-y-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
             <Fingerprint className="text-gold" size={20} />
             <h3 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black italic">
               Sovereign Inventory
             </h3>
          </div>
          <h2 className="text-6xl md:text-8xl font-light text-obsidian-900 tracking-tighter italic leading-[0.8]">
            Asset <span className="text-obsidian-400">Classes.</span>
          </h2>
          <p className="text-obsidian-600 text-lg font-medium italic max-w-2xl mx-auto md:mx-0 border-l-2 border-gold/30 pl-8 text-left">
            Explore our curated selection of high-value physical assets, available for immediate cryptographic settlement and armored delivery.
          </p>
        </header>

        {/* GRID: The Gallery View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((cat, i) => (
            <CategoryCard key={i} {...cat} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ title, desc, image, href, delay, icon }: any) {
  return (
    <Link href={href}>
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay, ease: [0.19, 1, 0.22, 1] }}
        className="group relative h-[700px] overflow-hidden rounded-[3rem] md:rounded-[4rem] border border-ivory-300 bg-white shadow-xl hover:shadow-2xl hover:border-gold/30 transition-all duration-1000"
      >
        {/* IMAGE LAYER: The Optical Glass Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[2s] group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
          style={{ backgroundImage: `url(${image})` }}
        />
        
        {/* ATMOSPHERE: Pearl & Gold Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-1000" />

        {/* CONTENT LAYER: Editorial Typography */}
        <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end">
          <div className="space-y-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-1000 ease-[0.19,1,0.22,1]">
            
            {/* Icon & Title */}
            <div className="space-y-4 relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-gold shadow-sm mb-6">
                {icon}
              </div>
              <h4 className="text-4xl md:text-5xl font-light text-white italic tracking-tighter drop-shadow-lg leading-[0.9]">
                {title}
              </h4>
              <div className="h-[1px] w-12 bg-gold/50" />
              <p className="text-[11px] text-ivory-200 uppercase tracking-[0.3em] font-black group-hover:text-gold transition-colors">
                {desc}
              </p>
            </div>
            
            {/* ACTION: The "Rich Old Man" Persistent Button */}
            <div className="pt-10 border-t border-white/10 flex items-center justify-between">
              <span className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white group-hover:text-gold transition-colors">
                Enter Vault <ArrowRight size={16} className="text-gold group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}