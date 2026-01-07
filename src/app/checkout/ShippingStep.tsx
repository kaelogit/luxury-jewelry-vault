'use client'

import React from 'react'
import { ArrowRight, ChevronLeft, MapPin, Shield, Globe, Navigation, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ShippingStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      {/* HEADER & NAVIGATION */}
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[10px] font-bold text-obsidian-400 hover:text-gold uppercase tracking-widest transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Bag
        </button>
        
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight">
            Shipping <span className="text-gold not-italic">Details</span>
          </h2>
          <p className="text-obsidian-600 text-sm max-w-lg leading-relaxed">
            Please provide your preferred delivery address. All Lume Vault shipments are fully insured and require a signature upon arrival.
          </p>
        </div>
      </div>

      {/* SHIPPING FORM */}
      <div className="space-y-8 bg-white rounded-xl relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputGroup label="Street Address" placeholder="123 Luxury Lane, Suite 100" icon={<Home size={14} />} />
          </div>
          <InputGroup label="City" placeholder="New York" icon={<MapPin size={14} />} />
          <InputGroup label="State / Province" placeholder="NY" icon={<MapPin size={14} />} />
          <InputGroup label="Postal Code" placeholder="10001" icon={<Navigation size={14} />} />
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 ml-1 flex items-center gap-2">
              <Globe size={14} className="text-gold" /> Country
            </label>
            <select className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-sm text-obsidian-900 focus:border-gold outline-none shadow-sm h-[52px]">
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Switzerland</option>
              <option>United Arab Emirates</option>
            </select>
          </div>
        </div>
      </div>

      {/* TRUST NOTICE */}
      <div className="bg-ivory-50 p-6 rounded-xl border border-ivory-200 flex gap-4 items-start">
        <Shield className="text-gold shrink-0" size={18} />
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-obsidian-900 uppercase tracking-widest">Insured Delivery</h4>
          <p className="text-[11px] text-obsidian-500 leading-relaxed">
            Your collection is covered by a comprehensive transit insurance policy until the moment it is signed for. We utilize specialized couriers for all high-value deliveries.
          </p>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="w-full md:w-auto bg-obsidian-900 text-white px-12 py-5 rounded-lg text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-300 shadow-lg"
        >
          Continue to Payment <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}

function InputGroup({ label, placeholder, icon }: { label: string, placeholder: string, icon: any }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 ml-1 flex items-center gap-2 transition-colors group-focus-within:text-gold">
        {React.cloneElement(icon, { size: 14, className: "text-gold" })} {label}
      </label>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-obsidian-900 placeholder:text-obsidian-300 focus:outline-none focus:border-gold transition-all text-sm h-[52px]"
      />
    </div>
  )
}