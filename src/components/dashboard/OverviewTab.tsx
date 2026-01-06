'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Globe, ArrowRight, Gem, Fingerprint } from 'lucide-react'

// I. REGISTRY BLUEPRINT: Define exactly what a profile looks like
interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  shipping_address?: string
}

interface OverviewTabProps {
  profile: Profile | null // Resolves TS2322: 'profile' prop mismatch
}

export default function OverviewTab({ profile }: OverviewTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* WELCOME SIGNATURE */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border border-ivory-300 rounded-2xl w-fit shadow-sm">
         <Fingerprint className="text-gold" size={14} />
         <p className="text-[10px] font-black text-obsidian-900 uppercase tracking-[0.4em] italic">
           Sovereign Identified: <span className="text-gold">{profile?.full_name || 'Verification Pending'}</span>
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* II. ASSET VALUATION: The Portfolio Anchor */}
        <div className="lg:col-span-2 p-12 bg-white border border-ivory-300 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
          {/* Atmospheric Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000" />
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-gold" size={14} />
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.5em] italic leading-none">Total Portfolio Valuation</p>
              </div>
              <h2 className="text-7xl md:text-8xl font-light text-obsidian-900 tracking-tighter italic leading-[0.8]">
                $1,240,500<span className="text-3xl text-obsidian-300">.00</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-12 border-t border-ivory-100">
               <StatMini label="Vaulted Gold" value="12.5kg" />
               <StatMini label="Diamond Mass" value="4.2ct" />
               <div className="hidden md:block">
                  <StatMini label="Active Transits" value="02" />
               </div>
            </div>
          </div>
        </div>

        {/* III. LOGISTICS STATUS: Real-Time Ingress */}
        <div className="p-10 bg-obsidian-900 rounded-[3.5rem] text-gold space-y-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gold/[0.02] pointer-events-none" />
           
           <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 opacity-60">
                 <Globe size={16} className="animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Live Transit Node</span>
              </div>
              <h3 className="text-3xl font-light italic tracking-tight leading-tight">
                Armored Escort <span className="text-white">LV-9904</span> currently in transit via <span className="text-white">Zurich Hub.</span>
              </h3>
           </div>

           <button className="relative z-10 flex items-center justify-between w-full p-6 bg-white/5 border border-white/10 rounded-[1.5rem] group hover:bg-gold hover:text-white transition-all duration-700">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">View Manifest</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
           </button>
        </div>

      </div>

      {/* IV. SYSTEM ALERT: Protocol Status */}
      <div className="p-8 bg-ivory-50 border border-ivory-300 rounded-[2rem] flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-6">
           <Zap size={16} className="text-gold" />
           <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.3em]">
             LUME Protocol v4.0.2 Operating at <span className="text-obsidian-900 underline decoration-gold/30">Maximum Security Threshold</span>
           </p>
        </div>
        <div className="hidden md:block text-[9px] font-mono text-obsidian-300 italic">NODE_SIG: 0x82...A41</div>
      </div>
    </div>
  )
}

function StatMini({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.3em] italic leading-none">{label}</p>
      <p className="text-3xl font-light text-obsidian-900 italic tracking-tighter leading-none">{value}</p>
    </div>
  )
}