'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ShoppingBag, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { useSelectionStore } from '@/store/useSelectionStore'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// SUB-COMPONENTS
import IdentityStep from './IdentityStep'
import ShippingStep from './ShippingStep'
import PaymentStep from './PaymentStep'

export default function CheckoutPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const items = useSelectionStore((state) => state.items)
  const totalPrice = useSelectionStore((state) => state.getTotalPrice())

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '', // Updated to hold full country selection
    zipCode: '',
    paymentMethod: '',
    wallet_address: '', 
    payment_proof: ''   
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login?redirect=/checkout')
      } else {
        setUserId(session.user.id)
        setFormData(prev => ({ ...prev, email: session.user.email || '' }))
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      const trackingSignature = `LUME-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          client_name: formData.fullName,
          email: formData.email,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
          total_price: totalPrice,
          payment_method: formData.paymentMethod,
          wallet_address: formData.wallet_address,
          payment_proof: formData.payment_proof,
          items: items, 
          status: 'confirmed',
          tracking_number: trackingSignature,
          courier_name: 'Private Courier'
        })
        .select()
        .single()

      if (orderError) throw orderError

      await supabase.from('delivery_logs').insert({
        order_id: order.id,
        milestone: 'Order Placed',
        location: 'Online Store'
      })

      useSelectionStore.getState().clearBag()

      const isCrypto = ['BTC', 'ETH', 'USDT'].includes(formData.paymentMethod)
      router.push(isCrypto ? `/checkout/verification?orderId=${order.id}` : `/checkout/success?orderId=${order.id}`)
      
    } catch (err: any) {
      console.error("Checkout Failure:", err)
      alert("Error processing order. Please verify your details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingAuth) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading Checkout</p>
    </div>
  )

  if (items.length === 0) return (
    <main className="h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
      <ShoppingBag className="text-gray-200" size={48} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your bag is empty</p>
      <button onClick={() => router.push('/collection')} className="text-gold text-xs font-bold uppercase hover:underline">Return to Gallery</button>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* MOBILE SUMMARY TOGGLE */}
      <div className="lg:hidden sticky top-[95px] md:top-[100px] z-[90] bg-white border-b border-ivory-300 shadow-sm">
        <button 
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full px-6 py-5 flex justify-between items-center active:bg-ivory-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian-900">
              {isMobileSummaryOpen ? 'Close Summary' : `Order Summary ($${totalPrice.toLocaleString()})`}
            </span>
          </div>
          {isMobileSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        <AnimatePresence>
          {isMobileSummaryOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-ivory-50 border-t border-ivory-200"
            >
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[11px] uppercase tracking-tight">
                    <span className="text-obsidian-400 font-medium">{item.name} <span className="ml-1 text-gold">x{item.quantity}</span></span>
                    <span className="text-obsidian-900 font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-ivory-300 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-gold">Total</span>
                  <span className="text-xl font-serif italic font-bold text-obsidian-900">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-10 lg:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: PROGRESS & STEPS */}
        <div className="lg:col-span-7 space-y-12">
          <header className="flex items-center justify-between border-b border-gray-100 pb-10">
            <StepIndicator step={1} current={currentStep} label="Identity" />
            <div className="h-[1px] flex-1 bg-gray-200 mx-2 md:mx-4" />
            <StepIndicator step={2} current={currentStep} label="Shipping" />
            <div className="h-[1px] flex-1 bg-gray-200 mx-2 md:mx-4" />
            <StepIndicator step={3} current={currentStep} label="Payment" />
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-gray-100 rounded-[2rem] md:rounded-3xl p-6 md:p-12 shadow-sm"
            >
              {currentStep === 1 && <IdentityStep data={formData} update={setFormData} onNext={() => setCurrentStep(2)} />}
              {currentStep === 2 && <ShippingStep data={formData} update={setFormData} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
              {currentStep === 3 && <PaymentStep data={formData} update={setFormData} onBack={() => setCurrentStep(2)} onComplete={handleFinalSubmit} isSubmitting={isSubmitting} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: DESKTOP SUMMARY */}
        <aside className="hidden lg:block lg:col-span-5">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-gray-50 pb-4">Order Summary</h4>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      {item.quantity > 1 && (
                          <span className="absolute top-1 right-1 bg-black text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">x{item.quantity}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] text-gold font-bold uppercase tracking-tighter">{item.category}</p>
                      <h5 className="text-black text-xs font-bold uppercase tracking-tight">{item.name}</h5>
                      <p className="text-black font-sans text-xs mt-1 font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-600 tracking-widest uppercase">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold text-black uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-bold text-black font-serif italic">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-black text-white rounded-2xl flex gap-4 items-start shadow-xl border border-gold/20">
              <ShieldCheck className="text-gold shrink-0" size={20} />
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-tight">
                This transaction is secure and encrypted. We do not store your payment credentials.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function StepIndicator({ step, current, label }: { step: number, current: number, label: string }) {
  const active = current === step
  const completed = current > step
  
  return (
    <div className={`flex flex-col items-center gap-3 transition-all ${active || completed ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
        active ? 'border-gold bg-black text-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]' : completed ? 'border-gold bg-gold text-white' : 'border-gray-200 text-gray-300'
      }`}>
        {completed ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{step}</span>}
      </div>
      <span className="hidden xs:block text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  )
}