'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, CheckCircle2, Loader2, Globe, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentVerificationPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [status, setStatus] = useState<'scanning' | 'detected' | 'confirmed'>('scanning')
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // I. FETCH ORDER & WALLET DETAILS
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) {
      setError("Vault Synchronization Error")
      return
    }

    // AUDIT FIX: If order is already confirmed, skip verification and go to success
    if (data.status === 'confirmed' || data.status === 'dispatched' || data.status === 'delivered') {
        router.push(`/checkout/success?orderId=${orderId}`)
        return
    }

    setOrder(data)
  }, [orderId, supabase, router])

  useEffect(() => { fetchOrderDetails() }, [fetchOrderDetails])

  // II. THE REAL BLOCKCHAIN WATCHER
  useEffect(() => {
    if (!order || status === 'confirmed') return

    const checkBlockchain = async () => {
      try {
        const method = order.payment_method?.toUpperCase()
        let endpoint = ''

        // Dynamic API endpoints based on selection
        if (method === 'BTC') {
          endpoint = `https://api.blockcypher.com/v1/btc/main/addrs/${order.wallet_address}/balance`
        } else if (method === 'ETH' || method === 'USDT') {
          endpoint = `https://api.blockcypher.com/v1/eth/main/addrs/${order.wallet_address}/balance`
        } else {
          return // Manual methods don't use the blockchain watcher
        }

        const response = await fetch(endpoint)
        const blockchainData = await response.json()

        // logic: Detection based on unconfirmed vs confirmed balance
        if (blockchainData.total_received > 0) {
          setStatus('detected')
          
          // Move to confirmed if there are no pending tx or at least 1 confirmation
          if (blockchainData.n_tx > 0 && blockchainData.unconfirmed_n_tx === 0) {
            await finalizeOrder()
          }
        }
      } catch (err) {
        console.error("Blockchain Fetch Error:", err)
      }
    }

    const finalizeOrder = async () => {
      // 1. Update Order Status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId)

      if (!updateError) {
        // 2. AUDIT FIX: Update Delivery Logs for the "Perfect Line"
        await supabase.from('delivery_logs').insert({
            order_id: orderId,
            milestone: 'Payment Verified via Network Consensus',
            location: 'Global Mainnet Node'
        })

        setStatus('confirmed')
        setTimeout(() => router.push(`/checkout/success?orderId=${orderId}`), 3000)
      }
    }

    const interval = setInterval(checkBlockchain, 15000)
    return () => clearInterval(interval)
  }, [order, status, orderId, router, supabase])

  if (!orderId) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="uppercase font-black text-[10px] tracking-[0.4em] text-red-500">Invalid Registry ID</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-12">
        
        {/* HEADER */}
        <header className="text-center space-y-6">
          <div className="inline-flex p-8 bg-white rounded-full border border-ivory-200 shadow-xl relative">
            <div className="absolute inset-0 bg-gold/5 animate-pulse rounded-full" />
            {status === 'confirmed' ? (
              <CheckCircle2 className="text-gold relative z-10" size={48} strokeWidth={1} />
            ) : (
              <Activity className="text-gold animate-pulse relative z-10" size={48} strokeWidth={1} />
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-obsidian-900 font-serif italic tracking-tight">
              Network <span className="text-gold not-italic">Consensus</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              Scanning {order?.payment_method} Ledger • Order #{orderId.slice(0, 8)}
            </p>
          </div>
        </header>

        {/* STATUS TERMINAL */}
        <div className="bg-white border border-ivory-200 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="space-y-6">
            <StatusRow 
              label="Scanning Network Nodes" 
              active={status === 'scanning'} 
              done={status !== 'scanning'} 
            />
            <StatusRow 
              label="Transaction Detected" 
              active={status === 'detected'} 
              done={status === 'confirmed'} 
            />
            <StatusRow 
              label="Authenticating Asset Allocation" 
              active={status === 'confirmed'} 
              done={status === 'confirmed'} 
            />
          </div>

          <div className="pt-8 border-t border-ivory-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-gold" />
              <span className="text-[9px] font-bold text-obsidian-900 uppercase tracking-widest">Protocol Secured</span>
            </div>
            <div className="flex items-center gap-2">
                <Globe size={12} className="text-gray-300" />
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Mainnet Live</span>
            </div>
          </div>
        </div>

        {/* ERROR HANDLING */}
        {error && <p className="text-center text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</p>}

        {/* FOOTER NOTICE */}
        <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed px-10">
          This secure window will automatically update upon network confirmation. 
          Please maintain this connection until the handshake is finalized.
        </p>
      </div>
    </main>
  )
}

function StatusRow({ label, active, done }: { label: string, active: boolean, done: boolean }) {
  return (
    <div className={`flex items-center gap-5 transition-all duration-700 ${active || done ? 'opacity-100' : 'opacity-20'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-gold shadow-[0_0_10px_gold]' : active ? 'bg-gold animate-pulse' : 'bg-gray-200'}`} />
      <span className={`text-[11px] font-bold uppercase tracking-widest flex-1 ${done ? 'text-gray-300 line-through' : 'text-obsidian-900'}`}>
        {label}
      </span>
      {active && !done && <Loader2 size={14} className="text-gold animate-spin" />}
      {done && <CheckCircle2 size={16} className="text-gold" />}
    </div>
  )
}