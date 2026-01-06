'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, ShieldAlert, Fingerprint, Lock, 
  Smartphone, Globe, Zap, AlertTriangle, RefreshCcw
} from 'lucide-react'

export default function SecurityTab() {
  const [panicActive, setPanicActive] = useState(false)

  return (
    <div className="max-w-5xl space-y-12">
      
      {/* I. TRUST GRADE: The Sovereign Status */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white border border-ivory-300 rounded-[3rem] p-10 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px]" />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-gold" size={16} />
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Identity Trust Grade</p>
            </div>
            <h3 className="text-4xl font-light text-obsidian-900 italic tracking-tighter">Level 2: <span className="text-obsidian-400">Verified Sovereign.</span></h3>
            <p className="text-[11px] text-obsidian-400 font-medium uppercase tracking-widest max-w-xs leading-relaxed">
              Your account is cleared for armored transit and cryptographic settlement up to $1M USD.
            </p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-ivory-200" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" className="text-gold" />
             </svg>
             <span className="absolute text-sm font-black text-obsidian-900 uppercase">75%</span>
          </div>
        </div>

        <div className="bg-gold text-white rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl shadow-gold/20">
          <Fingerprint size={32} strokeWidth={1.5} />
          <div className="space-y-2">
            <h4 className="text-lg font-black uppercase tracking-tighter italic">2FA Active</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Biometric Handshake Required for all Acquisitions</p>
          </div>
        </div>
      </section>

      {/* II. ACTIVE SESSIONS: Digital Chain of Custody */}
      <section className="bg-white border border-ivory-300 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
        <div className="flex items-center justify-between mb-12">
           <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-obsidian-900 italic">Access Registry</h4>
              <p className="text-[9px] text-obsidian-300 uppercase tracking-widest font-bold">Real-time monitoring of vault ingress</p>
           </div>
           <button className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-widest border-b border-gold/20 pb-1 hover:text-obsidian-900 transition-colors">
             Revoke All Sessions <RefreshCcw size={12} />
           </button>
        </div>

        <div className="space-y-6">
          <SessionRow device="MacBook Pro 16 - Safari" location="Zurich, CH" ip="185.122.XX.XX" current />
          <SessionRow device="iPhone 15 Pro - App" location="Lagos, NG" ip="102.89.XX.XX" />
          <SessionRow device="Windows Workstation" location="London, UK" ip="82.24.XX.XX" />
        </div>
      </section>

      {/* III. EMERGENCY PROTOCOL: The Panic Button */}
      <section className="bg-red-50 border border-red-100 rounded-[4rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 text-red-600">
             <ShieldAlert size={24} />
             <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic">Vault Freeze Protocol</h4>
          </div>
          <p className="text-red-900/60 text-sm italic font-medium max-w-sm">
            In the event of compromised credentials, activate the freeze to instantly halt all pending acquisitions and logistical movements.
          </p>
        </div>

        <button 
          onMouseDown={() => setPanicActive(true)}
          onMouseUp={() => setPanicActive(false)}
          className={`
            relative px-16 py-8 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-300 shadow-2xl active:scale-95
            ${panicActive ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white'}
          `}
        >
          {panicActive ? 'HOLDING...' : 'INITIATE FREEZE'}
        </button>
      </section>

    </div>
  )
}

function SessionRow({ device, location, ip, current }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-ivory-50 rounded-2xl border border-ivory-200 hover:border-gold/20 transition-all group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-obsidian-300 group-hover:text-gold transition-colors shadow-inner">
           <Smartphone size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-obsidian-900 uppercase tracking-tight">{device}</p>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 text-[9px] text-obsidian-300 font-black uppercase tracking-widest">
                <Globe size={10} /> {location}
             </div>
             <span className="text-[9px] text-ivory-300 font-mono italic">{ip}</span>
          </div>
        </div>
      </div>
      
      {current ? (
        <span className="text-[8px] bg-gold/10 text-gold px-3 py-1 rounded-full font-black uppercase tracking-widest border border-gold/20 italic">
          Current Node
        </span>
      ) : (
        <button className="text-[9px] text-obsidian-200 hover:text-red-500 font-black uppercase tracking-widest transition-colors">Terminte</button>
      )}
    </div>
  )
}