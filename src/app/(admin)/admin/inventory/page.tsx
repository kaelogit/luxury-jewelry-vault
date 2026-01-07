'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Edit, Trash2, X, Upload, Loader2, 
  Check, Box, Gem, Clock, ShieldCheck, Search, Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createLuxuryAsset } from './actions'

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- 1. DYNAMIC CATEGORY MAPPING ---
  const CATEGORIES = ['Watches', 'Solid Gold', 'Diamonds', 'Bespoke']
  const SUB_CATEGORIES: Record<string, string[]> = {
    'Watches': ['Heritage', 'Contemporary', 'Limited Edition'],
    'Solid Gold': ['Chains', 'Rings', 'Investment Bars'],
    'Diamonds': ['GIA Certified', 'Loose Stones'],
    'Bespoke': ['Custom Commissions']
  }

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Watches',
    sub_category: 'Heritage',
    type: 'Automatic',
    serial_number: '',
    description: '',
    gold_purity: '',
    carat_weight: '',
    gia_report: ''
  })
  
  const [specifications, setSpecifications] = useState<any>({})

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleSpecChange = (key: string, value: string) => {
    setSpecifications((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value))
    submissionData.append('specifications', JSON.stringify(specifications))

    const imageInput = document.getElementById('image-upload') as HTMLInputElement
    if (imageInput?.files?.[0]) submissionData.append('image', imageInput.files[0])

    const result = await createLuxuryAsset(submissionData)

    if (result.error) {
      alert(`Sync Error: ${result.error}`)
    } else {
      setIsModalOpen(false)
      fetchProducts()
      resetForm()
    }
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setFormData({
      name: '', price: '', category: 'Watches', sub_category: 'Heritage', type: 'Automatic',
      serial_number: '', description: '', gold_purity: '', carat_weight: '', gia_report: ''
    })
    setSpecifications({})
  }

  return (
    <main className="space-y-10 pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <p className="label-caps text-gold">Vault Registry</p>
          <h1 className="text-4xl md:text-6xl font-medium text-obsidian-900 font-serif italic tracking-tight">
            Inventory <span className="text-obsidian-400 not-italic">Control.</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-obsidian-900 text-white px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gold transition-all shadow-lg"
        >
          <Plus size={18} /> Add New Asset
        </button>
      </header>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-ivory-300 shadow-sm">
        <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-300" size={18} />
            <input type="text" placeholder="Search by name or serial..." className="w-full pl-12 pr-4 py-3 bg-ivory-50 border border-ivory-200 rounded-lg outline-none focus:border-gold text-sm" />
        </div>
        <div className="flex gap-4">
            <select className="px-6 py-3 bg-white border border-ivory-300 rounded-lg text-xs font-bold uppercase tracking-widest text-obsidian-600 outline-none">
                <option>All Categories</option>
                <option>Watches</option>
                <option>Solid Gold</option>
            </select>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <div className="bg-white border border-ivory-300 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ivory-300 bg-ivory-50">
                <th className="p-6 label-caps text-obsidian-400">Identity</th>
                <th className="p-6 label-caps text-obsidian-400">Category</th>
                <th className="p-6 label-caps text-obsidian-400">Valuation</th>
                <th className="p-6 label-caps text-obsidian-400">Stock</th>
                <th className="p-6 label-caps text-obsidian-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={p.image} className="w-12 h-14 object-cover rounded border border-ivory-200" alt="" />
                      <div>
                        <p className="text-sm font-bold text-obsidian-900 uppercase">{p.name}</p>
                        <p className="text-[10px] text-obsidian-400 font-mono">SN: {p.serial_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest bg-gold/5 px-2 py-1 rounded-md">{p.category}</span>
                  </td>
                  <td className="p-6 text-sm font-bold text-obsidian-900">${Number(p.price).toLocaleString()}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.is_visible ? 'bg-green-500' : 'bg-red-400'}`} />
                      <span className="text-[10px] font-bold text-obsidian-400 uppercase">{p.is_visible ? 'Active' : 'Hidden'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-4 text-obsidian-300">
                      <button className="hover:text-gold transition-colors"><Edit size={18} /></button>
                      <button className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSET MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl p-10 md:p-14 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10 border-b border-ivory-100 pb-6">
                <h2 className="text-3xl font-medium text-obsidian-900 font-serif italic">New <span className="text-gold">Asset.</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="text-obsidian-300 hover:text-obsidian-900 transition-colors"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Media Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 h-48 bg-ivory-50 rounded-xl border-2 border-dashed border-ivory-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors">
                        <Upload className="text-gold mb-2" size={24} />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-obsidian-400">Primary Product Image</p>
                        <input id="image-upload" type="file" className="absolute opacity-0 cursor-pointer" />
                    </div>
                </div>

                {/* Classification */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Select label="Category" value={formData.category} options={CATEGORIES} onChange={(v) => setFormData({...formData, category: v, sub_category: SUB_CATEGORIES[v][0]})} />
                  <Select label="Sub-Category" value={formData.sub_category} options={SUB_CATEGORIES[formData.category]} onChange={(v) => setFormData({...formData, sub_category: v})} />
                  <Input label="Serial Number" value={formData.serial_number} onChange={(v) => setFormData({...formData, serial_number: v})} />
                </div>

                {/* Commercials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Asset Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                  <Input label="Price (USD)" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} />
                </div>

                {/* Technical specs based on Category */}
                <div className="p-8 bg-ivory-50 rounded-xl space-y-8">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-gold" size={18} />
                    <p className="label-caps !text-obsidian-900">Technical Attributes</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {formData.category === 'Solid Gold' && (
                        <>
                            <Input label="Gold Purity (e.g. 24K)" value={formData.gold_purity} onChange={(v) => setFormData({...formData, gold_purity: v})} />
                            <Input label="Weight (g)" value={specifications.weight || ''} onChange={(v) => handleSpecChange('weight', v)} />
                        </>
                    )}
                    {formData.category === 'Watches' && (
                        <>
                            <Input label="Movement" value={specifications.movement || ''} onChange={(v) => handleSpecChange('movement', v)} />
                            <Input label="Case Material" value={specifications.case || ''} onChange={(v) => handleSpecChange('case', v)} />
                            <Input label="Year" value={specifications.year || ''} onChange={(v) => handleSpecChange('year', v)} />
                        </>
                    )}
                    {formData.category === 'Diamonds' && (
                        <>
                            <Input label="GIA Report #" value={formData.gia_report} onChange={(v) => setFormData({...formData, gia_report: v})} />
                            <Input label="Carat Weight" value={formData.carat_weight} onChange={(v) => setFormData({...formData, carat_weight: v})} />
                            <Input label="Clarity" value={specifications.clarity || ''} onChange={(v) => handleSpecChange('clarity', v)} />
                        </>
                    )}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-obsidian-900 text-white py-6 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Publish to Registry'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest ml-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-sm text-obsidian-900 outline-none focus:border-gold transition-all" />
    </div>
  )
}

function Select({ label, value, options, onChange }: any) {
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest ml-1">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-sm text-obsidian-900 outline-none focus:border-gold transition-all h-[46px]">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    )
}