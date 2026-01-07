'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck, User, Globe, Phone, Loader2, ChevronLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function IdentityStep({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleFinalOrder = async () => {
    setIsSubmitting(true)
    // This will trigger the logic we wrote in PaymentStep or handle final redirect
    // For now, we simulate the final "Place Order" click
    setTimeout(() => {
        // Logic to finalize the record in Supabase would go here
        window.location.href = '/checkout/verification'
    }, 1500)
  }

  if (loading) return (
    <div className="h-48 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="label-caps text-obsidian-400">Preparing Final Review</p>
    </div>
  )

  return (
    <div className="space-y-10">
      
      {/* HEADER & NAVIGATION */}
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[10px] font-bold text-obsidian-400 hover:text-gold uppercase tracking-widest transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Payment
        </button>
        
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight">
            Final <span className="text-gold not-italic">Review</span>
          </h2>
          <p className="text-obsidian-600 text-sm max-w-lg leading-relaxed">
            Please confirm your account details and shipping information below. Once confirmed, your collection will be prepared for transit.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileDisplay label="Full Name" value={profile?.full_name} icon={<User size={14}/>} />
          <ProfileDisplay label="Country" value={profile?.country} icon={<Globe size={14}/>} />
          <ProfileDisplay label="Phone" value={profile?.phone} icon={<Phone size={14}/>} />
          <ProfileDisplay label="Account Status" value="Verified Member" icon={<ShieldCheck size={14}/>} />
        </div>

        {/* SHIPMENT PREPARATION CARD */}
        <div className="bg-ivory-50 p-8 rounded-xl border border-ivory-200 flex gap-4 items-start">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gold/20 shadow-sm shrink-0">
             <Check className="text-gold" size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-obsidian-900 uppercase tracking-widest">Order Ready for Dispatch</h4>
            <p className="text-[11px] text-obsidian-500 leading-relaxed">
              Upon clicking "Place Order," our curators will begin the authentication and packaging process. You will receive a tracking number via secure email within 24 hours.
            </p>
          </div>
        </div>

        {/* FINAL ACTION */}
        <div className="pt-4 space-y-6">
          <button 
            onClick={handleFinalOrder}
            disabled={isSubmitting}
            className="w-full bg-obsidian-900 text-white h-[70px] rounded-lg text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Place Order <ArrowRight size={18} /></>}
          </button>
          
          <p className="text-[10px] text-obsidian-300 text-center uppercase tracking-widest leading-relaxed">
            Authorized signature required for all Lume Vault deliveries.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfileDisplay({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-400 ml-1 flex items-center gap-2">
        {React.cloneElement(icon, { size: 14, className: "text-gold" })} {label}
      </label>
      <div className="w-full bg-white border border-ivory-200 rounded-lg px-5 py-4 shadow-sm">
         <p className="text-obsidian-900 font-bold uppercase tracking-widest text-xs">
           {value || 'Not Disclosed'}
         </p>
      </div>
    </div>
  )
}