'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, FileText, MapPin, 
  ShieldCheck, Clock, Loader2, 
  ShoppingBag, CheckCircle2, Truck, Package,
  AlertCircle, ChevronDown
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function OrdersTab() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [supabase])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-gray-100">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Syncing order history</p>
    </div>
  )

  if (orders.length === 0) return (
    <div className="py-32 text-center space-y-6 bg-white rounded-[2rem] border border-gray-100">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <ShoppingBag size={28} className="text-gray-200" />
      </div>
      <div className="space-y-2">
        <h4 className="text-2xl font-bold text-black font-serif italic">No orders found</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-10">You haven't made any purchases yet.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order, i) => (
          <OrderCard key={order.id} order={order} index={i} />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, index }: { order: any, index: number }) {
  const supabase = createClient()
  const [expanded, setExpanded] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  // Fetch specific delivery updates if expanded
  useEffect(() => {
    if (expanded) {
      const fetchLogs = async () => {
        const { data } = await supabase
          .from('delivery_logs')
          .select('*')
          .eq('order_id', order.id)
          .order('created_at', { ascending: false })
        setLogs(data || [])
      }
      fetchLogs()
    }
  }, [expanded, order.id, supabase])

  const statusColors: any = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    dispatched: 'bg-gold/10 text-gold border-gold/20',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
    >
      {/* MOBILE FRIENDLY HEADER */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-6 md:p-8 cursor-pointer group"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-5 items-center w-full md:w-auto">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-gold/5 text-gold'}`}>
              {order.status === 'delivered' ? <CheckCircle2 size={24}/> : <Package size={24}/>}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-gold">{order.tracking_number}</p>
              <h4 className="text-sm font-bold text-black uppercase tracking-tight">
                {order.items?.length || 1} Item{order.items?.length > 1 ? 's' : ''} Purchased
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
            <div className="text-left md:text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
              <p className="text-lg font-bold text-black font-sans">${order.total_price?.toLocaleString()}</p>
            </div>
            
            <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${statusColors[order.status] || 'bg-gray-50'}`}>
              {order.status}
            </span>

            <div className={`w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center transition-all ${expanded ? 'bg-black text-white' : 'group-hover:border-gold'}`}>
              <ChevronDown className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDABLE SECTION */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-gray-50/50"
          >
            <div className="p-6 md:p-10 border-t border-gray-100 space-y-10">
              
              {/* PURCHASED ITEMS LIST */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">Items in this order</p>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-5 bg-white p-4 rounded-2xl border border-gray-100">
                    <img src={item.image} className="w-14 h-16 object-cover rounded-xl border border-gray-100 shadow-sm" alt={item.name} />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-gold uppercase tracking-tighter">{item.category}</p>
                      <h5 className="text-xs font-bold text-black uppercase">{item.name}</h5>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">${Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* LIVE DELIVERY HISTORY */}
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">Shipping Status</p>
                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={log.id} className="flex gap-6 relative group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border ${i === 0 ? 'bg-black text-gold border-gold' : 'bg-white text-gray-300 border-gray-100'}`}>
                        {i === 0 ? <Truck size={14}/> : <CheckCircle2 size={14}/>}
                      </div>
                      <div className="flex flex-col">
                        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${i === 0 ? 'text-black' : 'text-gray-400'}`}>
                          {log.milestone}
                        </h4>
                        <div className="flex gap-4 items-center mt-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                            <MapPin size={10} className="text-gold" /> {log.location}
                          </p>
                          <p className="text-[9px] text-gray-300 font-medium uppercase">
                            {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
                       <AlertCircle size={14} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Order received - Awaiting shipment update</p>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER BADGE */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-gold" size={16} />
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">Verified & Hand-Inspected</p>
                </div>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Lume Vault Official Delivery</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}