'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CertificateDownload from '@/components/ui/CertificateDownload'

export default function AcquisitionSuccess() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()
      setOrderData(data)
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex items-center justify-center">
      <Loader2 className="text-gold animate-spin" size={40} />
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 pt-40 pb-20 px-6 overflow-hidden">
      {/* Background Celebration Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-white border border-gold/20 rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-8"
        >
          <Crown className="text-gold" size={40} />
        </motion.div>

        <header className="space-y-6">
          <h3 className="text-[11px] uppercase tracking-[0.6em] text-gold font-black italic">Settlement Protocol Complete</h3>
          <h1 className="text-6xl md:text-[8rem] font-light text-obsidian-900 italic tracking-tighter leading-none">
            Ownership <br/> <span className="text-obsidian-400">Confirmed.</span>
          </h1>
          <p className="text-obsidian-600 text-xl font-light italic max-w-xl mx-auto">
            The blockchain handshake is finalized. Your assets are now secured in the Lume Private Registry and prepared for armored transit.
          </p>
        </header>

        {/* III. THE PRIMARY ACTION: Certificate Generation */}
        <div className="pt-12 flex flex-col items-center gap-8">
          {orderData?.items?.map((item: any, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
               <CertificateDownload order={orderData} item={item} />
            </motion.div>
          ))}
          
          <div className="flex items-center gap-8 pt-8">
            <Link href="/dashboard" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-400 hover:text-gold transition-colors">
              Enter Member Vault <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}