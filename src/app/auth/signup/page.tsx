'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  ShieldCheck, ArrowRight, Lock, User, Mail, 
  Phone, Globe, Loader2, CheckCircle2, AlertCircle, 
  ChevronLeft, MapPin, Home 
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const SOVEREIGN_NATIONS = ["United States", "Switzerland", "United Arab Emirates", "United Kingdom", "Singapore", "Monaco", "Qatar"].sort()

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    address: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Vault keys do not match.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            city: formData.city,
            country: formData.country,
            shipping_address: formData.address,
            role: 'customer'
          }
        }
      })

      if (error) throw error
      window.location.href = '/auth/login?registered=true'
    } catch (err: any) {
      setErrorMsg(err.message || "Registry connection failed.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex flex-col selection:bg-gold selection:text-white relative">
      <nav className="w-full py-8 px-8 md:px-12 flex justify-between items-center relative z-50">
        <Link href="/" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-900 hover:text-gold transition-all">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Entry
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-3xl space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-light text-obsidian-900 italic tracking-tighter uppercase">
              Membership <span className="text-gold">Registry.</span>
            </h1>
            <p className="text-[10px] text-obsidian-400 font-black uppercase tracking-[0.5em] italic">Institutional Enrollment Protocol</p>
          </header>

          <form onSubmit={handleSignup} className="space-y-10 bg-white border border-ivory-300 p-10 md:p-16 rounded-[4rem] shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Row 1: Identity */}
              <InputField label="Full Legal Identity" icon={<User size={12}/>} placeholder="FIRST LAST" value={formData.fullName} onChange={(v) => setFormData({...formData, fullName: v})} />
              <InputField label="Secure Email" icon={<Mail size={12}/>} placeholder="CLIENT@REGISTRY.COM" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} type="email" />
              
              {/* Row 2: Contact & Sovereignty */}
              <InputField label="Phone Signature" icon={<Phone size={12}/>} placeholder="+1..." value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-400 ml-6 italic flex items-center gap-3">
                  <Globe size={12} className="text-gold" /> Sovereignty
                </label>
                <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full bg-ivory-50 border border-ivory-300 rounded-[2rem] px-8 py-5 text-sm focus:border-gold outline-none appearance-none shadow-inner" required>
                  <option value="">SELECT NATION</option>
                  {SOVEREIGN_NATIONS.map(n => <option key={n} value={n}>{n.toUpperCase()}</option>)}
                </select>
              </div>

              {/* Row 3: Logistics (THE FIX) */}
              <InputField label="City of Residence" icon={<MapPin size={12}/>} placeholder="CITY" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
              <InputField label="Residential Signature (Address)" icon={<Home size={12}/>} placeholder="STREET, BUILDING, SUITE" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
            </div>

            {/* Security Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-ivory-100">
              <InputField label="Create Vault Key" icon={<Lock size={12}/>} placeholder="••••••••" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} type="password" />
              <InputField label="Confirm Vault Key" icon={<CheckCircle2 size={12}/>} placeholder="••••••••" value={formData.confirmPassword} onChange={(v) => setFormData({...formData, confirmPassword: v})} type="password" />
            </div>

            <AnimatePresence>
              {errorMsg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-4 text-[10px] text-red-600 font-bold uppercase tracking-widest"><AlertCircle size={16} /> {errorMsg}</motion.div>}
            </AnimatePresence>

            <button disabled={loading} className="group relative w-full h-[92px] bg-obsidian-900 text-gold rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-6 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-30">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>Register Member <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>

      <footer className="w-full py-12 px-8 text-center border-t border-ivory-300">
         <p className="text-[9px] text-obsidian-200 font-black uppercase tracking-[0.6em] italic">Lume Vault Institutional Registry © 2026</p>
      </footer>
    </main>
  )
}

function InputField({ label, icon, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-400 ml-6 italic flex items-center gap-3">
        {React.cloneElement(icon, { className: "text-gold" })} {label}
      </label>
      <input 
        type={type} 
        required 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-ivory-50 border border-ivory-300 rounded-[2rem] px-8 py-5 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all font-medium placeholder:text-ivory-200 shadow-inner" 
        placeholder={placeholder} 
      />
    </div>
  )
}