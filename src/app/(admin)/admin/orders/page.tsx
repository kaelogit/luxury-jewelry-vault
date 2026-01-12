'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Clock, CheckCircle2, Package, Loader2, FileDown,
  User, ChevronRight, Truck, ShoppingBag, X,
  ExternalLink, CreditCard, Wallet, Landmark, AlertCircle, Eye, 
  MapPin, ShieldCheck, Hash, Mail, Phone, Calendar, ArrowUpRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ProductInvoice } from '@/components/admin/ProductInvoice'

export default function AdminOrders() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [viewingProof, setViewingProof] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('order-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchOrders() 
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
    
    if (error) console.error("Database Access Error:", error)
    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setIsUpdating(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    
    if (!error) {
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
      fetchOrders()
    }
    setIsUpdating(false)
  }

  return (
    <main className="space-y-10 pb-20 font-sans max-w-7xl mx-auto px-4">
      
      {/* HEADER */}
      <header className="flex flex-col gap-1 border-b border-gray-100 pb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
          Dispatch <span className="text-gold font-serif italic font-medium">Control</span>
        </h2>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
          Manual payment verification and global logistics
        </p>
      </header>

      {/* ORDER FEED */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white border border-gray-50 rounded-[2rem]">
            <Loader2 className="text-gold animate-spin" size={32} />
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">Syncing Registry...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <div className="p-20 bg-white border border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4">
                <ShoppingBag className="text-gray-100" size={64} />
                <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">The registry is currently empty</p>
              </div>
            ) : (
              orders.map((order) => (
                <OrderRow 
                  key={order.id} 
                  order={order} 
                  onClick={() => setSelectedOrder(order)} 
                />
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full w-full max-w-3xl bg-white shadow-2xl overflow-y-auto p-8 md:p-14 custom-scrollbar"
            >
              {/* PANEL HEADER */}
              <div className="flex justify-between items-start mb-16">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gold">
                    <ShieldCheck size={16} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Official Lume Record</p>
                  </div>
                  <h3 className="text-3xl font-mono font-bold text-black uppercase tracking-tighter">
                    {selectedOrder.tracking_number}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all group">
                  <X size={24} className="group-active:scale-90 transition-transform"/>
                </button>
              </div>

              <div className="space-y-16 pb-20">
                
                {/* 1. BOUTIQUE MANIFEST */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="text-gold" size={16} />
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">Boutique Manifest</h4>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{selectedOrder.items?.length || 0} Assets</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-6 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                        <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-[9px] font-bold text-gold uppercase tracking-tighter">{item.category}</p>
                          <h5 className="text-sm font-bold text-black uppercase leading-tight">{item.name}</h5>
                          <p className="text-[11px] font-mono font-bold text-gray-400 mt-1">${item.price.toLocaleString()}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-gray-200 group-hover:text-gold transition-colors" />
                      </div>
                    ))}
                    <div className="bg-black text-white p-6 rounded-3xl flex justify-between items-center mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Total Selection Value</p>
                      <p className="text-2xl font-bold font-sans text-gold">${selectedOrder.total_price.toLocaleString()}</p>
                    </div>
                  </div>
                </section>

                {/* 2. SETTLEMENT AUDIT */}
                <section className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-8 relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        {selectedOrder.payment_method?.toLowerCase().includes('crypto') ? <Wallet className="text-gold" size={20}/> : <Landmark className="text-gold" size={20}/>}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Method</p>
                        <p className="text-sm font-bold text-black uppercase tracking-tight">{selectedOrder.payment_method}</p>
                      </div>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>

                  {/* PROOF VISIBILITY FIX */}
                  {selectedOrder.payment_proof ? (
                    <div className="space-y-4 pt-4 border-t border-gray-200 relative z-10">
                       <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 size={14} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Digital Receipt Provided</p>
                       </div>
                       <button 
                        onClick={() => setViewingProof(selectedOrder.payment_proof)}
                        className="w-full group relative flex items-center justify-center gap-3 py-5 bg-white border border-gray-200 rounded-[1.5rem] text-[10px] font-bold uppercase text-black hover:border-gold hover:shadow-lg transition-all"
                      >
                        <Eye size={16} className="group-hover:text-gold transition-colors" /> Inspect Payment Verification
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-200 flex items-center gap-3 text-amber-500 relative z-10">
                       <AlertCircle size={16} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No receipt uploaded yet</p>
                    </div>
                  )}

                  {/* ACTION CONTROLS */}
                  <div className="grid grid-cols-1 gap-3 pt-4 relative z-10">
                    {selectedOrder.status === 'pending' && (
                      <ActionButton label="Approve & Reserve Inventory" color="bg-black text-white" onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')} loading={isUpdating} />
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <ActionButton label="Handover to Private Courier" color="bg-gold text-black" onClick={() => updateOrderStatus(selectedOrder.id, 'dispatched')} loading={isUpdating} />
                    )}
                    {selectedOrder.status === 'dispatched' && (
                      <ActionButton label="Finalize Delivery Handshake" color="bg-green-600 text-white" onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')} loading={isUpdating} />
                    )}
                    <button onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600 pt-4 transition-colors">Void Transaction</button>
                  </div>
                </section>

                {/* 3. REGISTRY METADATA */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
                  <DataField label="Lead Client" value={selectedOrder.client_name} icon={<User size={14}/>} />
                  <DataField label="Direct Email" value={selectedOrder.email} icon={<Mail size={14}/>} />
                  <DataField label="Contact Line" value={selectedOrder.phone} icon={<Phone size={14}/>} />
                  <DataField label="Registry Date" value={new Date(selectedOrder.created_at).toLocaleString()} icon={<Calendar size={14}/>} />
                  
                  <div className="col-span-2 space-y-4 pt-6 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <MapPin size={14} className="text-gold"/> Secure Handover Destination
                    </label>
                    <p className="text-sm font-bold text-black leading-relaxed bg-gray-50 p-8 rounded-[2rem] border border-gray-100 uppercase tracking-tight shadow-inner italic">
                      {selectedOrder.shipping_address}
                    </p>
                  </div>
                </section>

                {/* 4. EXPORTS */}
                <div className="pt-10">
                  <PDFDownloadLink 
                    document={<ProductInvoice order={selectedOrder} />} 
                    fileName={`LUME-INV-${selectedOrder.tracking_number}.pdf`}
                  >
                    <button className="w-full py-6 border border-gray-200 rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-bold uppercase hover:bg-black hover:text-white hover:border-black transition-all group">
                      <FileDown size={18} className="group-hover:translate-y-0.5 transition-transform" /> Generate Manifest Documentation
                    </button>
                  </PDFDownloadLink>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROOF VIEWER MODAL */}
      <AnimatePresence>
        {viewingProof && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-5xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl">
              <button 
                onClick={() => setViewingProof(null)} 
                className="absolute top-8 right-8 p-4 bg-black text-white rounded-full hover:bg-gold transition-colors z-20 shadow-xl active:scale-90"
              >
                <X size={24}/>
              </button>
              <div className="p-16 text-center space-y-8">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Settlement Verification</p>
                   <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order ID: {selectedOrder.id}</h4>
                </div>
                <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center min-h-[400px]">
                  <img src={viewingProof} alt="Payment Proof" className="max-w-full h-auto max-h-[70vh] object-contain shadow-2xl" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Authenticity scan complete. Review the above receipt before confirming funds.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

/** COMPONENTS **/

function OrderRow({ order, onClick }: { order: any, onClick: () => void }) {
  const isCrypto = ['BTC', 'ETH', 'USDT'].includes(order.payment_method?.split(' ')[0])
  return (
    <motion.div layout onClick={onClick} className="bg-white border border-gray-50 rounded-[2rem] p-8 hover:shadow-2xl hover:border-gold/30 hover:-translate-y-1 transition-all cursor-pointer group flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center transition-colors ${order.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
          {order.status === 'pending' ? <Clock size={28}/> : <CheckCircle2 size={28}/>}
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-bold text-black uppercase tracking-tight">{order.client_name}</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="text-gold font-mono tracking-tighter">{order.tracking_number}</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span>{order.payment_method}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-12">
        <div className="text-right">
          <p className="text-lg font-bold text-black font-sans tracking-tight">${order.total_price.toLocaleString()}</p>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter mt-1">{isCrypto ? 'Direct Node' : 'Boutique Settlement'}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    dispatched: 'bg-gold/10 text-gold border-gold/20',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  }
  return (
    <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase border shadow-sm ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  )
}

function ActionButton({ label, color, onClick, loading }: any) {
  return (
    <button disabled={loading} onClick={onClick} className={`w-full py-5 rounded-[1.2rem] text-[11px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-3 ${color}`}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : label}
    </button>
  )
}

function DataField({ label, value, icon }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">{icon} {label}</label>
      <p className="text-sm font-bold text-black uppercase tracking-tight">{value || 'Not Disclosed'}</p>
    </div>
  )
}