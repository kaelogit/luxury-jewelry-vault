'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Settings, Save, Loader2, Mail, Phone, 
  Power, ShieldCheck, Building, 
  Globe, Bell
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GeneralSettings() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const [brand, setBrand] = useState({
    store_name: "Lume Vault",
    contact_email: "",
    support_phone: "",
    hq_address: "",
    maintenance_mode: false
  })

  useEffect(() => {
    fetchBrandSettings()
  }, [])

  async function fetchBrandSettings() {
    setLoading(true)
    const { data } = await supabase.from('brand_settings').select('*').eq('id', 1).single()
    if (data) {
      setBrand({
        store_name: data.store_name || "Lume Vault",
        contact_email: data.contact_email || "",
        support_phone: data.support_phone || "",
        hq_address: data.hq_address || "",
        maintenance_mode: data.maintenance_mode || false
      })
    }
    setLoading(false)
  }

  async function handleSave() {
    setIsUpdating(true)
    const { error } = await supabase
      .from('brand_settings')
      .update({
        ...brand,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)

    if (!error) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      alert("Update Failed: " + error.message)
    }
    setIsUpdating(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-gold" size={32} />
    </div>
  )

  return (
    <main className="space-y-10 pb-20 font-sans max-w-6xl mx-auto px-6 pt-6">
      
      <header className="flex flex-col gap-1 border-b border-gray-100 pb-10">
        <h2 className="text-3xl font-bold text-black tracking-tight uppercase">
          Settings
        </h2>
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
          Manage identity and operational status
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-2">
          <SidebarItem icon={<Building size={16}/>} label="General Info" active />
          <SidebarItem icon={<Globe size={16}/>} label="Regional & SEO" />
          <SidebarItem icon={<Bell size={16}/>} label="Notifications" />
          <SidebarItem icon={<ShieldCheck size={16}/>} label="Admin Access" />
        </aside>

        {/* SETTINGS CONTENT */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* BRAND PROFILE */}
          <section className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <Settings className="text-gold" size={18} />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Store Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Store Name</label>
                <input 
                  type="text" 
                  value={brand.store_name} 
                  onChange={(e) => setBrand({...brand, store_name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold text-black outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Support Email" icon={<Mail size={14}/>}>
                  <input 
                    type="email" 
                    value={brand.contact_email} 
                    onChange={(e) => setBrand({...brand, contact_email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-black outline-none focus:border-gold"
                  />
                </InputWrapper>
                <InputWrapper label="Phone Number" icon={<Phone size={14}/>}>
                  <input 
                    type="text" 
                    value={brand.support_phone} 
                    onChange={(e) => setBrand({...brand, support_phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-black outline-none focus:border-gold"
                  />
                </InputWrapper>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Headquarters Address</label>
                <textarea 
                  value={brand.hq_address}
                  onChange={(e) => setBrand({...brand, hq_address: e.target.value})}
                  placeholder="Official address for invoices and documentation..."
                  className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xs font-bold text-black outline-none focus:border-gold transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* SYSTEM OVERRIDE */}
          <section className="bg-black text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className={`p-3 rounded-full ${brand.maintenance_mode ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                <Power size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-tight">Maintenance Mode</h4>
                <p className="text-[10px] text-gray-400 font-medium">Enable to show a "Coming Soon" screen to customers.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setBrand({...brand, maintenance_mode: !brand.maintenance_mode})}
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${brand.maintenance_mode ? 'bg-gold' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${brand.maintenance_mode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </section>

          {/* SAVE ACTIONS */}
          <div className="flex items-center justify-between pt-6">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-green-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14}/> Settings Saved
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className="px-10 py-4 bg-gold text-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
      active ? 'bg-gray-50 text-gold border border-gray-100 shadow-sm' : 'text-gray-400 hover:text-black hover:bg-gray-50'
    }`}>
      {icon} {label}
    </button>
  )
}

function InputWrapper({ label, icon, children }: any) {
  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold z-10">{icon}</div>
        {children}
      </div>
    </div>
  )
}