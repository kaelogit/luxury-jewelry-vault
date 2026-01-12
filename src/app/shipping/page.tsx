'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Truck, ShieldCheck, Globe, 
  Clock, ArrowRight, Anchor, 
  MapPin, CheckCircle2 
} from 'lucide-react'

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-24 px-6 selection:bg-gold selection:text-white">
      <div className="max-w-6xl mx-auto space-y-20">
        
        <header className="max-w-3xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold flex items-center gap-3"
          >
            <ShieldCheck size={16} strokeWidth={1.5} /> Global Logistics
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-[0.9]"
          >
            Seamless <span className="text-gold not-italic">Delivery.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-obsidian-500 font-medium leading-relaxed max-w-xl"
          >
            We manage every detail of the journey, ensuring your acquisitions arrive with absolute security and discretion.
          </motion.p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PromiseCard 
            icon={<Globe size={24} />}
            title="Global Reach"
            desc="White-glove delivery to over 140 countries, including secure customs clearance management."
          />
          <PromiseCard 
            icon={<ShieldCheck size={24} />}
            title="Fully Insured"
            desc="Every shipment is protected by comprehensive transit insurance until it is in your hands."
          />
          <PromiseCard 
            icon={<Clock size={24} />}
            title="Expedited"
            desc="Priority handling ensures most international orders arrive within 3 to 5 business days."
          />
        </section>

        <section className="bg-white border border-ivory-300 rounded-3xl p-10 md:p-16 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-obsidian-900 uppercase tracking-tighter">The Handover <br/><span className="text-gold font-serif italic lowercase">protocol</span></h2>
              <div className="space-y-6">
                <ProcessStep number="01" title="Vault Inspection" desc="Our master jewelers perform a final quality check before the piece leaves the facility." />
                <ProcessStep number="02" title="Secure Packaging" desc="The item is placed in temperature-controlled, tamper-evident bespoke packaging." />
                <ProcessStep number="03" title="Private Courier" desc="Transferred to our network of specialized security couriers for direct transit." />
              </div>
            </div>
            <div className="bg-ivory-50 rounded-2xl p-8 space-y-6 border border-ivory-200">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gold border-b border-ivory-200 pb-4">Real-Time Awareness</h4>
              <p className="text-sm text-obsidian-600 leading-relaxed font-medium">
                Upon dispatch, you will receive a unique tracking reference. This provides end-to-end visibility through our private logistics terminal.
              </p>
              <Link href="/track" className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all">
                Access Tracking <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <footer className="pt-20 border-t border-ivory-300">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Direct Assistance</p>
              <p className="text-sm font-medium text-obsidian-500 max-w-xs">Our logistics consultants are available for personalized shipping inquiries.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              <div className="flex flex-col gap-4">
                <FooterLink href="/shipping" label="Shipping Details" />
                <FooterLink href="/returns" label="Returns Policy" />
              </div>
              <div className="flex flex-col gap-4">
                <FooterLink href="/track" label="Track Order" />
                <FooterLink href="/faq" label="Common Questions" />
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  )
}

/** * HELPER COMPONENTS
 */

// AUDIT FIX: Resolves TS2304 "Cannot find name FooterLink"
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="text-[10px] font-bold uppercase tracking-widest text-obsidian-400 hover:text-gold transition-colors"
    >
      {label}
    </Link>
  )
}

function PromiseCard({ icon, title, desc }: any) {
  return (
    <div className="p-10 bg-white border border-ivory-300 rounded-3xl space-y-6 hover:shadow-lg transition-all duration-500">
      <div className="text-gold">{icon}</div>
      <div className="space-y-2">
        <h4 className="text-lg font-bold text-obsidian-900 uppercase tracking-tighter">{title}</h4>
        <p className="text-sm text-obsidian-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  )
}

function ProcessStep({ number, title, desc }: any) {
  return (
    <div className="flex gap-6 items-start">
      <span className="text-xs font-serif italic text-gold">{number}</span>
      <div className="space-y-1">
        <h5 className="text-[11px] font-bold text-obsidian-900 uppercase tracking-widest">{title}</h5>
        <p className="text-xs text-obsidian-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  )
}