'use client'

import React from 'react'
import { ArrowRight, ChevronLeft, MapPin, Shield, Globe, Navigation, Home, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Comprehensive Country List for Global Reach (Standardized)
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
  // AUDIT: Validation ensures all logistics-critical fields are populated
  const isFormValid = data.address && data.city && data.country && data.zipCode;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 md:space-y-10"
    >
      {/* HEADER & NAVIGATION */}
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gold uppercase tracking-widest transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Identity
        </button>
        
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold text-obsidian-900 font-serif italic tracking-tight">
            Delivery <span className="text-gold not-italic">Logistics</span>
          </h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-lg leading-relaxed">
            Please specify your preferred handover location. Every Lume Vault acquisition is fully insured and managed by our private concierge network.
          </p>
        </div>
      </div>

      {/* SHIPPING FORM: Mobile-Optimized Grid */}
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="md:col-span-2">
            <InputGroup 
              label="Secure Street Address" 
              value={data.address}
              onChange={(v: string) => update({...data, address: v})}
              placeholder="e.g. 15th Avenue, Private Residence" 
              icon={<Home size={14} />} 
            />
          </div>
          <InputGroup 
            label="City" 
            value={data.city}
            onChange={(v: string) => update({...data, city: v})}
            placeholder="e.g. Geneva" 
            icon={<MapPin size={14} />} 
          />
          <InputGroup 
            label="Postal / Zip Code" 
            value={data.zipCode}
            onChange={(v: string) => update({...data, zipCode: v})}
            placeholder="e.g. 10001" 
            icon={<Navigation size={14} />} 
          />
          
          <div className="space-y-3 md:col-span-2 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-gold transition-colors">
              <Globe size={14} className="text-gold" /> Destination Country
            </label>
            <div className="relative">
              <select 
                value={data.country}
                onChange={(e) => update({...data, country: e.target.value})}
                /* text-[16px] is the magic fix for iOS auto-zoom on mobile */
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[16px] md:text-xs font-bold text-obsidian-900 uppercase tracking-[0.1em] focus:border-gold focus:bg-white outline-none shadow-sm appearance-none cursor-pointer transition-all"
              >
                <option value="">Select Country...</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST NOTICE */}
      <div className="bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
        <Shield className="text-gold shrink-0 mt-1" size={20} />
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-obsidian-900 uppercase tracking-widest">Insured Custody</h4>
          <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed uppercase tracking-tight">
            Your collection remains under Lume Vault insurance until the physical handover is signed by you. We provide end-to-end security for all international acquisitions.
          </p>
        </div>
      </div>

      {/* ACTION */}
      <div className="pt-4">
        <button 
          onClick={isFormValid ? onNext : undefined}
          disabled={!isFormValid}
          className="w-full bg-black text-white h-[75px] rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-black transition-all shadow-xl disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed active:scale-[0.98] group"
        >
          Secure Payment Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

function InputGroup({ label, placeholder, icon, value, onChange }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-gold transition-colors">
        <span className="text-gold">{icon}</span> {label}
      </label>
      <input 
        type="text" 
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        /* mobile text-[16px] prevents layout shifting on iPhones */
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[16px] md:text-xs font-bold text-obsidian-900 placeholder:text-gray-300 focus:outline-none focus:border-gold focus:bg-white transition-all shadow-sm uppercase tracking-widest"
      />
    </div>
  )
}