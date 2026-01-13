'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, MapPin, Phone, 
  ShieldCheck, Edit3, Save, 
  Globe, Lock, Smartphone, ChevronRight,
  UserCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase' // FIX: Using instance factory
import { useRouter } from 'next/navigation'

interface ProfileTabProps {
  profile: any
}

export default function ProfileTab({ profile }: ProfileTabProps) {
  const supabase = createClient() // AUDIT FIX: Initialize factory once
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    city: profile?.city || '',
    shipping_address: profile?.shipping_address || '',
  })

  const handleUpdate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (!error) {
        setIsEditing(false)
        // router.refresh() is the "Greater" way to re-fetch server data 
        // without a harsh browser white-flicker reload.
        router.refresh()
      } else {
        console.error("Profile update failed:", error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* I. HEADER AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Profile</p>
          <h2 className="text-3xl md:text-5xl font-bold text-black font-serif italic tracking-tight leading-none uppercase">
            Account <span className="text-gold not-italic">Settings</span>
          </h2>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-black hover:border-gold transition-all shadow-sm active:scale-95"
          >
            <Edit3 size={14} /> Update Profile
          </button>
        ) : (
          <div className="flex gap-4">
             <button onClick={() => setIsEditing(false)} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">Discard</button>
             <button 
              onClick={handleUpdate}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
             >
               {loading ? 'Saving...' : 'Save Changes'} <Save size={14} />
             </button>
          </div>
        )}
      </div>

      {/* II. IDENTITY & CONTACT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        <ProfileField 
          label="Full Name" 
          value={formData.full_name} 
          icon={<UserCircle />}
          isEditing={isEditing}
          placeholder="Enter your name"
          onChange={(v:any) => setFormData({...formData, full_name: v})}
        />
        <ProfileField 
          label="Phone Number" 
          value={formData.phone} 
          icon={<Phone />}
          isEditing={isEditing}
          placeholder="+1 (555) 000-0000"
          onChange={(v:any) => setFormData({...formData, phone: v})}
        />
        
        {/* SHIPPING SECTION */}
        <div className="md:col-span-2 pt-12 border-t border-gray-100">
           <div className="flex items-center gap-4 mb-10">
              <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Shipping Details</p>
              <div className="h-[1px] flex-1 bg-gray-100" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              <ProfileField label="Country" value={formData.country} icon={<Globe />} isEditing={isEditing} placeholder="e.g. Switzerland" onChange={(v:any) => setFormData({...formData, country: v})} />
              <ProfileField label="City" value={formData.city} icon={<MapPin />} isEditing={isEditing} placeholder="e.g. Zurich" onChange={(v:any) => setFormData({...formData, city: v})} />
              <div className="md:col-span-2">
                <ProfileField label="Street Address" value={formData.shipping_address} icon={<MapPin />} isEditing={isEditing} placeholder="Enter your full shipping address" onChange={(v:any) => setFormData({...formData, shipping_address: v})} />
              </div>
           </div>
        </div>
      </div>

      {/* III. SECURITY SECTION */}
      <section className="pt-16 border-t border-gray-100 space-y-10">
        <div className="space-y-2 text-center md:text-left">
            <h4 className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Data & Security</h4>
            <p className="text-[10px] text-gray-400 max-w-md uppercase tracking-widest leading-relaxed">Manage your credentials and authentication security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityCard 
                title="Account Password" 
                desc="Update your login credentials." 
                icon={<Lock size={18} />} 
            />
            <SecurityCard 
                title="Device Access" 
                desc="Manage 2FA and secure login methods." 
                icon={<Smartphone size={18} />} 
                status="Active"
            />
        </div>
      </section>

      {/* PRIVACY DISCLOSURE */}
      <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <ShieldCheck className="text-gold shrink-0 mt-1" size={24} strokeWidth={1.5} />
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">
          Your personal data is encrypted and managed with absolute discretion. Contact details are strictly used for delivery logistics and insurance purposes. We never disclose client information to external parties.
        </p>
      </div>

    </div>
  )
}

function ProfileField({ label, value, icon, isEditing, onChange, placeholder }: any) {
  return (
    <div className="space-y-4 group">
      <div className="flex items-center gap-2 text-gray-400 group-focus-within:text-gold transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 16, className: "text-gold/60" })}
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
      
      {isEditing ? (
        <input 
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-sm text-black outline-none focus:border-gold transition-all shadow-inner placeholder:text-gray-300"
        />
      ) : (
        <div className="min-h-[50px] flex items-center border-l border-gray-100 pl-8 group-hover:border-gold transition-all duration-500">
          <p className="text-lg font-bold text-black uppercase tracking-tight">
            {value || <span className="text-gray-200 normal-case font-medium">Not provided</span>}
          </p>
        </div>
      )}
    </div>
  )
}

function SecurityCard({ title, desc, icon, status }: any) {
    return (
        <div className="p-8 bg-white border border-gray-100 rounded-3xl flex items-center justify-between group hover:border-gold hover:shadow-xl transition-all duration-500 cursor-pointer">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gold transition-colors group-hover:bg-gold group-hover:text-black shadow-inner">{icon}</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">{title}</h4>
                        {status && <span className="text-[8px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-green-100">{status}</span>}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
                </div>
            </div>
            <ChevronRight size={16} className="text-gray-200 group-hover:text-gold transition-colors" />
        </div>
    )
}