'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSelectionStore } from '@/store/useSelectionStore'
import { 
  ShieldCheck, Loader2, Copy, 
  ArrowLeft, Bitcoin, Coins, 
  Landmark, Info, ArrowRight,
  Fingerprint
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface PaymentStepProps {
  onBack: () => void;
  onNext: () => void; // Syncs with the 3-step 'Review' flow
}

export default function PaymentStep({ onBack, onNext }: PaymentStepProps) {
  const { items, getTotalPrice } = useSelectionStore()
  const [activeMethodId, setActiveMethodId] = useState('wire')
  const [copyStatus, setCopyStatus] = useState('Copy Address')
  const [profile, setProfile] = useState<any>(null)
  const [isSyncing, setIsSyncing] = useState(true)
  const [vaultSettings, setVaultSettings] = useState<any>({})
  const router = useRouter()

  // I. SYNC GATEWAYS: Fetch live addresses from the 'vault_settings' table
  useEffect(() => {
    const fetchIdentityAndGateways = async () => {
      // 1. Get Profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        setProfile(profileData)
      }

      // 2. Get Live Payment Nodes from DB
      const { data: settingsData } = await supabase.from('vault_settings').select('key, value')
      if (settingsData) {
        const mappedSettings = settingsData.reduce((acc: any, item: any) => {
          acc[item.key] = item.value
          return acc
        }, {})
        setVaultSettings(mappedSettings)
      }
      setIsSyncing(false)
    }
    fetchIdentityAndGateways()
  }, [])

  // II. DYNAMIC METHOD CONFIGURATION (No more hardcoded strings)
  const PAYMENT_METHODS = [
    { 
      id: 'wire', 
      label: 'Bank Wire', 
      icon: <Landmark size={18} strokeWidth={1.5} />, 
      details: vaultSettings.bank_details || "Fetching instructions...",
      network: "Swift / FedWire / SEPA" 
    },
    { 
      id: 'btc', 
      label: 'Bitcoin', 
      symbol: 'BTC', 
      icon: <Bitcoin size={18} strokeWidth={1.5} />, 
      address: vaultSettings.btc_address,
      network: "Mainnet" 
    },
    { 
      id: 'eth', 
      label: 'Ethereum', 
      symbol: 'ETH', 
      icon: <Coins size={18} strokeWidth={1.5} />, 
      address: vaultSettings.eth_address,
      network: "ERC-20" 
    },
    { 
      id: 'usdt', 
      label: 'Tether', 
      symbol: 'USDT', 
      icon: <ShieldCheck size={18} strokeWidth={1.5} />, 
      address: vaultSettings.usdt_address,
      network: "TRC-20 (Tron)" 
    }
  ]

  const activeMethod = PAYMENT_METHODS.find(m => m.id === activeMethodId) || PAYMENT_METHODS[0]

  const copyToClipboard = () => {
    if (activeMethod.address) {
      navigator.clipboard.writeText(activeMethod.address)
      setCopyStatus('Address Copied')
      setTimeout(() => setCopyStatus('Copy Address'), 2000)
    }
  }

  if (isSyncing) return (
    <div className="h-64 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold" size={24} />
      <p className="label-caps text-obsidian-400">Syncing Secure Nodes...</p>
    </div>
  )

  return (
    <div className="space-y-10">
      {/* NAVIGATION */}
      <button onClick={onBack} className="group flex items-center gap-2 text-[11px] font-bold text-obsidian-400 hover:text-gold uppercase tracking-widest transition-colors">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Shipping
      </button>

      <header className="space-y-2">
        <h2 className="text-3xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight">
          Payment <span className="text-gold not-italic">Selection</span>
        </h2>
        <p className="text-obsidian-600 text-sm max-w-lg leading-relaxed">
          Select your transfer method. Assets are reserved in the vault once the transfer is initiated.
        </p>
      </header>

      {/* SELECTOR GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setActiveMethodId(method.id)}
            className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-4 ${
              activeMethodId === method.id 
              ? 'bg-obsidian-900 border-gold text-gold shadow-lg scale-[1.02]' 
              : 'bg-white border-ivory-300 text-obsidian-400 hover:border-gold'
            }`}
          >
            {method.icon}
            <span className="text-[10px] font-bold uppercase tracking-widest">{method.label}</span>
          </button>
        ))}
      </div>

      {/* THE DYNAMIC CARD */}
      <div className="p-8 md:p-10 bg-white border border-ivory-300 rounded-2xl shadow-sm space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMethodId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest">
                {activeMethod.label} Signature Details
              </p>
              {activeMethod.address && (
                <button 
                  onClick={copyToClipboard}
                  className="text-[10px] font-bold text-obsidian-900 uppercase tracking-widest hover:text-gold transition-colors flex items-center gap-2"
                >
                  <Copy size={12} /> {copyStatus}
                </button>
              )}
            </div>
            
            <div className="bg-ivory-50 p-6 md:p-8 rounded-xl border border-ivory-200 text-center">
              {activeMethodId === 'wire' ? (
                <p className="text-sm text-obsidian-600 font-medium leading-relaxed italic">
                  {activeMethod.details}
                </p>
              ) : (
                <p className="text-xs md:text-sm font-mono text-obsidian-900 break-all leading-relaxed">
                  {activeMethod.address || 'PENDING ASSIGNMENT'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-obsidian-400 uppercase tracking-widest justify-center">
              <Info size={12} className="text-gold" /> Network: {activeMethod.network}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="pt-6 border-t border-ivory-100 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">Total Valuation</p>
            <p className="text-3xl font-medium text-obsidian-900 font-serif italic tracking-tight">
              ${getTotalPrice().toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 opacity-40">
            <Fingerprint className="text-obsidian-900" size={24} strokeWidth={1} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Secure Transfer</span>
          </div>
        </div>
      </div>

      {/* FINAL ACTION */}
      <div className="space-y-6">
        <button 
          onClick={onNext} // Moves to 'IdentityStep.tsx' (The Final Review)
          className="w-full h-[70px] bg-obsidian-900 text-white rounded-lg text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-300 shadow-lg"
        >
          Verify Selection <ArrowRight size={18} />
        </button>

        <p className="text-[10px] text-obsidian-400 text-center uppercase tracking-widest leading-relaxed px-10">
          * High-value assets are reserved for 60 minutes pending verification.
        </p>
      </div>
    </div>
  )
}