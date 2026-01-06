'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Fingerprint, User, Globe, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  onNext: () => void
}

export default function IdentityStep({ onNext }: Props) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. IDENTITY SYNC: Pulling the Sovereign's profile from the Vault
  useEffect(() => {
    const fetchIdentity = async () => {
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
    fetchIdentity()
  }, [])

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={24} />
      <p className="text-[10px] text-obsidian-300 font-black uppercase tracking-[0.4em]">Verifying Node Access...</p>
    </div>
  )

  return (
    <div className="space-y-10">
      {/* HEADER: The Clearance Statement */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
           <Fingerprint className="text-gold" size={16} />
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic">Identity Protocol</h3>
        </div>
        <h2 className="text-4xl font-light text-obsidian-900 italic tracking-tighter">
          Verify <span className="text-obsidian-400">Credentials.</span>
        </h2>
      </header>

      {/* THE MANIFEST: Displaying the recognized identity */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 bg-white border border-ivory-300 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] pointer-events-none" />
        
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between border-b border-ivory-100 pb-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ivory-50 rounded-xl flex items-center justify-center text-gold border border-ivory-200">
                   <User size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-widest leading-none mb-1">Authenticated Member</p>
                   <p className="text-lg font-bold text-obsidian-900 uppercase tracking-tight italic">
                     {profile?.full_name || 'Registry Member'}
                   </p>
                </div>
             </div>
             <ShieldCheck className="text-gold" size={24} />
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-1">
                <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest italic">Clearance Level</p>
                <p className="text-xs font-bold text-gold uppercase tracking-widest">Sovereign Tier</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest italic">Primary Node</p>
                <div className="flex items-center gap-2">
                   <Globe size={10} className="text-obsidian-300" />
                   <p className="text-xs font-bold text-obsidian-900 uppercase tracking-widest">
                     {profile?.country || 'Global'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* PROTECTION FOOTER */}
      <div className="flex items-center gap-4 px-4 opacity-50">
        <ShieldCheck size={14} className="text-gold" />
        <p className="text-[9px] font-black text-obsidian-900 uppercase tracking-[0.3em] italic">
          Data handled via AES-256 Encrypted Registry
        </p>
      </div>

      {/* CONTINUATION COMMAND */}
      <button 
        onClick={onNext} 
        className="group w-full py-8 bg-obsidian-900 text-gold rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
      >
        Continue to Logistics <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
      </button>
    </div>
  )
}