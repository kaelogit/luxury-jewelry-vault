'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck, User, Globe, Phone, Loader2, Mail, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { motion } from 'framer-motion'

// Comprehensive Global Country List
const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russian Federation", "Rwanda",
  "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

interface IdentityProps {
  data: any
  update: (data: any) => void
  onNext: () => void
}

export default function IdentityStep({ data, update, onNext }: IdentityProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          // Sync logic: Only update if the field is currently empty 
          update({
            ...data,
            fullName: data.fullName || profile.full_name || '',
            email: user.email || '',
            phone: data.phone || profile.phone || '',
            country: data.country || profile.country || ''
          })
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, []) // Empty dependency array ensures this runs once

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 italic">Loading Profile</p>
    </div>
  )

  const isFormValid = data.fullName && data.phone && data.country;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10 md:space-y-12"
    >
      
      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-5xl font-bold text-obsidian-900 font-serif italic tracking-tight">
          Personal <span className="text-gold not-italic">Details</span>
        </h2>
        <p className="text-gray-500 text-xs md:text-sm max-w-lg leading-relaxed">
          Please verify your information below. This will be used for insurance and delivery purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <IdentityInput 
          label="Full Name" 
          value={data.fullName} 
          onChange={(v: string) => update({...data, fullName: v})} 
          icon={<User size={14}/>} 
          placeholder="Enter full name"
        />
        <IdentityInput 
          label="Email Address" 
          value={data.email} 
          disabled={true} 
          icon={<Mail size={14}/>} 
        />
        <IdentityInput 
          label="Phone Number" 
          value={data.phone} 
          onChange={(v: string) => update({...data, phone: v})} 
          icon={<Phone size={14}/>} 
          placeholder="+1 (000) 000-0000"
        />

        {/* COUNTRY SELECTOR */}
        <div className="space-y-3 group">
          <label className="text-[9px] font-bold uppercase tracking-boutique text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-gold transition-colors">
            <Globe size={14} className="text-gold/60 group-focus-within:text-gold transition-colors" /> Country
          </label>
          <div className="relative">
            <select 
              value={data.country}
              onChange={(e) => update({...data, country: e.target.value})}
              className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-[13px] md:text-xs font-bold text-obsidian-900 uppercase tracking-widest focus:border-gold focus:bg-white outline-none shadow-sm appearance-none cursor-pointer transition-all h-[56px]"
            >
              <option value="">Select Country</option>
              {ALL_COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* SECURITY NOTICE */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
        <ShieldCheck className="text-gold shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-obsidian-900 uppercase tracking-widest">Secure Encryption</h4>
          <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tight">
            Your personal information is encrypted and securely stored. We do not share your data with third parties.
          </p>
        </div>
      </div>

      {/* ACTION */}
      <div className="pt-4">
        <button 
          onClick={onNext}
          disabled={!isFormValid}
          className="w-full bg-black text-white h-[70px] rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-black transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed group active:scale-[0.99]"
        >
          Continue to Shipping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

function IdentityInput({ label, value, onChange, icon, placeholder, disabled = false }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[9px] font-bold uppercase tracking-boutique text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-gold transition-colors">
        {React.cloneElement(icon, { className: "text-gold/60 group-focus-within:text-gold transition-colors", strokeWidth: 1.5 })} {label}
      </label>
      <input 
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        /* LUXURY INPUT STYLE: Bottom border only, lighter background */
        className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-[16px] md:text-sm font-medium text-obsidian-900 focus:border-gold focus:bg-white outline-none placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-400 transition-all h-[56px]"
      />
    </div>
  )
}