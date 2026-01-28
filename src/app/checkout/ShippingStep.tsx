'use client'

import React from 'react'
import { ArrowRight, ChevronLeft, MapPin, Shield, Globe, Navigation, Home, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Comprehensive Country List
const countries = [
  "United States", "United Kingdom", "Switzerland", "United Arab Emirates", 
  "Canada", "Australia", "France", "Germany", "Hong Kong", "Singapore", 
  "Japan", "Monaco", "Saudi Arabia", "Qatar", "Kuwait", "Italy", "Spain", 
  "Netherlands", "Sweden", "Norway", "Denmark", "Austria", "Belgium", "Ireland"
].sort();

interface ShippingProps {
  data: any;
  update: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingStep({ data, update, onNext, onBack }: ShippingProps) {
  const isFormValid = data.address && data.city && data.country && data.zipCode;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10 md:space-y-12"
    >
      {/* HEADER */}
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gold uppercase tracking-widest transition-colors group"
        >
          <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Identity
        </button>
        
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold text-obsidian-900 font-serif italic tracking-tight">
            Shipping <span className="text-gold not-italic">Address</span>
          </h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-lg leading-relaxed">
            Specify where you would like your items delivered. All shipments are fully insured and tracked.
          </p>
        </div>
      </div>

      {/* SHIPPING FORM */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="md:col-span-2">
            <InputGroup 
              label="Street Address" 
              value={data.address}
              onChange={(v: string) => update({...data, address: v})}
              placeholder="e.g. 123 Main St, Apt 4B" 
              icon={<Home size={14} />} 
            />
          </div>
          <InputGroup 
            label="City" 
            value={data.city}
            onChange={(v: string) => update({...data, city: v})}
            placeholder="e.g. New York" 
            icon={<MapPin size={14} />} 
          />
          <InputGroup 
            label="Postal Code" 
            value={data.zipCode}
            onChange={(v: string) => update({...data, zipCode: v})}
            placeholder="e.g. 10001" 
            icon={<Navigation size={14} />} 
          />
          
          <div className="space-y-3 md:col-span-2 group">
            <label className="text-[9px] font-bold uppercase tracking-boutique text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-gold transition-colors">
              <Globe size={14} className="text-gold/60 group-focus-within:text-gold transition-colors" /> Destination Country
            </label>
            <div className="relative">
              <select 
                value={data.country}
                onChange={(e) => update({...data, country: e.target.value})}
                /* LUXURY INPUT STYLE: Bottom border only */
                className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-[16px] md:text-sm font-medium text-obsidian-900 focus:border-gold focus:bg-white outline-none shadow-sm appearance-none cursor-pointer transition-all h-[56px]"
              >
                <option value="">Select Country...</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* TRUST NOTICE */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
        <Shield className="text-gold shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-obsidian-900 uppercase tracking-widest">Fully Insured</h4>
          <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tight">
            Your collection is fully insured from our vault until it is safely delivered to your hands.
          </p>
        </div>
      </div>

      {/* ACTION */}
      <div className="pt-4">
        <button 
          onClick={isFormValid ? onNext : undefined}
          disabled={!isFormValid}
          className="w-full bg-black text-white h-[70px] rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-black transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed group active:scale-[0.99]"
        >
          Continue to Payment <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

function InputGroup({ label, placeholder, icon, value, onChange }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[9px] font-bold uppercase tracking-boutique text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-gold transition-colors">
        {React.cloneElement(icon, { className: "text-gold/60 group-focus-within:text-gold transition-colors", strokeWidth: 1.5 })} {label}
      </label>
      <input 
        type="text" 
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        /* LUXURY INPUT STYLE: Bottom border only */
        className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-[16px] md:text-sm font-medium text-obsidian-900 focus:border-gold focus:bg-white outline-none placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-400 transition-all h-[56px]"
      />
    </div>
  )
}