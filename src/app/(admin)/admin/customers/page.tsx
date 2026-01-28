'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Users, Search, Mail, MapPin, TrendingUp, 
  ExternalLink, X, Calendar, ShieldCheck, 
  ShoppingBag, ChevronRight 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomerManagement() {
  const supabase = createClient() // FIX: Single factory initialization
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
    
    // FIX: Removed duplicate supabase client creation
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
    <main className="space-y-8 pb-20 font-sans max-w-7xl mx-auto px-6 pt-6">
      
      {/* 1. HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
            Customers
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
            Manage relationships and history
          </p>
        </div>

        <div className="flex gap-4">
          <StatMini label="Active Customers" value={customers.length.toString()} icon={<Users size={16}/>} />
          <StatMini label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={16}/>} />
        </div>
      </header>

      {/* 2. SEARCH INTERFACE */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm relative group focus-within:border-gold transition-all max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Search customers..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-transparent outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-300 text-black" 
        />
      </div>

      {/* 3. CUSTOMER LIST */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50 text-[9px] font-bold uppercase tracking-widest text-gray-400">
              <th className="p-6 pl-8">Customer</th>
              <th className="p-6">Location</th>
              <th className="p-6">Total Spent</th>
              <th className="p-6 text-right pr-8">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="p-12 text-center text-[10px] font-bold uppercase text-gray-300 tracking-widest">Loading...</td></tr>
            ) : filteredCustomers.map((customer) => (
              <tr key={customer.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="p-6 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                       {customer.full_name?.substring(0, 1) || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black uppercase tracking-tight">{customer.full_name || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <MapPin size={12} className="text-gold" />
                    {customer.city ? `${customer.city}, ${customer.country}` : '—'}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-sm font-bold text-black font-sans">
                    ${Number(customer.total_spent || 0).toLocaleString()}
                  </span>
                </td>
                <td className="p-6 text-right pr-8">
                  <button 
                    onClick={() => viewCustomerDetails(customer)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:border-gold hover:text-gold transition-all"
                  >
                    View <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. DETAILS MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl p-10 md:p-12 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors">
                <X size={24}/>
              </button>

              <div className="space-y-10">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <ShieldCheck size={16} />
                      <p className="text-[9px] font-bold uppercase tracking-widest">Active Account</p>
                    </div>
                    <h2 className="text-3xl font-bold text-black uppercase tracking-tight">{selectedCustomer.full_name}</h2>
                    <div className="flex gap-6 pt-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase"><Mail size={12}/> {selectedCustomer.email}</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase"><Calendar size={12}/> Since {new Date(selectedCustomer.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lifetime Value</p>
                    <p className="text-3xl font-bold text-black font-sans">${selectedCustomer.total_spent?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBag size={14} className="text-gold"/> Order History
                  </h4>
                  
                  {customerOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="p-6 border border-gray-100 rounded-2xl hover:border-gold/30 transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-[10px] font-bold text-black uppercase">Order #{order.id.slice(0, 8)}</p>
                               <p className="text-[9px] text-gray-400 font-medium uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-[8px] font-bold px-2 py-1 rounded border uppercase ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                             {order.items?.map((item: any, i: number) => (
                               <div key={i} className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                     <img src={item.image} className="w-full h-full object-cover" alt="item" />
                                  </div>
                                  <p className="text-[10px] font-bold text-gray-600 uppercase truncate">{item.name}</p>
                               </div>
                             ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                             <p className="text-sm font-bold text-black font-sans">${order.total_price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No orders found</p>
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
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-4 min-w-[180px]">
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-black">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold text-black font-sans leading-none mt-1">{value}</p>
      </div>
    </div>
  )
}