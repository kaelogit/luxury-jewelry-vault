'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, Fingerprint, ShieldCheck, User, Globe, Mail, Phone, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function IdentityStep({ onNext }: { onNext: () => void }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. DATA INGRESS: Fetch existing profile for the 'Whale' client
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
    <div className="h-48 flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="text-[10px] text-obsidian-400 uppercase tracking-[0.4em] font-black italic">Verifying Identity...</p>
    </div>
  )

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Opulent Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_gold]" />
           <h2 className="text-4xl font-light text-obsidian-900 italic tracking-tighter uppercase">
             Identity <span className="text-gold font-bold">Protocol.</span>
           </h2>
        </div>
        <p className="text-obsidian-400 text-sm font-light max-w-lg italic leading-relaxed border-l border-ivory-300 pl-8">
          To comply with sovereign trade regulations for high-value assets, 
          we have retrieved your legal identifier. Please confirm these credentials for the current acquisition.
        </p>
      </div>

      <div className="space-y-10">
        {/* REBUILT: Profile Confirmation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ProfileDisplay label="Legal Full Name" value={profile?.full_name} icon={<User size={14}/>} />
          <ProfileDisplay label="Sovereign Origin" value={profile?.country} icon={<Globe size={14}/>} />
          <ProfileDisplay label="Secure Channel" value={profile?.phone} icon={<Phone size={14}/>} />
          <ProfileDisplay label="Audit Identifier" value={profile?.id.slice(0, 12)} icon={<Fingerprint size={14}/>} />
        </div>

        {/* Security Assurance Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-ivory-300 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] pointer-events-none" />
          <div className="flex items-center gap-4 text-gold">
            <ShieldCheck size={20} />
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] italic">Encryption Standard</h4>
          </div>
          <p className="text-[11px] text-obsidian-400 leading-relaxed uppercase font-bold tracking-widest italic">
            This identity packet is AES-256 encrypted and stored within a non-indexed sovereign node. 
            LUME VAULT maintains absolute client anonymity across all global trade registries.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center pt-6">
          <p className="text-[9px] text-obsidian-300 uppercase font-bold tracking-widest italic max-w-xs">
            * By confirming, you authorize a one-time cryptographic handshake for this asset.
          </p>
          <button 
            onClick={onNext}
            className="group bg-obsidian-900 text-gold px-14 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
          >
            Confirm Identity <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileDisplay({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center gap-3 text-obsidian-400 group-hover:text-gold transition-colors duration-500">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">{label}</span>
      </div>
      <div className="w-full bg-white border border-ivory-300 rounded-2xl px-8 py-5 shadow-sm">
         <p className="text-obsidian-900 font-bold uppercase tracking-widest text-sm italic">
           {value || 'Not Disclosed'}
         </p>
      </div>
    </div>
  )
}