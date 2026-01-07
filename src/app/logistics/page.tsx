'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Truck, ShieldCheck, Plane, Globe, ShieldAlert, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const logisticsTiers = [
  {
    icon: <Truck size={24} />,
    title: "Tier I: Armored Ground",
    desc: "Regional transit conducted via B6-level armored vehicles. Assets are monitored via private frequency nodes and dual-driver protocols.",
    specs: ["B6 Protection", "Dual-Driver Security", "Private Satellite Link"]
  },
  {
    icon: <Plane size={24} />,
    title: "Tier II: Sovereign Air",
    desc: "International movements utilize private aviation or secured manifests with dedicated onboard couriers for absolute physical oversight.",
    specs: ["Private Aviation", "Fast-Track Customs", "Onboard Courier"]
  },
  {
    icon: <Globe size={24} />,
    title: "Tier III: White-Glove",
    desc: "The final handover is conducted by our elite escort team. Acquisitions are hand-delivered with multi-factor biometric verification.",
    specs: ["Biometric Verification", "Hand-to-Hand Delivery", "Total Discretion"]
  }
]

export default function LogisticsManifesto() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-24 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto space-y-32">
        
        {/* I. HERO HEADER */}
        <header className="max-w-5xl space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
             <p className="label-caps text-gold">Operational Excellence</p>
          </div>
          <h1 className="text-6xl md:text-9xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Physical <span className="text-obsidian-400 not-italic">Movement.</span> <br/>
            Private <span className="text-gold not-italic">Transit.</span>
          </h1>
          <div className="max-w-2xl border-l-2 border-gold pl-8 md:pl-12">
            <p className="text-xl md:text-2xl text-obsidian-600 font-medium leading-relaxed italic">
              Lume Vault manages the entire physical lifecycle of your acquisition. We do not utilize standard postal services; we operate a proprietary global chain of custody.
            </p>
          </div>
        </header>

        {/* II. LOGISTICS TIERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {logisticsTiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group p-10 bg-white border border-ivory-300 rounded-2xl hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-ivory-50 border border-ivory-200 rounded-xl flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-inner">
                {tier.icon}
              </div>
              
              <h4 className="text-2xl font-medium text-obsidian-900 font-serif italic mb-4 uppercase tracking-tight">{tier.title}</h4>
              <p className="text-sm text-obsidian-500 leading-relaxed mb-10 font-medium">
                {tier.desc}
              </p>
              
              <ul className="space-y-4 pt-8 border-t border-ivory-100">
                {tier.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-obsidian-400">
                    <ShieldCheck size={14} className="text-gold opacity-50" /> {spec}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* III. INSURANCE & PRIVACY FOOTER */}
        <section className="bg-obsidian-900 rounded-2xl p-10 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <ShieldAlert className="text-gold" size={24} />
                 <h4 className="label-caps text-white">Privacy Assurance</h4>
              </div>
              <p className="text-lg text-ivory-300 leading-relaxed font-medium italic max-w-md">
                Client coordinates are never stored on permanent registries. Data is handled via encrypted channels and expunged 24 hours after physical handover.
              </p>
              <Link href="/collection" className="inline-flex items-center gap-2 text-gold font-bold uppercase text-[10px] tracking-widest hover:underline">
                View Collection <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="lg:text-right space-y-4">
               <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-gold mb-4">
                  <Award size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Master Policy</span>
               </div>
               <h3 className="text-4xl md:text-6xl font-medium font-serif italic tracking-tight">
                $100M Underwritten <br/>
                <span className="text-gold not-italic">by Lloyd&apos;s.</span>
               </h3>
               <p className="text-xs text-ivory-400 font-bold uppercase tracking-widest">Global Cash & Assets Coverage</p>
            </div>
          </div>
        </section>
        
      </div>
    </main>
  )
}