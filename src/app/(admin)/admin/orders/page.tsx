'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Clock, CheckCircle2, Loader2, FileDown,
  ChevronRight, ShoppingBag, X,
  Eye, MapPin, ShieldCheck, Mail, Phone, Calendar, ArrowUpRight,
  CreditCard, Wallet, AlertCircle, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// FIX: Import the 'pdf' function for manual generation
import { pdf } from '@react-pdf/renderer'
import { ProductInvoice } from '@/components/admin/ProductInvoice'

export default function AdminOrders() {
  const supabase = useMemo(() => createClient(), [])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false) // Added state for download status
  const [viewingProof, setViewingProof] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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
  }, [supabase])

  async function fetchOrders() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setOrders(data)
    } catch (err) {
      console.error("Registry Sync Error:", err)
    } finally {
      setLoading(false)
    }
  }

  // --- THE DIRECT FIX: MANUAL DOWNLOAD FUNCTION ---
 const handleDownloadInvoice = async () => {
    if (!selectedOrder) return;
    setIsDownloading(true);

    try {
      // 1. Log data to check for hidden errors in console (F12)
      console.log("Generating Invoice for:", selectedOrder);

      // 2. Create document instance
      const doc = <ProductInvoice order={selectedOrder} />;
      
      // 3. Convert to Blob using the pdf engine
      const blob = await pdf(doc).toBlob();
      
      // 4. Force Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `INVOICE-${selectedOrder.tracking_number || 'ORDER'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // 5. Cleanup
      link.parentNode?.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      // This will now tell us the EXACT reason for failure in the alert
      console.error("PDF CRASH:", err);
      alert(`Maison Error: ${err.message || 'PDF Assembly Failed'}`);
    } finally {
      setIsDownloading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    if (isUpdating) return
    setIsUpdating(true)
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
      
      if (error) throw error

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }))
      }
      fetchOrders()
    } catch (err: any) {
      alert("Status Update Failed: " + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <main className="space-y-8 pb-20 font-sans max-w-7xl mx-auto px-6 pt-6">
      
      <header className="flex flex-col gap-1 border-b border-gray-100 pb-8">
        <h2 className="text-3xl font-bold text-black uppercase tracking-tight">
          Order <span className="text-gold font-serif italic normal-case">Management</span>
        </h2>
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
          Monitor fulfillment and fiscal verification
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {loading && orders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white border border-gray-50 rounded-3xl">
            <Loader2 className="text-gold animate-spin" size={32} />
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">Syncing Records...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <div className="p-20 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                <ShoppingBag className="text-gray-100" size={64} />
                <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">No active orders</p>
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

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full w-full max-w-3xl bg-white shadow-2xl overflow-y-auto p-8 md:p-12"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gold">
                    <ShieldCheck size={16} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Maison Verified</p>
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-black uppercase tracking-tight">
                    {selectedOrder.tracking_number || 'PENDING-TRK'}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all group">
                  <X size={24}/>
                </button>
              </div>

              <div className="space-y-12 pb-20">
                
                {/* 1. ASSET SUMMARY */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="text-gold" size={16} />
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">Acquired Assets</h4>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{selectedOrder.items?.length || 0} Units</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                        <div className="w-16 h-20 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
                          {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-[9px] font-bold text-gold uppercase tracking-widest">{item.category}</p>
                          <h5 className="text-sm font-bold text-black uppercase leading-tight">{item.name}</h5>
                          <p className="text-[11px] font-mono font-bold text-gray-400 mt-1">${(item.price || 0).toLocaleString()}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-gray-200 group-hover:text-gold transition-colors" />
                      </div>
                    ))}
                    <div className="bg-black text-white p-6 rounded-2xl flex justify-between items-center mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Acquisition</p>
                      <p className="text-2xl font-bold font-sans text-gold">${(selectedOrder.total_price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </section>

                {/* 2. PAYMENT & ACTION */}
                <section className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-8 relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                        {selectedOrder.payment_method?.toLowerCase().includes('crypto') ? <Wallet className="text-gold" size={18}/> : <CreditCard className="text-gold" size={18}/>}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payment Provider</p>
                        <p className="text-sm font-bold text-black uppercase tracking-tight">{selectedOrder.payment_method || 'Direct Transfer'}</p>
                      </div>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>

                  {selectedOrder.payment_proof ? (
                    <div className="space-y-4 pt-4 border-t border-gray-200 relative z-10">
                       <div className="flex items-center gap-2 text-green-600 font-bold uppercase text-[10px] tracking-widest">
                          <CheckCircle2 size={14} /> Receipt Attached
                       </div>
                       <button onClick={() => setViewingProof(selectedOrder.payment_proof)} className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-gray-200 rounded-xl text-[10px] font-bold uppercase hover:border-gold transition-all">
                        <Eye size={16} /> View Payment Receipt
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-200 flex items-center gap-3 text-amber-500 relative z-10 uppercase text-[10px] font-bold tracking-widest">
                       <AlertCircle size={16} /> Funds Awaiting Clearance
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 pt-4 relative z-10">
                    {selectedOrder.status === 'pending' && (
                      <ActionButton label="Approve Transaction" color="bg-black text-white hover:bg-gold hover:text-black" onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')} loading={isUpdating} />
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <ActionButton label="Prepare Shipment" color="bg-black text-white hover:bg-gold hover:text-black" onClick={() => updateOrderStatus(selectedOrder.id, 'dispatched')} loading={isUpdating} />
                    )}
                    {selectedOrder.status === 'dispatched' && (
                      <ActionButton label="Confirm Delivery" color="bg-green-600 text-white hover:bg-green-700" onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')} loading={isUpdating} />
                    )}
                    <button onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600 pt-2 transition-colors">Void Order</button>
                  </div>
                </section>

                {/* 3. CLIENT DATA */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                  <DataField label="Client Name" value={selectedOrder.client_name} icon={<User size={14}/>} />
                  <DataField label="Client Email" value={selectedOrder.email || selectedOrder.client_email} icon={<Mail size={14}/>} />
                  <DataField label="Client Phone" value={selectedOrder.phone} icon={<Phone size={14}/>} />
                  <DataField label="Registry Date" value={new Date(selectedOrder.created_at).toLocaleDateString()} icon={<Calendar size={14}/>} />
                  
                  <div className="col-span-2 space-y-3 pt-4 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={14} className="text-gold"/> Secure Shipping Address
                    </label>
                    <p className="text-sm font-medium text-black bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      {selectedOrder.shipping_address || 'Address information missing'}
                    </p>
                  </div>
                </section>

                {/* 4. INVOICE EXPORT - THE NEW MANUAL BUTTON FIX */}
                <div className="pt-6">
                  {isMounted && selectedOrder && (
                    <button 
                      onClick={handleDownloadInvoice}
                      disabled={isDownloading}
                      className="w-full py-5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-all disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <><Loader2 size={16} className="animate-spin" /> Vetting Document...</>
                      ) : (
                        <><FileDown size={16} /> Download Official Invoice</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingProof && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-4xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl p-10">
              <button onClick={() => setViewingProof(null)} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-colors z-20">
                <X size={20}/>
              </button>
              <div className="text-center space-y-6">
                <h3 className="text-lg font-bold text-black uppercase tracking-widest">Verified Payment Receipt</h3>
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center min-h-[400px]">
                  <img src={viewingProof} alt="" className="max-w-full h-auto max-h-[60vh] object-contain" />
                </div>
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
  const isPending = order.status === 'pending'
  return (
    <motion.div layout onClick={onClick} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gold/30 transition-all cursor-pointer group flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPending ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
          {isPending ? <Clock size={20}/> : <CheckCircle2 size={20}/>}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-black uppercase tracking-tight">{order.client_name || 'Anonymous Client'}</h4>
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="text-gold font-mono tracking-tighter">{order.tracking_number || 'TRK-PENDING'}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{order.payment_method}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-sm font-bold text-black font-sans tracking-tight">${(order.total_price || 0).toLocaleString()}</p>
          <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5 tracking-widest">{order.status}</p>
        </div>
        <ChevronRight size={14} className="text-gray-300 group-hover:text-black transition-all" />
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    dispatched: 'bg-purple-50 text-purple-600 border-purple-100',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  }
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${colors[status] || 'bg-gray-50'}`}>
      {status}
    </span>
  )
}

function ActionButton({ label, color, onClick, loading }: any) {
  return (
    <button disabled={loading} onClick={onClick} className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${color}`}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : label}
    </button>
  )
}

function DataField({ label, value, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</label>
      <p className="text-sm font-bold text-black">{value || 'Not Registered'}</p>
    </div>
  )
}