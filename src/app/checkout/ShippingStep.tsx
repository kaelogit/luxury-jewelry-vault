'use client'

import React from 'react'
import { ArrowRight, ChevronLeft, MapPin, Shield, Globe, Navigation, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ShippingStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 selection:bg-gold selection:text-white"
    >
      {/* Header & Navigation */}
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[10px] font-black text-gold hover:text-obsidian-900 uppercase tracking-[0.3em] transition-all duration-300 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Identity
        </button>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_gold]" />
             <h2 className="text-4xl font-light text-obsidian-900 italic tracking-tighter uppercase">
               Logistics <span className="text-gold font-bold">Coordination.</span>
             </h2>
          </div>
          <p className="text-obsidian-400 text-sm font-light max-w-lg italic leading-relaxed border-l border-ivory-300 pl-8">
            Provide the secure coordinates for sovereign delivery. All transit is fully insured, 
            end-to-end encrypted, and escorted via private courier protocols.
          </p>
        </div>
      </div>

      {/* Manifest Form Grid */}
      <div className="space-y-8 bg-white border border-ivory-300 p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold/20" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="md:col-span-2">
            <InputGroup label="Primary Delivery Address" placeholder="STREET, SUITE, UNIT" icon={<MapPin size={14} />} />
          </div>
          <InputGroup label="City / Region" placeholder="e.g. ZURICH" icon={<Globe size={14} />} />
          <InputGroup label="Postal Code" placeholder="8001" icon={<Navigation size={14} />} />
          <InputGroup label="Country of Reception" placeholder="SWITZERLAND" icon={<Globe size={14} />} />
          <InputGroup label="Special Security Instructions" placeholder="PRIVATE STRIP, GATE CODE, ESCORT REQ." icon={<Shield size={14} />} />
        </div>
      </div>

      {/* Security Assurance Protocol */}
      <div className="bg-ivory-50 p-8 rounded-[2rem] border border-ivory-300 flex gap-6 items-start shadow-inner">
        <div className="p-3 bg-white rounded-full border border-gold/20 shadow-sm">
          <Shield className="text-gold" size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-obsidian-900 uppercase tracking-widest italic">Transit Integrity</h4>
          <p className="text-[11px] text-obsidian-400 font-medium leading-relaxed uppercase tracking-tighter italic">
            Final logistics arrangements are verified post-settlement via an encrypted concierge handshake. 
            Your coordinates are never stored on permanent public ledgers.
          </p>
        </div>
      </div>

      {/* Final Action */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="group bg-obsidian-900 text-gold px-14 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
        >
          Proceed to Settlement <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
        </button>
      </div>
    </motion.div>
  )
}

function InputGroup({ label, placeholder, icon }: { label: string, placeholder: string, icon: any }) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center gap-3 text-obsidian-400 group-focus-within:text-gold transition-colors duration-500">
        {icon}
        <label className="text-[10px] font-black uppercase tracking-[0.3em] italic">{label}</label>
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-ivory-50 border border-ivory-200 rounded-2xl px-6 py-5 text-obsidian-900 placeholder:text-obsidian-200 focus:outline-none focus:border-gold/50 focus:bg-white transition-all font-bold tracking-widest text-xs uppercase shadow-inner"
      />
    </div>
  )
}