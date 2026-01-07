'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Clock, ShieldCheck, MapPin, 
  ExternalLink, CheckCircle2, Package, Loader2, FileDown,
  Hash, User, Globe, ChevronRight, Truck, ShoppingBag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
// Note: Keeping your PDF logic but renaming labels for the "Auvere Standard"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SovereignCertificate } from '@/components/admin/SovereignCertificate'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()

    // REAL-TIME PROTOCOL: Sync Ledger instantly when a client pays
    const channel = supabase
      .channel('live-orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchOrders() // Refresh list on any change
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
    
    if (error) alert('Error: Could not update fulfillment status')
  }

  return (
    <main className="space-y-10 pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-obsidian-900 font-serif italic">
          Order <span className="text-gold not-italic">Ledger.</span>
        </h2>
        <p className="label-caps text-obsidian-400">Live Transaction Management & Fulfillment</p>
      </header>

      {/* FEED */}
      <div className="space-y-6">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white border border-ivory-300 rounded-xl">
            <Loader2 className="text-gold animate-spin" size={32} />
            <p className="label-caps text-obsidian-400">Synchronizing Ledger</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <div className="p-20 bg-white border border-dashed border-ivory-300 rounded-xl flex flex-col items-center justify-center text-center gap-4">
                <Globe className="text-ivory-300" size={48} />
                <p className="label-caps text-obsidian-300">No active orders in registry</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
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
  const price = order.total_price || order.total_valuation || 0

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-ivory-300 rounded-xl p-8 md:p-10 hover:shadow-md transition-all group"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* I. CLIENT IDENTITY (3 Columns) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex items-center gap-2 text-gold">
             <User size={14} />
             <p className="text-[10px] font-bold uppercase tracking-widest">Client Name</p>
          </div>
          <h4 className="text-xl font-bold text-obsidian-900 uppercase tracking-tight truncate">
            {order.client_name || 'Verified Client'}
          </h4>
          <p className="text-[10px] text-obsidian-300 font-mono uppercase tracking-widest">
            ID: {order.id.slice(0, 12).toUpperCase()}
          </p>
        </div>

        {/* II. COMMERCIALS (3 Columns) */}
        <div className="lg:col-span-3 lg:border-l lg:border-ivory-100 lg:pl-10 space-y-2">
          <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">Order Value</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-medium text-obsidian-900 font-serif italic">
              ${Number(price).toLocaleString()}
            </span>
            <span className="text-[9px] px-2 py-0.5 bg-ivory-50 rounded text-obsidian-400 border border-ivory-200 font-bold uppercase">
              {order.items?.length || 0} Assets
            </span>
          </div>
          <p className="text-[9px] text-gold font-bold uppercase tracking-widest">{order.payment_method || 'Bank Wire'}</p>
        </div>

        {/* III. FULFILLMENT STATUS (3 Columns) */}
        <div className="lg:col-span-3 lg:border-l lg:border-ivory-100 lg:pl-10 space-y-3">
          <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">Fulfillment Phase</p>
          <div className="relative">
            <select 
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value)}
              className="w-full bg-ivory-50 border border-ivory-200 text-[10px] font-bold text-obsidian-900 uppercase tracking-widest rounded-lg px-4 py-3 outline-none focus:border-gold transition-all cursor-pointer appearance-none shadow-sm"
            >
              <option value="pending">Phase I: Processing</option>
              <option value="verifying">Phase II: Verifying Payment</option>
              <option value="logistics">Phase III: In Transit</option>
              <option value="delivered">Phase IV: Delivered</option>
              <option value="cancelled">Void Transaction</option>
            </select>
            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-300 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* IV. OPERATIONS (3 Columns) */}
        <div className="lg:col-span-3 flex justify-end gap-3">
          <PDFDownloadLink 
            document={<SovereignCertificate order={order} item={order.items?.[0]} />} 
            fileName={`LUME-INVOICE-${order.id.slice(0, 8)}.pdf`}
          >
            {({ loading }) => (
              <AdminActionBtn icon={loading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />} tooltip="Invoice" />
            )}
          </PDFDownloadLink>
          <AdminActionBtn icon={<Truck size={18} />} tooltip="Tracking" />
          <AdminActionBtn icon={<CheckCircle2 size={18} />} tooltip="Verify" />
          <AdminActionBtn icon={<ExternalLink size={18} />} tooltip="Details" />
        </div>

      </div>
    </motion.div>
  )
}

function AdminActionBtn({ icon, tooltip }: { icon: any, tooltip: string }) {
  return (
    <div className="relative group/tooltip">
      <button className="w-12 h-12 flex items-center justify-center bg-white border border-ivory-300 rounded-lg text-obsidian-400 hover:text-gold hover:border-gold transition-all shadow-sm">
        {icon}
      </button>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-obsidian-900 text-white text-[9px] font-bold uppercase px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        {tooltip}
      </span>
    </div>
  )
}