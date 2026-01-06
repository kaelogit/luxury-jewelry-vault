'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Activity, Clock, ShieldCheck, MapPin, 
  ExternalLink, CheckCircle2, AlertCircle, Package, Loader2, FileDown,
  Hash, DollarSign, User, Globe, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SovereignCertificate } from '@/components/admin/SovereignCertificate'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('live-orders')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        setOrders(prev => [payload.new, ...prev])
      })
      .on('postgres_changes', {
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error("Vault Access Error:", error)
    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    
    if (error) alert('Protocol Error: Could not update status')
  }

  return (
    <main className="min-h-screen bg-ivory-100 p-8 md:p-14 space-y-12 selection:bg-gold selection:text-white">
      
      {/* 1. REGISTRY HEADER */}
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_gold] animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-light text-obsidian-900 italic tracking-tighter">
            Acquisition <span className="text-obsidian-400">Registry.</span>
          </h1>
        </div>
        <p className="text-[11px] text-gold uppercase tracking-[0.5em] font-black italic border-l-2 border-gold pl-6">
          Live Transaction Mempool • Sovereign Encryption Active
        </p>
      </header>

      {/* 2. ORDER FEED */}
      <div className="space-y-10">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-8 border border-ivory-300 rounded-[4rem] bg-white shadow-inner">
            <Loader2 className="text-gold animate-spin" size={48} />
            <p className="text-[11px] text-obsidian-400 uppercase tracking-[0.8em] font-black italic">Synchronizing Ledger...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-32 bg-white border border-dashed border-ivory-300 rounded-[4rem] flex flex-col items-center justify-center text-center gap-6"
              >
                <Globe className="text-ivory-300" size={64} />
                <p className="text-[12px] text-obsidian-300 uppercase tracking-[0.6em] font-black italic">
                  Awaiting Global Signatures...
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} onStatusUpdate={updateStatus} />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  )
}

function OrderCard({ order, onStatusUpdate }: { order: any, onStatusUpdate: any }) {
  const valuation = typeof order.total_valuation === 'string' 
    ? parseFloat(order.total_valuation) 
    : order.total_valuation

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white border border-ivory-300 rounded-[3.5rem] p-10 md:p-14 hover:border-gold/30 transition-all duration-700 shadow-sm hover:shadow-2xl group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center relative z-10">
        
        {/* I. MEMBER IDENTITY */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gold">
             <User size={14} />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sovereign Client</p>
          </div>
          <h4 className="text-2xl font-light text-obsidian-900 uppercase tracking-tighter italic">{order.client_name}</h4>
          <div className="flex items-center gap-2 text-[10px] text-obsidian-300 font-mono">
            <Hash size={10} />
            <span>{order.id.slice(0, 18).toUpperCase()}</span>
          </div>
        </div>

        {/* II. VALUATION & ASSETS */}
        <div className="space-y-4 lg:border-l lg:border-ivory-200 lg:pl-12">
          <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.4em]">Portfolio Value</p>
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-mono text-obsidian-900 tracking-tighter italic font-bold">
              ${valuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] px-3 py-1 bg-ivory-100 rounded-full text-obsidian-600 border border-ivory-200 uppercase font-black tracking-widest">
              {Array.isArray(order.items) ? order.items.length : 0} ASSETS
            </span>
          </div>
        </div>

        {/* III. STATUS PROTOCOL */}
        <div className="space-y-4 lg:border-l lg:border-ivory-200 lg:pl-12">
          <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.4em]">Handshake Status</p>
          <div className="relative group/select">
            <select 
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value)}
              className="w-full bg-ivory-50 border border-ivory-300 text-[11px] font-black text-gold uppercase tracking-[0.2em] rounded-2xl px-6 py-4 outline-none focus:border-gold transition-all cursor-pointer appearance-none shadow-inner"
            >
              <option value="pending">Phase I: Pending</option>
              <option value="verifying">Phase II: Verification</option>
              <option value="logistics">Phase III: Logistics</option>
              <option value="delivered">Phase IV: Settled</option>
              <option value="cancelled">VOID TRANSACTION</option>
            </select>
            <ChevronRight size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gold rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* IV. COMMAND ACTIONS */}
        <div className="flex justify-end gap-5">
          {/* GOLD PDF DOWNLOAD */}
          <div className="relative group/tooltip">
            <PDFDownloadLink 
              document={<SovereignCertificate order={order} item={order.items[0]} />} 
              fileName={`LUME-COA-${order.id.slice(0, 8)}.pdf`}
            >
              {({ loading }) => (
                <button className="w-16 h-16 flex items-center justify-center bg-obsidian-900 text-gold rounded-2xl hover:bg-gold hover:text-white transition-all duration-500 shadow-xl group/btn">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={22} className="group-hover/btn:scale-110 transition-transform" />}
                </button>
              )}
            </PDFDownloadLink>
            <Tooltip label="Generate COA" />
          </div>

          <AdminActionButton icon={<MapPin size={20} />} tooltip="Tracking" />
          <AdminActionButton icon={<ShieldCheck size={20} />} tooltip="Audit" />
          <AdminActionButton icon={<ExternalLink size={20} />} tooltip="Explorer" />
        </div>
      </div>
    </motion.div>
  )
}

function AdminActionButton({ icon, tooltip }: { icon: any, tooltip: string }) {
  return (
    <div className="relative group/tooltip">
      <button className="w-16 h-16 flex items-center justify-center bg-ivory-100 border border-ivory-300 rounded-2xl text-obsidian-400 hover:text-obsidian-900 hover:border-gold transition-all duration-500 shadow-sm group/btn">
        <div className="group-hover/btn:scale-110 transition-transform">{icon}</div>
      </button>
      <Tooltip label={tooltip} />
    </div>
  )
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-obsidian-900 text-gold text-[9px] font-black uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl tracking-[0.2em] border border-gold/20">
      {label}
    </span>
  )
}