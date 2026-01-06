'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, ShieldCheck, UserCheck, Sparkles, 
  ArrowRight, Globe, Gem, Clock, Loader2, User, Phone 
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ConciergeHub() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. IDENTITY INGRESS: Fetch verified member details
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-gold animate-spin" size={40} />
      <p className="text-[10px] text-obsidian-400 uppercase tracking-[0.5em] font-black italic">Syncing with Concierge Desk...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 pt-40 pb-20 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-[1600px] mx-auto">
        
        {/* OPULENT HEADER */}
        <header className="max-w-4xl space-y-8 mb-24">
          <div className="flex items-center gap-4">
             <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_gold] animate-pulse" />
             <h3 className="text-[11px] uppercase tracking-[0.6em] text-gold font-black italic">Sovereign Commission</h3>
          </div>
          <h1 className="text-7xl md:text-[9rem] font-light text-obsidian-900 italic tracking-tighter leading-[0.8]">
            The Bespoke <br/> <span className="text-obsidian-400">Service Hub.</span>
          </h1>
          <p className="text-obsidian-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl italic border-l border-gold pl-10">
            Beyond the public vault lies a world of off-market acquisitions. 
            Our global network of diamond cutters and horological masters is now at your disposal.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* COMMISSION FORM (7 Columns) */}
          <div className="lg:col-span-7 space-y-12 bg-white p-10 md:p-16 rounded-[4rem] border border-ivory-300 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gold/20" />
            
            <form className="space-y-12">
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold italic border-b border-ivory-100 pb-4">Verified Identity</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ProfileField label="Full Name" value={profile?.full_name} icon={<User size={14}/>} />
                    <ProfileField label="Secure Channel" value={profile?.phone} icon={<Phone size={14}/>} />
                 </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold italic border-b border-ivory-100 pb-4">Asset Specification</h4>
                <div className="space-y-4 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-400 ml-4 italic group-focus-within:text-gold transition-colors">The Request</label>
                  <textarea 
                    rows={6}
                    placeholder="Describe the asset in absolute detail. (e.g., 10ct Fancy Intense Pink Diamond, Patek Philippe 5270P Perpetual Calendar...)"
                    className="w-full bg-ivory-50 border border-ivory-200 rounded-[2rem] px-8 py-6 text-obsidian-900 placeholder:text-obsidian-200 focus:outline-none focus:border-gold/50 focus:bg-white transition-all font-medium italic text-lg shadow-inner"
                  />
                </div>
              </div>

              <button className="group w-full bg-obsidian-900 text-gold py-8 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl active:scale-95">
                Initiate Private Inquiry <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </form>
          </div>

          {/* VALUE PROPOSITIONS (5 Columns) */}
          <div className="lg:col-span-5 space-y-16 py-12 lg:pl-10">
            <Feature icon={<Globe size={28}/>} title="Global Sourcing" desc="Direct access to off-market inventory and private estates in Basel, Antwerp, and Dubai." />
            <Feature icon={<Gem size={28}/>} title="Verified Provenance" desc="Every bespoke acquisition is GIA certified, independently appraised, and physically verified." />
            <Feature icon={<ShieldCheck size={28}/>} title="Sovereign Escort" desc="Dedicated concierge management from the initial cut to armored hand-delivery protocol." />
            
            <div className="p-8 bg-gold/5 border border-gold/10 rounded-3xl space-y-4">
               <div className="flex items-center gap-3 text-gold">
                  <Sparkles size={18} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Signature Advantage</p>
               </div>
               <p className="text-[11px] text-gold/70 leading-relaxed font-medium uppercase tracking-tighter italic">
                 Bespoke requests are handled by our tier-1 sourcing team. Response time is typically within 4-6 hours for major markets.
               </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex gap-8 group">
      <div className="text-gold group-hover:scale-110 transition-transform duration-700 bg-white p-4 rounded-2xl shadow-sm border border-ivory-300">
        {icon}
      </div>
      <div className="space-y-3">
        <h4 className="text-lg font-light text-obsidian-900 uppercase tracking-tighter italic">{title}</h4>
        <p className="text-xs text-obsidian-400 leading-relaxed font-bold uppercase tracking-widest italic opacity-80">{desc}</p>
      </div>
    </div>
  )
}

function ProfileField({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-obsidian-400 px-2">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{label}</span>
      </div>
      <div className="w-full bg-ivory-50 border border-ivory-200 rounded-2xl px-6 py-4 shadow-inner">
         <p className="text-obsidian-900 font-bold uppercase tracking-widest text-sm italic">
           {value || 'Verification Required'}
         </p>
      </div>
    </div>
  )
}