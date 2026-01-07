'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, CreditCard, Lock, ShoppingBag, Loader2, Truck, CheckCircle2 } from 'lucide-react'
import { useSelectionStore } from '@/store/useSelectionStore'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// COMPONENTS
import IdentityStep from '@/app/checkout/IdentityStep' // Re-purposed as "Review"
import ShippingStep from '@/app/checkout/ShippingStep'
import PaymentStep from '@/app/checkout/PaymentStep'

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const items = useSelectionStore((state) => state.items)
  const totalPrice = useSelectionStore((state) => state.getTotalPrice())
  const router = useRouter()

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
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="label-caps text-obsidian-400">Verifying Secure Session</p>
    </div>
  )

  if (items.length === 0) {
    return (
      <main className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
        <div className="p-6 bg-white rounded-full border border-ivory-300">
          <ShoppingBag className="text-ivory-300" size={40} />
        </div>
        <p className="label-caps text-obsidian-300">Your bag is currently empty</p>
        <button 
          onClick={() => router.push('/collection')} 
          className="text-gold text-xs font-bold uppercase tracking-widest hover:underline"
        >
          Return to Collection
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-24 md:pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
        
        {/* LEFT: THE STEPS */}
        <div className="lg:col-span-7 space-y-12">
          <header className="flex items-center justify-between border-b border-ivory-300 pb-10">
            <StepIndicator step={1} current={currentStep} label="Shipping" />
            <div className="h-[1px] flex-1 bg-ivory-300 mx-4 md:mx-10" />
            <StepIndicator step={2} current={currentStep} label="Payment" />
            <div className="h-[1px] flex-1 bg-ivory-300 mx-4 md:mx-10" />
            <StepIndicator step={3} current={currentStep} label="Review" />
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-ivory-300 rounded-2xl p-8 md:p-12 shadow-sm"
            >
              {currentStep === 1 && (
                <ShippingStep onNext={() => setCurrentStep(2)} onBack={() => router.push('/collection')} />
              )}
              {currentStep === 2 && (
                <PaymentStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
              )}
              {currentStep === 3 && (
                <IdentityStep onBack={() => setCurrentStep(2)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="bg-white border border-ivory-300 rounded-2xl p-8 md:p-10 shadow-sm space-y-8">
              <h4 className="label-caps text-obsidian-900 border-b border-ivory-100 pb-4">Order Summary</h4>
              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-ivory-100 border border-ivory-200 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest">{item.category}</p>
                      <h5 className="text-obsidian-900 text-xs font-bold uppercase tracking-tight">{item.name}</h5>
                      <p className="text-obsidian-900 font-medium text-xs">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-ivory-100 pt-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-medium text-obsidian-400">
                  <span>Shipping & Insurance</span>
                  <span className="text-gold font-bold uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-obsidian-900 uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-medium text-obsidian-900 font-serif italic tracking-tight">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-ivory-300 rounded-xl flex gap-4 items-start">
              <Lock className="text-gold shrink-0" size={20} />
              <p className="text-[10px] text-obsidian-600 leading-relaxed font-medium">
                Protected by SSL encryption. All shipments are fully insured and require a signature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function StepIndicator({ step, current, label }: { step: number, current: number, label: string }) {
  const active = current === step
  const completed = current > step
  
  return (
    <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${active || completed ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
        active 
        ? 'border-gold bg-obsidian-900 text-gold shadow-lg scale-110' 
        : completed 
        ? 'border-gold bg-gold text-white' 
        : 'border-ivory-300 text-obsidian-200'
      }`}>
        {completed ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{step}</span>}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-obsidian-900' : 'text-obsidian-400'}`}>
        {label}
      </span>
    </div>
  )
}