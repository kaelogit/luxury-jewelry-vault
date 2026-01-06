'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSelectionStore } from '@/store/useSelectionStore'
import { 
  ShieldCheck, Zap, Loader2, CheckCircle2, 
  Copy, Wallet, ArrowLeft, Bitcoin, Coins, Fingerprint, ExternalLink 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PaymentStepProps {
  onBack: () => void;
}

// I. SETTLEMENT REGISTRY: Multi-Rail Configuration
const PAYMENT_RAILS = [
  { 
    id: 'btc', 
    label: 'Bitcoin', 
    symbol: 'BTC', 
    icon: <Bitcoin size={18} />, 
    address: "bc1qxy2kgdypjrsqz744387nw63699v5298as0385",
    network: "Mainnet" 
  },
  { 
    id: 'eth', 
    label: 'Ethereum', 
    symbol: 'ETH', 
    icon: <Coins size={18} />, 
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    network: "ERC-20" 
  },
  { 
    id: 'usdt', 
    label: 'Tether', 
    symbol: 'USDT', 
    icon: <ShieldCheck size={18} />, 
    address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    network: "TRC-20 (Tron)" 
  }
]

export default function PaymentStep({ onBack }: PaymentStepProps) {
  const { items, getTotalPrice, clearVault } = useSelectionStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [activeRail, setActiveRail] = useState(PAYMENT_RAILS[0])
  const [copyStatus, setCopyStatus] = useState('COPY SIGNATURE')

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        setProfile(data)
      }
    }
    getProfile()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeRail.address)
    setCopyStatus('COPIED TO REGISTRY')
    setTimeout(() => setCopyStatus('COPY SIGNATURE'), 2000)
  }

  const handleFinalizeIntent = async () => {
    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Authentication Required")

      const orderManifest = {
        client_id: user.id,
        client_name: profile?.full_name || user.email?.split('@')[0],
        total_valuation: getTotalPrice(),
        items: items,
        status: 'pending', 
        payment_method: activeRail.symbol,
        tx_hash: null,
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('orders').insert([orderManifest])
      if (error) throw error

      setIsSuccess(true)
      clearVault() 
    } catch (error: any) {
      alert(`Settlement Failure: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) return <SuccessUI />

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* II. NAVIGATION: Sovereign Back-Channel */}
      <button 
        onClick={onBack} 
        className="group flex items-center gap-3 text-[10px] font-black text-obsidian-300 uppercase tracking-widest hover:text-gold transition-all"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Logistics
      </button>

      <header className="space-y-4">
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_gold] animate-pulse" />
           <h3 className="text-4xl font-light text-obsidian-900 italic tracking-tighter uppercase">
             Settlement <span className="text-obsidian-400">Protocol.</span>
           </h3>
        </div>
        <p className="text-[11px] text-obsidian-400 uppercase tracking-[0.4em] font-black italic border-l border-ivory-300 pl-8">
          Execute the transfer to the LUME Cold-Storage node below.
        </p>
      </header>

      {/* III. RAIL SELECTOR: Institutional Choice */}
      <div className="grid grid-cols-3 gap-4">
        {PAYMENT_RAILS.map((rail) => (
          <button
            key={rail.id}
            onClick={() => setActiveRail(rail)}
            className={`p-6 rounded-[2rem] border transition-all duration-700 flex flex-col items-center gap-4 ${
              activeRail.id === rail.id 
              ? 'bg-obsidian-900 border-gold text-gold shadow-2xl scale-105' 
              : 'bg-white border-ivory-300 text-obsidian-300 hover:border-gold/30'
            }`}
          >
            {rail.icon}
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{rail.symbol}</span>
          </button>
        ))}
      </div>

      {/* IV. SETTLEMENT CARD: The Vault Signature */}
      <div className="p-10 bg-white border border-ivory-300 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRail.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] italic">
                {activeRail.label} Signature <span className="text-gold/40">[{activeRail.network}]</span>
              </p>
              <button 
                onClick={copyToClipboard}
                className="text-[9px] font-black text-gold uppercase tracking-widest hover:text-obsidian-900 transition-colors flex items-center gap-2"
              >
                <Copy size={12} /> {copyStatus}
              </button>
            </div>
            
            <p className="text-sm font-mono text-obsidian-900 break-all bg-ivory-50 p-8 rounded-[2rem] border border-ivory-200 shadow-inner leading-relaxed text-center italic">
              {activeRail.address}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between items-end border-t border-ivory-100 pt-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.4em] italic">Final Settlement Valuation</p>
            <p className="text-5xl font-light text-obsidian-900 tracking-tighter italic">
              ${getTotalPrice().toLocaleString()} <span className="text-xl text-obsidian-300 not-italic ml-2 uppercase">USD</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Fingerprint className="text-gold" size={32} strokeWidth={1} />
            <span className="text-[8px] font-black text-gold uppercase tracking-widest italic">Biometric Verified</span>
          </div>
        </div>
      </div>

      {/* V. ACTION COMMAND */}
      <div className="space-y-8">
        <button 
          onClick={handleFinalizeIntent}
          disabled={isProcessing}
          className="group relative w-full h-[92px] bg-obsidian-900 text-gold rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-[0.98] disabled:opacity-40 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isProcessing ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>Finalize Settlement Intent <Zap size={18} className="group-hover:fill-gold transition-colors duration-500" /></>
          )}
        </button>

        <div className="flex flex-col items-center gap-4 opacity-40">
           <div className="flex items-center gap-4">
              <ShieldCheck size={14} className="text-gold" />
              <p className="text-[9px] font-black text-obsidian-900 uppercase tracking-[0.5em] italic">
                Vault Escrow Protection Active
              </p>
           </div>
           <p className="text-[8px] text-obsidian-300 uppercase tracking-widest text-center max-w-[320px] leading-relaxed">
             * By initiating, you notify the vault admin to monitor on-chain mempools for your signature. 
             Physical assets are reserved for 30 minutes.
           </p>
        </div>
      </div>
    </div>
  )
}

function SuccessUI() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-12 py-20 bg-white border border-ivory-300 rounded-[4rem] shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gold/[0.02] pointer-events-none" />
      
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gold/20 blur-3xl animate-pulse" />
        <div className="relative w-28 h-28 bg-white border border-gold/20 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="text-gold" size={56} strokeWidth={1} />
        </div>
      </div>

      <div className="space-y-6 px-10">
        <h3 className="text-5xl font-light text-obsidian-900 italic tracking-tighter uppercase leading-none">
          Transmission <span className="text-gold">Successful.</span>
        </h3>
        <p className="text-[12px] text-obsidian-400 uppercase tracking-[0.3em] font-black max-w-md mx-auto leading-relaxed italic">
          The Vault Admin has been dispatched to monitor the blockchain for your specific signature. You will receive a concierge alert once the asset is released for armored transit.
        </p>
      </div>

      <div className="pt-8 flex flex-col items-center gap-6">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-obsidian-900 text-gold px-12 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-gold hover:text-white transition-all duration-700 shadow-xl"
        >
          Return to Private Registry
        </button>
        <div className="flex items-center gap-3 opacity-30">
           <ShieldCheck size={12} className="text-gold" />
           <span className="text-[8px] font-bold uppercase tracking-widest">Sovereign Proof Issued</span>
        </div>
      </div>
    </motion.div>
  )
}