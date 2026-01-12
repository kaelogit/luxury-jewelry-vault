'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  ShoppingBag,
  ExternalLink,
  X,
  Clock,
  ChevronRight,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomerManagement() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerOrders, setCustomerOrders] = useState<any[]>([])

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    // Fetch profiles that are marked as 'client'
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('total_spent', { ascending: false })

    if (data) setCustomers(data)
    setLoading(false)
  }

  async function viewCustomerDetails(customer: any) {
    setSelectedCustomer(customer)
    // Fetch the detailed manifest of their order history
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', customer.id)
      .order('created_at', { ascending: false })
    
    setCustomerOrders(data || [])
  }

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = customers.reduce((acc, curr) => acc + (Number(curr.total_spent) || 0), 0)

  return (
    <main className="space-y-10 pb-20 font-sans max-w-7xl mx-auto px-4">
      
      {/* 1. HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-black tracking-tight uppercase">
            Client <span className="text-gold font-serif italic font-medium normal-case">Registry</span>
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
            Lume Vault relationship management and acquisition history
          </p>
        </div>

        <div className="flex gap-4">
          <StatMini label="Active Clients" value={customers.length.toString()} icon={<Users size={16}/>} />
          <StatMini label="Vault Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={16}/>} />
        </div>
      </header>

      {/* 2. SEARCH INTERFACE */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm relative group focus-within:border-gold transition-all">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by client name or encrypted email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-300" 
        />
      </div>

      {/* 3. CLIENT LIST TABLE */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <th className="p-8">Client Name & Identity</th>
              <th className="p-8">Shipping Region</th>
              <th className="p-8">Total Acquisition Value</th>
              <th className="p-8 text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center animate-pulse text-[10px] font-bold uppercase text-gray-300 tracking-[0.3em]">Synchronizing Vault Registry...</td></tr>
            ) : filteredCustomers.map((customer) => (
              <tr key={customer.id} className="group hover:bg-gray-50/30 transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold">
                       {customer.full_name?.substring(0, 1) || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black uppercase tracking-tight">{customer.full_name || 'Anonymous Client'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <MapPin size={12} className="text-gold" />
                    {customer.city ? `${customer.city}, ${customer.country}` : 'Restricted Info'}
                  </div>
                </td>
                <td className="p-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-full">
                    <span className="text-[11px] font-bold font-sans">
                      ${Number(customer.total_spent || 0).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <button 
                    onClick={() => viewCustomerDetails(customer)}
                    className="p-3 text-gray-300 hover:text-black hover:bg-gray-100 rounded-xl transition-all active:scale-90"
                  >
                    <ExternalLink size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. CLIENT PROFILE DRAWER/MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-10 right-10 p-2 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
                <X size={24}/>
              </button>

              <div className="space-y-12">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-gray-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gold">
                      <ShieldCheck size={16} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Verified Boutique Client</p>
                    </div>
                    <h2 className="text-4xl font-bold text-black uppercase tracking-tight">{selectedCustomer.full_name}</h2>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase"><Mail size={12}/> {selectedCustomer.email}</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase"><Calendar size={12}/> Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="p-6 bg-black rounded-3xl text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lifetime Valuation</p>
                    <p className="text-3xl font-bold text-gold font-sans">${selectedCustomer.total_spent?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Acquisition History */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold text-black uppercase tracking-widest flex items-center gap-3">
                    <ShoppingBag size={16} className="text-gold"/> Acquisition History
                  </h4>
                  
                  {customerOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 hover:bg-white hover:border-gold transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-[10px] font-bold text-black uppercase">Order {order.tracking_number || `#${order.id.slice(0, 8)}`}</p>
                               <p className="text-[9px] text-gray-400 font-medium uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase border ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gold/10 text-gold border-gold/10'}`}>{order.status}</span>
                          </div>
                          <div className="space-y-2">
                             {order.items?.map((item: any, i: number) => (
                               <div key={i} className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0">
                                     <img src={item.image} className="w-full h-full object-cover" />
                                  </div>
                                  <p className="text-[10px] font-bold text-gray-600 uppercase truncate">{item.name}</p>
                               </div>
                             ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction Value</p>
                             <p className="text-sm font-bold text-black font-sans">${order.total_price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No previous acquisitions found for this client</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

function StatMini({ label, value, icon }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 min-w-[200px]">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gold shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-bold text-black font-sans leading-none mt-1">{value}</p>
      </div>
    </div>
  )
}