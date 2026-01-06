'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, MapPin, Wallet, Phone, 
  ShieldCheck, Edit3, Save, X, 
  Fingerprint, Globe 
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
        window.location.reload() // Refresh to sync global state
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl space-y-10">
      
      {/* I. IDENTITY HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white border border-ivory-300 rounded-2xl flex items-center justify-center text-gold shadow-sm">
              <Fingerprint size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic leading-none mb-1">Identity Manifest</p>
              <h4 className="text-2xl font-light text-obsidian-900 italic tracking-tighter">Personal <span className="text-obsidian-400">Registry.</span></h4>
           </div>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-ivory-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-obsidian-900 hover:border-gold hover:text-gold transition-all shadow-sm"
          >
            <Edit3 size={14} /> Modify Identity
          </button>
        ) : (
          <div className="flex gap-4">
             <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-obsidian-300 hover:text-red-500 transition-all">Cancel</button>
             <button 
              onClick={handleUpdate}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-obsidian-900 text-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-2xl"
             >
               {loading ? 'Securing...' : 'Save Manifest'} <Save size={14} />
             </button>
          </div>
        )}
      </div>

      {/* II. DATA GRID: The Personal Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Full Name */}
        <ProfileField 
          label="Legal Name" 
          value={formData.full_name} 
          icon={<User size={16} />}
          isEditing={isEditing}
          onChange={(v) => setFormData({...formData, full_name: v})}
        />

        {/* Phone */}
        <ProfileField 
          label="Secure Contact" 
          value={formData.phone} 
          icon={<Phone size={16} />}
          isEditing={isEditing}
          onChange={(v) => setFormData({...formData, phone: v})}
        />

        {/* Wallet */}
        <div className="md:col-span-2">
           <ProfileField 
            label="Sovereign Wallet Signature (BTC / ETH)" 
            value={formData.wallet_address} 
            icon={<Wallet size={16} />}
            isEditing={isEditing}
            onChange={(v) => setFormData({...formData, wallet_address: v})}
          />
        </div>

        {/* Logistics Ingress */}
        <div className="md:col-span-2 mt-8">
           <div className="flex items-center gap-4 mb-8">
              <Globe size={16} className="text-gold" />
              <h5 className="text-[11px] font-black text-obsidian-900 uppercase tracking-[0.4em] italic">Logistics Ingress</h5>
              <div className="h-[1px] flex-1 bg-ivory-300" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ProfileField 
                label="Country of Domicile" 
                value={formData.country} 
                icon={<MapPin size={16} />}
                isEditing={isEditing}
                onChange={(v) => setFormData({...formData, country: v})}
              />
              <ProfileField 
                label="City / Hub" 
                value={formData.city} 
                icon={<MapPin size={16} />}
                isEditing={isEditing}
                onChange={(v) => setFormData({...formData, city: v})}
              />
              <div className="md:col-span-2">
                <ProfileField 
                  label="Armored Delivery Coordinates (Full Address)" 
                  value={formData.shipping_address} 
                  icon={<ShieldCheck size={16} />}
                  isEditing={isEditing}
                  onChange={(v) => setFormData({...formData, shipping_address: v})}
                />
              </div>
           </div>
        </div>
      </div>

      {/* III. SECURITY FOOTER */}
      <div className="mt-20 p-8 bg-ivory-50 border border-ivory-300 rounded-[2.5rem] flex items-center gap-6 opacity-60">
        <ShieldCheck className="text-gold" size={24} />
        <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest leading-relaxed italic">
          Identity data is handled via the Lume Sovereign Protocol. Your physical coordinates are never stored in plain-text on public nodes.
        </p>
      </div>

    </div>
  )
}

function ProfileField({ label, value, icon, isEditing, onChange }: any) {
  return (
    <div className="space-y-4 group">
      <div className="flex items-center gap-3 text-obsidian-300 group-hover:text-gold transition-colors duration-500">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">{label}</span>
      </div>
      
      {isEditing ? (
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-ivory-300 rounded-2xl p-5 text-obsidian-900 font-medium outline-none focus:border-gold transition-all shadow-inner"
        />
      ) : (
        <p className="text-xl font-light text-obsidian-900 italic tracking-tighter uppercase pl-7 border-l border-ivory-300 group-hover:border-gold transition-all duration-700 min-h-[30px]">
          {value || 'PENDING INITIALIZATION'}
        </p>
      )}
    </div>
  )
}