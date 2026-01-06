'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, MapPin, Zap, Lock, ArrowRight, ChevronLeft, Globe, ShoppingBag, Loader2 } from 'lucide-react'
import { useSelectionStore } from '@/store/useSelectionStore'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// Step Components (Audited for Pearl & Gold)
import IdentityStep from '@/app/checkout/IdentityStep'
import ShippingStep from '@/app/checkout/ShippingStep'
import PaymentStep from '@/app/checkout/PaymentStep'

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const items = useSelectionStore((state) => state.items)
  const totalPrice = useSelectionStore((state) => state.getTotalPrice())
  const router = useRouter()

  // 1. SECURITY HANDSHAKE: Gating Checkout for Members Only
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login?redirect=/checkout')
      } else {
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  if (loadingAuth) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-gold animate-spin" size={40} />
      <p className="text-[10px] text-obsidian-400 uppercase tracking-[0.5em] font-black italic">Authorizing Secure Session...</p>
    </div>
  )

  if (items.length === 0) {
    return (
      <main className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-8">
        <div className="p-8 bg-white rounded-full border border-ivory-300 shadow-sm">
          <ShoppingBag className="text-ivory-300" size={48} />
        </div>
        <p className="text-obsidian-300 uppercase tracking-[0.6em] text-[10px] font-black italic">The Vault is currently empty</p>
        <button onClick={() => router.push('/collection')} className="text-gold text-[10px] font-black uppercase tracking-widest border-b border-gold/30 pb-1">Return to Inventory</button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 md:pt-48 pb-20 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
        
        {/* LEFT: THE SETTLEMENT PROTOCOL (7 Columns) */}
        <div className="lg:col-span-7 space-y-16">
          
          {/* Progress Protocol: High-Contrast Gold Stepper */}
          <header className="flex items-center justify-between border-b border-ivory-300 pb-12">
            <StepIndicator step={1} current={currentStep} label="Identity" icon={<Lock size={12}/>} />
            <div className="h-[1px] flex-1 bg-ivory-300 mx-8" />
            <StepIndicator step={2} current={currentStep} label="Logistics" icon={<MapPin size={12}/>} />
            <div className="h-[1px] flex-1 bg-ivory-300 mx-8" />
            <StepIndicator step={3} current={currentStep} label="Settlement" icon={<Zap size={12}/>} />
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentStep === 1 && <IdentityStep onNext={() => setCurrentStep(2)} />}
              {currentStep === 2 && <ShippingStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
              {currentStep === 3 && <PaymentStep onBack={() => setCurrentStep(2)} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: THE VALUATION SUMMARY (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="sticky top-40 p-12 bg-white border border-ivory-300 rounded-[4rem] space-y-10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-ivory-200 pb-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-obsidian-400 italic">Acquisition Manifest</h4>
              <Globe size={18} className="text-gold opacity-30" />
            </div>
            
            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-8 items-center group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-ivory-100 border border-ivory-300 shadow-inner">
                    <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.title} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gold font-black uppercase tracking-[0.3em] italic">{item.asset_class}</p>
                    <h5 className="text-obsidian-900 text-sm font-bold uppercase tracking-tight italic">{item.title}</h5>
                    <p className="text-obsidian-400 font-mono text-[10px] font-bold uppercase tracking-tighter italic">${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ivory-200 pt-10 space-y-6">
              <div className="flex justify-between items-center text-obsidian-400 text-[10px] font-black uppercase tracking-widest italic">
                <span>Protocol & Logistics Fee</span>
                <span className="text-gold font-mono">Gratis</span>
              </div>
              <div className="flex justify-between items-end bg-ivory-50 p-8 rounded-3xl border border-ivory-300 shadow-inner">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.3em] italic">Total Portfolio Value</span>
                  <div className="h-1 w-8 bg-gold/30 rounded-full" />
                </div>
                <span className="text-4xl font-light text-obsidian-900 italic tracking-tighter">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-6 bg-gold/5 border border-gold/10 rounded-3xl flex gap-5 items-center">
              <ShieldCheck className="text-gold" size={24} />
              <p className="text-[10px] text-gold font-black uppercase tracking-widest leading-relaxed italic">
                Assets are physically reserved in the vault for 30 minutes to facilitate cryptographic settlement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function StepIndicator({ step, current, label, icon }: any) {
  const active = current === step
  const completed = current > step
  
  return (
    <div className={`flex items-center gap-4 transition-all duration-700 ${active || completed ? 'opacity-100' : 'opacity-20'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
        active 
        ? 'border-gold bg-obsidian-900 text-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-110' 
        : completed 
        ? 'border-gold bg-gold text-white' 
        : 'border-ivory-300 text-obsidian-200'
      }`}>
        {completed ? <Zap size={14} fill="currentColor" /> : <span className="text-[11px] font-black">{step}</span>}
      </div>
      <div className="flex flex-col">
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] hidden md:block ${active ? 'text-obsidian-900 italic' : 'text-obsidian-400'}`}>
          {label}
        </span>
      </div>
    </div>
  )
}