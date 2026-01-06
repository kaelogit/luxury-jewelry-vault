'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSelectionStore } from '@/store/useSelectionStore'
import { 
  ShieldCheck, Zap, Loader2, 
  ArrowLeft, Copy, Fingerprint, 
  Bitcoin, Coins, Check, ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PaymentStepProps {
  onBack: () => void;
}

// I. SETTLEMENT REGISTRY: Institutional Wallet Signatures
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
    network: "TRC-20" 
  }
]

export default function PaymentStep({ onBack }: PaymentStepProps) {
  const router = useRouter()
  const { items, getTotalPrice, clearVault } = useSelectionStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeRail, setActiveRail] = useState(PAYMENT_RAILS[0])
  const [copyStatus, setCopyStatus] = useState('COPY SIGNATURE')

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

      const { data, error } = await supabase.from('orders').insert([{
        client_id: user.id,
        total_valuation: getTotalPrice(),
        items: items,
        status: 'pending',
        payment_method: activeRail.symbol,
        tx_hash: 'Awaiting Settlement...'
      }]).select().single()

      if (error) throw error
      clearVault()
      router.push(`/checkout/success?id=${data.id}`)
      
    } catch (error: any) {
      console.error("Settlement Failure", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* NAVIGATION */}
      <button 
        onClick={onBack} 
        className="group flex items-center gap-3 text-[10px] font-black text-obsidian-300 uppercase tracking-widest hover:text-gold transition-all"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Logistics
      </button>

      {/* HEADER */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic">Settlement Protocol</h3>
        </div>
        <h2 className="text-4xl md:text-5xl font-light text-obsidian-900 italic tracking-tighter">
          Financial <span className="text-obsidian-400">Settlement.</span>
        </h2>
      </header>

      {/* II. RAIL SELECTOR: The Multi-Option Interface */}
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
            <span className="text-[9px] font-black uppercase tracking-widest">{rail.symbol}</span>
          </button>
        ))}
      </div>

      {/* III. SETTLEMENT MANIFEST */}
      <div className="bg-white border border-ivory-300 rounded-[3rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRail.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-[0.3em] italic">
                  {activeRail.label} Signature <span className="text-gold/40">[{activeRail.network}]</span>
                </p>
                <button 
                  onClick={copyToClipboard}
                  className="text-[8px] font-black text-gold uppercase tracking-widest hover:text-obsidian-900 transition-colors flex items-center gap-2"
                >
                  <Copy size={10} /> {copyStatus}
                </button>
              </div>
              <p className="text-sm font-mono text-obsidian-900 break-all bg-ivory-50 p-8 rounded-[2rem] border border-ivory-200 shadow-inner leading-relaxed text-center italic">
                {activeRail.address}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Valuation Total */}
        <div className="flex justify-between items-end border-t border-ivory-100 pt-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-obsidian-200 uppercase tracking-[0.4em] italic leading-none">Final Acquisition Value</p>
            <p className="text-5xl font-light text-obsidian-900 italic tracking-tighter leading-none">
              ${getTotalPrice().toLocaleString()}
            </p>
          </div>
          <div className="w-16 h-16 bg-ivory-50 rounded-2xl flex items-center justify-center text-gold border border-gold/10">
            <Fingerprint size={28} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* ACTION COMMAND */}
      <div className="space-y-8">
        <button 
          onClick={handleFinalizeIntent} 
          disabled={isProcessing} 
          className="group relative w-full h-[92px] bg-obsidian-900 text-gold rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-6 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95 disabled:opacity-30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isProcessing ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Confirm Transfer Handshake 
              <Zap size={18} className="group-hover:fill-current transition-all" />
            </>
          )}
        </button>
        
        <div className="flex flex-col items-center gap-4 opacity-40">
           <div className="flex items-center gap-4">
              <ShieldCheck size={14} className="text-gold" />
              <p className="text-[9px] font-black text-obsidian-900 uppercase tracking-[0.5em] italic">
                Vault Escrow Protection Active
              </p>
           </div>
           <p className="text-[8px] text-obsidian-300 uppercase tracking-widest text-center max-w-[280px] leading-relaxed">
             Transfer verification occurs on-chain. <br/> Do not close this terminal until handshake is confirmed.
           </p>
        </div>
      </div>

    </div>
  )
}