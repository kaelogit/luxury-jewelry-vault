'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, MapPin, ShieldCheck, 
  Globe, Truck, Warehouse, ArrowRight,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function ShippingStep({ onNext, onBack }: Props) {
  const [address, setAddress] = useState('')
  const [tier, setTier] = useState('armored')
  const [loading, setLoading] = useState(true)

  // 1. COORDINATE SYNC: Pulling stored address from the Sovereign Profile
  useEffect(() => {
    const fetchLogistics = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('shipping_address')
          .eq('id', user.id)
          .single()
        if (data?.shipping_address) setAddress(data.shipping_address)
      }
      setLoading(false)
    }
    fetchLogistics()
  }, [])

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={24} />
      <p className="text-[10px] text-obsidian-300 font-black uppercase tracking-[0.4em]">Calibrating Global Hubs...</p>
    </div>
  )

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* NAVIGATION */}
      <button 
        onClick={onBack} 
        className="group flex items-center gap-3 text-[10px] font-black text-obsidian-300 uppercase tracking-widest hover:text-gold transition-all"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Identity
      </button>

      {/* HEADER: The Ingress Declaration */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="text-gold" size={16} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic">Logistics Protocol</h3>
        </div>
        <h2 className="text-4xl font-light text-obsidian-900 italic tracking-tighter">
          Specify <span className="text-obsidian-400">Destination.</span>
        </h2>
        <p className="text-[11px] text-obsidian-400 uppercase tracking-[0.2em] font-medium leading-relaxed max-w-sm">
          Define the endpoint for your armored escort or select secure climate-controlled deep storage.
        </p>
      </header>

      {/* THE INPUT: Global Coordinates */}
      <div className="space-y-4">
        <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic pl-2">Armored Delivery Coordinates</p>
        <div className="relative group">
          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gold group-focus-within:scale-110 transition-transform" size={18} />
          <textarea 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white border border-ivory-300 rounded-[2rem] p-6 pl-16 text-sm text-obsidian-900 outline-none focus:border-gold/50 transition-all min-h-[120px] shadow-inner placeholder:text-ivory-300" 
            placeholder="ENTER FULL LEGAL ADDRESS OR SECURE HUB COORDINATES..." 
          />
        </div>
      </div>

      {/* LOGISTICS TIERS: Choosing the Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TierCard 
          active={tier === 'armored'} 
          onClick={() => setTier('armored')}
          icon={<Truck size={20} />}
          title="Armored Escort"
          desc="Insured private transit to your coordinates."
        />
        <TierCard 
          active={tier === 'vault'} 
          onClick={() => setTier('vault')}
          icon={<Warehouse size={20} />}
          title="Vault Storage"
          desc="Retain asset in Lume Deep-Storage (Zurich)."
        />
      </div>

      {/* SETTLEMENT INGRESS ACTION */}
      <button 
        onClick={onNext} 
        className="group w-full py-8 bg-obsidian-900 text-gold rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
      >
        Continue to Settlement <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
      </button>

    </div>
  )
}

function TierCard({ active, onClick, icon, title, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={`
        p-8 rounded-[2.5rem] border text-left transition-all duration-500 flex flex-col gap-4 group
        ${active ? 'bg-white border-gold shadow-2xl' : 'bg-ivory-50 border-ivory-200 opacity-60 hover:opacity-100 hover:bg-white'}
      `}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-gold text-white' : 'bg-white border border-ivory-300 text-obsidian-300'}`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className={`text-xs font-black uppercase tracking-widest ${active ? 'text-obsidian-900' : 'text-obsidian-300'}`}>{title}</h4>
        <p className="text-[10px] text-obsidian-400 italic leading-tight">{desc}</p>
      </div>
    </button>
  )
}