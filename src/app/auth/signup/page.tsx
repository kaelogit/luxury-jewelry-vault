'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  ArrowRight, Lock, User, Mail, 
  Phone, Globe, Loader2, CheckCircle2, 
  AlertCircle, ChevronLeft, MapPin, Home, Hash
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const COUNTRIES = ["United States", "Switzerland", "United Arab Emirates", "United Kingdom", "Singapore", "Monaco", "Qatar", "France", "Italy", "Japan"].sort()

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
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
      setErrorMsg("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address, 
            city: formData.city,
            state: formData.state,     
            zip_code: formData.zipCode, 
            country: formData.country,
            role: 'client' 
          }
        }
      })

      if (error) throw error
      window.location.href = '/auth/login?registered=true'
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex flex-col relative overflow-x-hidden">
      <nav className="w-full py-6 px-6 md:px-12">
        <Link href="/" className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-obsidian-900 hover:text-gold transition-all">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <header className="text-center mb-10 space-y-2">
            <h1 className="text-3xl md:text-5xl font-medium text-obsidian-900 tracking-tight">
              Create Your <span className="text-gold italic font-serif">Account</span>
            </h1>
            <p className="label-caps !tracking-[0.2em] text-obsidian-400">Join the Lume Vault Collection</p>
          </header>

          <form onSubmit={handleSignup} className="bg-white border border-ivory-300 p-8 md:p-12 rounded-[2rem] shadow-xl space-y-8">
            
            {/* SECTION: Identity */}
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold border-b border-ivory-200 pb-2">Personal Identity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name" icon={<User size={14}/>} placeholder="John" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                <InputField label="Last Name" icon={<User size={14}/>} placeholder="Doe" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                <InputField label="Email Address" icon={<Mail size={14}/>} placeholder="name@example.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} type="email" />
                <InputField label="Phone Number" icon={<Phone size={14}/>} placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
              </div>
            </div>

            {/* SECTION: Logistics */}
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold border-b border-ivory-200 pb-2">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <InputField label="Street Address" icon={<Home size={14}/>} placeholder="123 Luxury Lane, Suite 100" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputField label="City" icon={<MapPin size={14}/>} placeholder="London" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
                <InputField label="State / Province" icon={<MapPin size={14}/>} placeholder="Greater London" value={formData.state} onChange={(v) => setFormData({...formData, state: v})} />
                <InputField label="Zip Code" icon={<Hash size={14}/>} placeholder="SW1A 1AA" value={formData.zipCode} onChange={(v) => setFormData({...formData, zipCode: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-obsidian-600 ml-1 flex items-center gap-2">
                    <Globe size={14} className="text-gold" /> Country
                  </label>
                  <select 
                    value={formData.country} 
                    onChange={(e) => setFormData({...formData, country: e.target.value})} 
                    className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-sm text-obsidian-900 focus:border-gold outline-none shadow-sm h-[52px]" 
                    required
                  >
                    <option value="">Select</option>
                    {COUNTRIES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION: Security */}
            <div className="space-y-6 pt-4 border-t border-ivory-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Password" icon={<Lock size={14}/>} placeholder="••••••••" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} type="password" />
                <InputField label="Confirm Password" icon={<CheckCircle2 size={14}/>} placeholder="••••••••" value={formData.confirmPassword} onChange={(v) => setFormData({...formData, confirmPassword: v})} type="password" />
              </div>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-xs text-red-600 font-medium">
                  <AlertCircle size={18} /> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={loading} 
              className="w-full h-[64px] bg-obsidian-900 text-white rounded-lg text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
            </button>

            <p className="text-center text-xs text-obsidian-400">
              Already have an account? <Link href="/auth/login" className="text-gold font-bold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>

      <footer className="py-8 text-center">
        <p className="text-[10px] text-obsidian-300 font-bold uppercase tracking-widest">Lume Vault © 2026 | All Rights Reserved</p>
      </footer>
    </main>
  )
}

function InputField({ label, icon, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-wider text-obsidian-600 ml-1 flex items-center gap-2">
        {React.cloneElement(icon, { className: "text-gold" })} {label}
      </label>
      <input 
        type={type} 
        required 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 shadow-sm h-[52px] font-medium" 
        placeholder={placeholder} 
      />
    </div>
  )
}