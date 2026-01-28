'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Loader2, ShoppingBag, Truck, Landmark, ShieldCheck, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function OrderSuccessPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()
        
      if (data) setOrderData(data)
      setLoading(false)
    }
    fetchOrder()
  }, [orderId, supabase])

  if (!loading && !orderId) {
    router.push('/collection')
    return null
  }

  if (loading) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Processing Order</p>
    </div>
  )

  // Check if payment requires manual verification (Bank Wire, etc.)
  const isManual = orderData?.payment_method && !['BTC', 'ETH', 'USDT'].includes(orderData.payment_method)

  return (
    <main className="min-h-screen bg-ivory-50 pt-24 md:pt-32 pb-20 px-4 md:px-6 relative overflow-hidden font-sans">
      {/* Subtle Premium Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-12 md:space-y-16 relative z-10">
        
        {/* STATUS ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 md:w-24 md:h-24 bg-white border border-gray-100 rounded-full shadow-2xl flex items-center justify-center mx-auto"
        >
          {isManual ? (
            <Clock 
              className="text-gold w-8 h-8 md:w-10 md:h-10" 
              strokeWidth={1.5} 
            />
          ) : (
            <CheckCircle2 
              className="text-gold w-8 h-8 md:w-10 md:h-10" 
              strokeWidth={1.5} 
            />
          )}
        </motion.div>

        {/* HEADER */}
        <header className="space-y-6">
          <div className="space-y-2">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              {isManual ? "Payment Under Review" : "Order Confirmed"}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-obsidian-900 font-serif italic tracking-tight leading-none px-4">
              Thank <span className="text-gold not-italic">You.</span>
            </h1>
          </div>
          
          <p className="text-gray-600 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed px-4">
            {isManual 
              ? "We have received your order. Our team is currently verifying your payment details and will update your status shortly."
              : "Your order has been successfully placed. We are now preparing your items for secure, insured delivery."
            }
          </p>
        </header>

        {/* ORDER SUMMARY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 shadow-xl text-left space-y-10"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-gray-50 pb-10">
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order Number</p>
              <p className="text-lg md:text-xl font-mono font-bold text-obsidian-900 tracking-tighter">
                {orderData?.tracking_number || "PENDING"}
              </p>
            </div>
            <div className="space-y-2 md:text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</p>
              <div className="flex items-center md:justify-end gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isManual ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                  <p className={`text-xs font-bold uppercase tracking-widest ${isManual ? 'text-amber-600' : 'text-green-600'}`}>
                    {isManual ? 'Pending Verification' : 'Confirmed'}
                  </p>
              </div>
            </div>
          </div>

          {/* SERVICE BENEFITS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
             <BenefitItem 
               icon={<Truck size={18} />} 
               title="Secure Shipping" 
               desc="Tracked and insured global delivery." 
             />
             <BenefitItem 
               icon={<ShieldCheck size={18} />} 
               title="Full Insurance" 
               desc="Covered until the moment of delivery." 
             />
             <BenefitItem 
               icon={<Landmark size={18} />} 
               title="Authenticity" 
               desc="Certified documents included." 
             />
             <BenefitItem 
               icon={<ShoppingBag size={18} />} 
               title="Premium Packaging" 
               desc="Signature Lume Vault presentation." 
             />
          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="pt-6 flex flex-col items-center gap-6 md:gap-8 px-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Link 
              href={`/track?id=${orderData?.tracking_number}`} 
              className="w-full md:px-10 py-4 bg-gold text-obsidian-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-obsidian-900 hover:text-white transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
            >
              <Search size={14} /> Track Order
            </Link>
            
            <Link 
              href="/dashboard" 
              className="w-full md:px-10 py-4 bg-obsidian-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gold hover:text-obsidian-900 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
            >
              View Dashboard
            </Link>
          </div>
          
          <Link 
            href="/collection" 
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-obsidian-900 transition-colors"
          >
            Return to Gallery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> 
          </Link>
        </div>

      </div>
    </main>
  )
}

function BenefitItem({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4 md:gap-5 items-start group">
            <div className="text-gold p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-500 flex-shrink-0">
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-[10px] md:text-[11px] font-bold text-obsidian-900 uppercase tracking-widest">{title}</h4>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    )
}