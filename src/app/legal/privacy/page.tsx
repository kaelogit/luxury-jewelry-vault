'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { EyeOff, ShieldAlert, Fingerprint, Lock, ShieldCheck, Zap, Globe, Database } from 'lucide-react'

const privacyProtocols = [
  {
    icon: <Lock size={24} />,
    title: "Sovereign Data Custody",
    desc: "We do not store your physical coordinates or identity on centralized, public-facing ledgers. Your data is treated as a high-value asset, protected via hardware-level encryption."
  },
  {
    icon: <Fingerprint size={24} />,
    title: "Secure Advisory Channels",
    desc: "All concierge interactions are conducted via end-to-end encrypted channels. High-value settlement negotiations utilize PGP-signing to ensure absolute identity integrity."
  },
  {
    icon: <Database size={24} />,
    title: "Private Settlement",
    desc: "By utilizing BTC, ETH, or Bank Wires, we minimize the metadata footprint associated with legacy retail surveillance, ensuring your acquisition remains your business."
  },
  {
    icon: <EyeOff size={24} />,
    title: "Ephemeral Policy",
    desc: "Sensitive transaction metadata is expunged from our routing nodes exactly 24 hours after a 'Delivered' status is confirmed by our logistics team."
  }
]

export default function PrivacyProtocol() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-24 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto space-y-32">
        
        {/* I. HEADER: THE OATH OF DISCRETION */}
        <header className="max-w-4xl space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_gold]" />
             <p className="label-caps text-gold">Privacy Manifesto</p>
          </div>
          <h1 className="text-6xl md:text-9xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Privacy is <br/>
            <span className="text-gold not-italic">Absolute.</span>
          </h1>
          <div className="max-w-2xl border-l-2 border-gold pl-8 md:pl-12">
            <p className="text-xl md:text-2xl text-obsidian-600 font-medium leading-relaxed italic">
              Lume Vault is architected on the principle of sovereign anonymity. We treat your digital presence with the same rigor as the 24K gold secured in our vaults.
            </p>
          </div>
        </header>

        {/* II. THE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {privacyProtocols.map((protocol, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-10 md:p-14 bg-white border border-ivory-300 rounded-2xl hover:shadow-xl transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-ivory-50 border border-ivory-200 rounded-xl flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-inner">
                {protocol.icon}
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-medium text-obsidian-900 font-serif italic tracking-tight">{protocol.title}</h4>
                <p className="text-sm text-obsidian-500 leading-relaxed font-medium uppercase tracking-widest opacity-80">
                  {protocol.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* III. INSTITUTIONAL INTEGRITY SECTION */}
        <section className="bg-obsidian-900 rounded-2xl p-10 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold blur-[120px]" />
          </div>
          
          <div className="relative z-10 space-y-16">
            <div className="flex items-center gap-6 border-b border-white/10 pb-10">
              <ShieldCheck size={28} className="text-gold" />
              <h4 className="label-caps text-white">Institutional Sovereignty Registry</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <PolicyDetail 
                title="Jurisdictional Node"
                desc="Our data clusters operate in privacy-sovereign jurisdictions. We do not comply with informal data requests from extra-judicial third parties."
              />
              <PolicyDetail 
                title="Zero-Surveillance"
                desc="Lume Vault utilizes no marketing cookies, tracking pixels, or third-party analytics. Your session remains a private handshake between client and vault."
              />
              <PolicyDetail 
                title="Identity Abstraction"
                desc="Acquisitions are held in the Vault Pool until the moment of handover. Your legal identity never appears on a public transit manifest."
              />
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

function PolicyDetail({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <Zap size={14} className="text-gold" />
         <span className="text-[10px] font-bold text-white uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-sm text-ivory-400 leading-relaxed font-medium italic">
        {desc}
      </p>
    </div>
  )
}