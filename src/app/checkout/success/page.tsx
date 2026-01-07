'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Loader2, ShoppingBag, Truck, Landmark, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()
        
      if (data) setOrderData(data)
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

  // Safety redirect if someone tries to access /success without an ID
  if (!loading && !orderId) {
    router.push('/collection')
    return null
  }

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex items-center justify-center">
      <Loader2 className="text-gold animate-spin" size={40} />
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6 relative overflow-hidden selection:bg-gold selection:text-white">
      {/* Opulent Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/10 to-transparent pointer-events-none opacity-50" />

      <div className="max-w-3xl mx-auto text-center space-y-16 relative z-10">
        
        {/* SUCCESS ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
          className="w-24 h-24 bg-white border border-ivory-300 rounded-full shadow-2xl flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="text-gold" size={48} strokeWidth={1} />
        </motion.div>

        {/* HEADER */}
        <header className="space-y-6">
          <div className="space-y-2">
            <p className="label-caps text-gold">Acquisition Secured</p>
            <h1 className="text-6xl md:text-[5.5rem] font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
              Welcome to <br/> the <span className="text-gold not-italic">Vault.</span>
            </h1>
          </div>
          
          <p className="text-obsidian-600 text-lg font-medium max-w-xl mx-auto leading-relaxed italic">
            Your pieces have been physically reserved. Our concierge team is now preparing your collection for insured, white-glove transit.
          </p>
        </header>

        {/* ORDER SUMMARY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-ivory-300 rounded-[2.5rem] p-10 md:p-14 shadow-sm text-left space-y-12"
        >
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-ivory-100 pb-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.3em]">Registry Signature</p>
              <p className="text-xs font-mono font-bold text-obsidian-900 uppercase tracking-tighter">
                #{orderId?.slice(0, 14).toUpperCase() || 'LV-PENDING'}
              </p>
            </div>
            <div className="space-y-2 md:text-right">
              <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.3em]">Estimated Release</p>
              <p className="text-xs font-bold text-obsidian-900 uppercase">24-48 Hours</p>
            </div>
          </div>

          {/* BENEFIT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <BenefitItem 
               icon={<Truck size={20} />} 
               title="Insured Transit" 
               desc="B6-level armored delivery protocol." 
             />
             <BenefitItem 
               icon={<Landmark size={20} />} 
               title="Asset Provenance" 
               desc="Logged in our permanent physical registry." 
             />
             <BenefitItem 
               icon={<ShieldCheck size={20} />} 
               title="Secured Custody" 
               desc="Dual-signature vault verification." 
             />
             <BenefitItem 
               icon={<ShoppingBag size={20} />} 
               title="Signature Packing" 
               desc="Lume Vault heritage presentation." 
             />
          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="pt-10 flex flex-col items-center gap-8">
          <Link 
            href="/dashboard" 
            className="w-full md:w-auto px-16 py-6 bg-obsidian-900 text-gold text-[11px] font-black uppercase tracking-[0.4em] rounded-lg hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl"
          >
            Manage My Collection
          </Link>
          
          <Link 
            href="/collection" 
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-400 hover:text-obsidian-900 transition-colors"
          >
            Continue Acquisition <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  )
}

function BenefitItem({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="text-gold p-3 bg-ivory-50 rounded-xl border border-ivory-200 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-[11px] font-black text-obsidian-900 uppercase tracking-widest">{title}</h4>
                <p className="text-[10px] text-obsidian-500 font-bold uppercase tracking-tighter leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    )
}