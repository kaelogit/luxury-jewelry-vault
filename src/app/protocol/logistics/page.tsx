'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Truck, ShieldCheck, Plane, Globe, MapPin, Lock, Zap, ShieldAlert, Award } from 'lucide-react'

const logisticsTiers = [
  {
    icon: <Truck size={28} />,
    title: "Tier-1: Armored Ground",
    desc: "Regional transit via discreet, B6-level armored vehicles. All assets are tracked via dual-band satellite telemetry and private frequency nodes.",
    specs: ["B6 Armored Protection", "Dual-Driver Protocol", "Real-time Telemetry"]
  },
  {
    icon: <Plane size={28} />,
    title: "Tier-2: Sovereign Air",
    desc: "International transit utilizes private aviation or secured cargo manifests with dedicated onboard couriers for absolute physical oversight.",
    specs: ["Dedicated Courier", "Customs Fast-Track", "Direct Tarmac Transfer"]
  },
  {
    icon: <Globe size={28} />,
    title: "Tier-3: Global Escort",
    desc: "The final mile is handled by our elite escort team. Your asset is hand-delivered to your precise coordinates with biometric verification.",
    specs: ["Biometric Verification", "Armored Hand-Delivery", "End-to-End Insurance"]
  }
]

export default function LogisticsProtocol() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-40 pb-24 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-[1600px] mx-auto">
        
        {/* 1. OPERATIONAL HEADER: The "Mastery" Statement */}
        <header className="max-w-4xl mb-32 space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-2.5 h-2.5 bg-gold rounded-full animate-pulse shadow-[0_0_15px_gold]" />
             <h3 className="text-[11px] uppercase tracking-[0.6em] text-gold font-black italic">
               Physical Chain of Custody
             </h3>
          </div>
          <h1 className="text-7xl md:text-[9rem] font-light text-obsidian-900 tracking-tighter italic leading-[0.8]">
            Physical <span className="text-obsidian-400">Movement.</span> <br/>
            Sovereign <span className="text-gold underline underline-offset-[1.5rem] decoration-gold/20">Transit.</span>
          </h1>
          <p className="text-obsidian-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl italic border-l-2 border-gold pl-10">
            LUME VAULT manages the entire physical lifecycle of your acquisition. We do not utilize third-party postal services. We operate our own proprietary global chain of custody.
          </p>
        </header>

        {/* 2. INFRASTRUCTURE TIERS: Opulent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-40">
          {logisticsTiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group p-12 bg-white border border-ivory-300 rounded-[4rem] hover:shadow-2xl hover:border-gold/20 transition-all duration-1000 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] pointer-events-none group-hover:bg-gold/10 transition-all" />
              
              <div className="w-20 h-20 bg-ivory-50 border border-ivory-200 rounded-3xl flex items-center justify-center text-gold mb-12 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-inner">
                {tier.icon}
              </div>
              
              <h4 className="text-3xl font-light text-obsidian-900 italic mb-6 tracking-tight uppercase">{tier.title}</h4>
              <p className="text-[15px] text-obsidian-400 leading-relaxed mb-12 font-bold uppercase tracking-widest italic opacity-80">
                {tier.desc}
              </p>
              
              <ul className="space-y-5 pt-10 border-t border-ivory-100">
                {tier.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-obsidian-300 group-hover:text-gold transition-colors duration-500">
                    <ShieldCheck size={16} className="text-gold opacity-40 group-hover:opacity-100" /> {spec}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* 3. SETTLEMENT FOOTER: High-Value Assurance */}
        <section className="bg-white border border-ivory-300 rounded-[5rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gold/20" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <ShieldAlert className="text-gold" size={24} />
                 <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-obsidian-900 italic">Zero-Knowledge Logistics</h4>
              </div>
              <p className="text-obsidian-400 text-lg leading-relaxed font-medium italic max-w-md">
                Your physical coordinates are never stored on a centralized registry. Metadata is handled via ephemeral, PGP-encrypted channels and wiped exactly 24 hours after a confirmed handover.
              </p>
            </div>
            
            <div className="flex flex-col md:items-end gap-6">
               <div className="p-10 bg-ivory-50 border border-ivory-200 rounded-[3rem] shadow-inner text-center md:text-right space-y-3">
                  <div className="flex items-center justify-end gap-3 text-gold mb-2">
                     <Award size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Master Policy</span>
                  </div>
                  <span className="text-[11px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic block">Insurance Coverage</span>
                  <span className="text-3xl md:text-5xl font-light text-obsidian-900 tracking-tighter italic leading-none">
                    $100M LLOYD'S <br/><span className="text-gold">UNDERWRITTEN.</span>
                  </span>
               </div>
            </div>
          </div>
        </section>
        
      </div>
    </main>
  )
}