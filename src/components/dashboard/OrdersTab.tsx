'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, FileText, MapPin, 
  ShieldCheck, Clock, Loader2, 
  ShoppingBag, CheckCircle2, Truck
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id) // Corrected to user_id to match our new schema
          .order('created_at', { ascending: false })
        setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="label-caps text-obsidian-400">Loading Order History</p>
    </div>
  )

  if (orders.length === 0) return (
    <div className="py-32 text-center space-y-6">
      <div className="w-16 h-16 bg-white border border-ivory-300 rounded-full flex items-center justify-center mx-auto opacity-40">
        <ShoppingBag size={24} className="text-obsidian-300" />
      </div>
      <div className="space-y-2">
        <h4 className="text-2xl font-medium text-obsidian-900 font-serif italic">No Orders Found</h4>
        <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">Your collection history is currently empty.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <p className="label-caps text-gold">Purchase History</p>
        <div className="h-[1px] flex-1 bg-ivory-300" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order, i) => (
          <OrderCard key={order.id} order={order} index={i} />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, index }: { order: any, index: number }) {
  const [expanded, setExpanded] = useState(false)

  // Mapping DB status to Luxury Labels
  const statusConfig: Record<string, { label: string, icon: any }> = {
    pending: { label: 'Processing', icon: <Clock size={12} /> },
    shipped: { label: 'In Transit', icon: <Truck size={12} /> },
    delivered: { label: 'Delivered', icon: <CheckCircle2 size={12} /> }
  }

  const currentStatus = statusConfig[order.status] || statusConfig.pending

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-ivory-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* CARD HEADER */}
      <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-6 items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Order Number</p>
            <h4 className="text-lg font-bold text-obsidian-900 uppercase tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</h4>
            <p className="text-[10px] text-obsidian-400 font-medium uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest mb-1">Total</p>
            <p className="text-xl font-medium text-obsidian-900 font-serif italic">${Number(order.total_price || order.total_valuation).toLocaleString()}</p>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${order.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-ivory-100 border-gold/10 text-gold'}`}>
             {currentStatus.icon}
             <span className="text-[9px] font-bold uppercase tracking-widest">{currentStatus.label}</span>
          </div>

          <button 
            onClick={() => setExpanded(!expanded)}
            className={`w-10 h-10 rounded-full border border-ivory-300 flex items-center justify-center transition-colors ${expanded ? 'bg-obsidian-900 text-white' : 'hover:border-gold hover:text-gold'}`}
          >
            <ChevronRight className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} size={16} />
          </button>
        </div>
      </div>

      {/* EXPANDABLE CONTENT */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-ivory-50/30"
          >
            <div className="p-8 border-t border-ivory-200 space-y-8">
              
              {/* ITEM LIST */}
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-6 bg-white p-4 rounded-lg border border-ivory-200">
                    <div className="flex items-center gap-4">
                       <img src={item.image} className="w-14 h-16 object-cover rounded border border-ivory-100" alt={item.name} />
                       <div className="space-y-1">
                          <p className="text-[8px] font-bold text-gold uppercase tracking-widest">{item.category}</p>
                          <h5 className="text-xs font-bold text-obsidian-900 uppercase tracking-tight">{item.name || item.title}</h5>
                          <p className="text-[10px] text-obsidian-400 font-medium">${Number(item.price).toLocaleString()}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIONS & DOCS */}
              <div className="pt-6 border-t border-ivory-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-5 py-3 bg-white border border-ivory-300 rounded-lg text-[9px] font-bold uppercase tracking-widest text-obsidian-600 hover:text-gold hover:border-gold transition-all shadow-sm">
                    <FileText size={14} strokeWidth={1.5} /> View Invoice
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 bg-white border border-ivory-300 rounded-lg text-[9px] font-bold uppercase tracking-widest text-obsidian-600 hover:text-gold hover:border-gold transition-all shadow-sm">
                    <MapPin size={14} strokeWidth={1.5} /> Track Package
                  </button>
                </div>

                <div className="flex items-center gap-2 opacity-50">
                  <ShieldCheck className="text-gold" size={14} />
                  <span className="text-[9px] font-bold text-obsidian-900 uppercase tracking-widest">Insured & Authenticated</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}