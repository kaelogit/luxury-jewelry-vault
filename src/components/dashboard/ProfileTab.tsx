'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, MapPin, Wallet, Phone, 
  ShieldCheck, Edit3, Save, 
  Globe, Mail, Lock, Smartphone, ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProfileTabProps {
  profile: any
}

export default function ProfileTab({ profile }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    city: profile?.city || '',
    shipping_address: profile?.shipping_address || '',
    wallet_address: profile?.wallet_address || '',
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
        window.location.reload() 
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* I. ACCOUNT MANAGEMENT HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <p className="label-caps text-gold">Account Management</p>
          <h2 className="text-3xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight">
            Personal <span className="text-gold not-italic">Details.</span>
          </h2>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-ivory-300 rounded-lg text-[10px] font-bold uppercase tracking-widest text-obsidian-900 hover:border-gold transition-all shadow-sm"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-4">
             <button onClick={() => setIsEditing(false)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-obsidian-400 hover:text-red-500 transition-colors">Cancel</button>
             <button 
              onClick={handleUpdate}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-obsidian-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg"
             >
               {loading ? 'Saving...' : 'Save Changes'} <Save size={14} />
             </button>
          </div>
        )}
      </div>

      {/* II. CORE DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <ProfileField 
          label="Full Name" 
          value={formData.full_name} 
          icon={<User />}
          isEditing={isEditing}
          onChange={(v:any) => setFormData({...formData, full_name: v})}
        />
        <ProfileField 
          label="Contact Number" 
          value={formData.phone} 
          icon={<Phone />}
          isEditing={isEditing}
          onChange={(v:any) => setFormData({...formData, phone: v})}
        />
        <div className="md:col-span-2">
          <ProfileField 
            label="Digital Asset Wallet (Optional)" 
            value={formData.wallet_address} 
            icon={<Wallet />}
            isEditing={isEditing}
            onChange={(v:any) => setFormData({...formData, wallet_address: v})}
          />
        </div>

        {/* SHIPPING SECTION */}
        <div className="md:col-span-2 pt-8 border-t border-ivory-200">
           <div className="flex items-center gap-4 mb-8">
              <p className="label-caps !text-obsidian-900">Primary Shipping Address</p>
              <div className="h-[1px] flex-1 bg-ivory-200" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <ProfileField label="Country" value={formData.country} icon={<Globe />} isEditing={isEditing} onChange={(v:any) => setFormData({...formData, country: v})} />
              <ProfileField label="City" value={formData.city} icon={<MapPin />} isEditing={isEditing} onChange={(v:any) => setFormData({...formData, city: v})} />
              <div className="md:col-span-2">
                <ProfileField label="Full Delivery Address" value={formData.shipping_address} icon={<MapPin />} isEditing={isEditing} onChange={(v:any) => setFormData({...formData, shipping_address: v})} />
              </div>
           </div>
        </div>
      </div>

      {/* III. ACCOUNT INTEGRITY (Integrated Security) */}
      <section className="pt-12 border-t border-ivory-200 space-y-8">
        <div className="space-y-2">
            <p className="label-caps text-obsidian-900">Account Integrity</p>
            <p className="text-xs text-obsidian-400 max-w-md uppercase tracking-widest font-bold">Security preferences and authentication methods.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityCard 
                title="Security Password" 
                desc="Update your authentication credentials." 
                icon={<Lock size={18} />} 
            />
            <SecurityCard 
                title="Two-Factor Auth" 
                desc="Biometric and device-based protection." 
                icon={<Smartphone size={18} />} 
                status="Active"
            />
        </div>
      </section>

      {/* TRUST FOOTER */}
      <div className="mt-12 p-6 bg-white border border-ivory-300 rounded-xl flex items-start gap-4">
        <ShieldCheck className="text-gold shrink-0" size={20} />
        <p className="text-[10px] text-obsidian-500 font-medium uppercase tracking-widest leading-relaxed">
          Your personal data is encrypted and used exclusively for logistics and insurance verification. Lume Vault does not share client coordinates with third-party marketing entities.
        </p>
      </div>

    </div>
  )
}

/**
 * UI COMPONENT: Individual Profile Field
 */
function ProfileField({ label, value, icon, isEditing, onChange }: any) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center gap-2 text-obsidian-400 group-focus-within:text-gold transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 14, className: "text-gold" })}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      
      {isEditing ? (
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-ivory-300 rounded-lg p-4 text-sm text-obsidian-900 outline-none focus:border-gold transition-all"
        />
      ) : (
        <div className="h-12 flex items-center border-l-2 border-ivory-200 pl-6 group-hover:border-gold transition-all">
          <p className="text-lg font-medium text-obsidian-900 font-serif italic tracking-tight uppercase">
            {value || 'Not provided'}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * UI COMPONENT: Integrated Security Card
 */
function SecurityCard({ title, desc, icon, status }: any) {
    return (
        <div className="p-6 bg-white border border-ivory-300 rounded-xl flex items-center justify-between group hover:border-gold transition-all cursor-pointer">
            <div className="flex items-center gap-5">
                <div className="text-gold opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-obsidian-900">{title}</h4>
                        {status && <span className="text-[8px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-green-100">{status}</span>}
                    </div>
                    <p className="text-[10px] text-obsidian-400 font-medium">{desc}</p>
                </div>
            </div>
            <ChevronRight size={16} className="text-obsidian-300 group-hover:text-gold transition-colors" />
        </div>
    )
}