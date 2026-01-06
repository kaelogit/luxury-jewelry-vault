'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Edit, Trash2, X, Upload, Loader2, 
  Check, ExternalLink, Box, Gem, Clock, ShieldCheck 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createLuxuryAsset } from './actions' // Using the server action we just audited

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- 1. SOVEREIGN FORM STATE ---
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    asset_class: 'GOLD',
    serial_number: '',
    description: '',
    image_url: '',
    gold_purity: '',
    gia_report_number: '',
    status: 'AVAILABLE'
  })
  
  const [specifications, setSpecifications] = useState<any>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleSpecChange = (key: string, value: string) => {
    setSpecifications((prev: any) => ({ ...prev, [key]: value }))
  }

  // --- 2. SUBMISSION PROTOCOL ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value))
    submissionData.append('specifications', JSON.stringify(specifications))

    // Handle File inputs (if selected via standard file inputs)
    const imageInput = document.getElementById('image-upload') as HTMLInputElement
    if (imageInput?.files?.[0]) submissionData.append('image', imageInput.files[0])

    const result = await createLuxuryAsset(submissionData)

    if (result.error) {
      alert(`Ingression Error: ${result.error}`)
    } else {
      setIsModalOpen(false)
      fetchProducts()
      resetForm()
    }
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setFormData({
      title: '', price: '', asset_class: 'GOLD', serial_number: '',
      description: '', image_url: '', gold_purity: '', gia_report_number: '', status: 'AVAILABLE'
    })
    setSpecifications({})
  }

  return (
    <main className="min-h-screen bg-ivory-100 p-8 md:p-12 space-y-12 selection:bg-gold selection:text-white">
      
      {/* HEADER: Opulent Dashboard Ingress */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_gold]" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic">Asset Custody</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-obsidian-900 italic tracking-tighter">Inventory <span className="text-obsidian-400">Registry.</span></h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-obsidian-900 text-gold px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95"
        >
          <Plus size={16} /> Register Asset
        </button>
      </header>

      {/* METRICS PROTOCOL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatBox label="Vault Valuation" value={`$${products.reduce((acc, p) => acc + Number(p.price), 0).toLocaleString()}`} />
        <StatBox label="Managed Assets" value={products.length.toString()} />
        <StatBox label="Registry Status" value="SYNCED" color="text-gold" />
      </div>

      {/* REGISTRY TABLE: Inverted High-Contrast */}
      <div className="bg-white border border-ivory-300 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ivory-300 bg-ivory-50">
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-obsidian-400 italic">Identity</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-obsidian-400 italic">Class</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-obsidian-400 italic">Valuation</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-obsidian-400 italic">Status</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-obsidian-400 italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-ivory-50 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-ivory-100 rounded-2xl border border-ivory-300 overflow-hidden shadow-inner">
                        <img src={p.image_url} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-obsidian-900 uppercase tracking-wider italic">{p.title}</p>
                        <p className="text-[10px] text-obsidian-400 font-mono font-bold uppercase tracking-tighter mt-1">{p.serial_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                       {p.asset_class === 'GOLD' && <Box size={14} className="text-gold" />}
                       {p.asset_class === 'DIAMOND' && <Gem size={14} className="text-obsidian-900" />}
                       {p.asset_class === 'WATCH' && <Clock size={14} className="text-gold" />}
                       <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest italic">{p.asset_class}</span>
                    </div>
                  </td>
                  <td className="p-8 text-lg font-mono text-obsidian-900 italic font-bold tracking-tighter">${Number(p.price).toLocaleString()}</td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.status === 'AVAILABLE' ? 'bg-gold shadow-[0_0_8px_gold]' : 'bg-obsidian-200'}`} />
                      <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest">{p.status}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-6 text-obsidian-300">
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

      {/* ASSET INGESTION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="relative w-full max-w-4xl bg-white border border-ivory-300 rounded-[4rem] p-12 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-start mb-16 border-b border-ivory-200 pb-10">
                <div className="space-y-3">
                  <h2 className="text-4xl font-light text-obsidian-900 italic tracking-tighter">Asset <span className="text-gold">Ingestion.</span></h2>
                  <p className="text-[10px] text-obsidian-400 uppercase tracking-[0.4em] font-black italic underline decoration-gold/30 underline-offset-8 uppercase">Authenticate Asset for Sovereign Vault</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-ivory-100 rounded-full text-obsidian-400 hover:text-obsidian-900 transition-colors"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-16">
                {/* 4K Visual Upload */}
                <div className="group relative h-64 bg-ivory-50 rounded-[3rem] border-2 border-dashed border-ivory-300 flex flex-col items-center justify-center overflow-hidden hover:border-gold/50 transition-all shadow-inner">
                  <div className="text-center space-y-4">
                    <Upload className="mx-auto text-gold opacity-50" size={32} />
                    <p className="text-[10px] text-obsidian-400 font-black uppercase tracking-widest italic">Upload Master Asset Media (4K / 3D)</p>
                  </div>
                  <input id="image-upload" type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,video/*" />
                </div>

                {/* Core Registry Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <Input label="Asset Title" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} />
                  <Input label="Static Valuation (USD)" value={formData.price} onChange={(v: string) => setFormData({...formData, price: v})} />
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest italic ml-4">House Selection</label>
                    <select 
                      value={formData.asset_class} 
                      onChange={(e) => setFormData({...formData, asset_class: e.target.value})}
                      className="w-full bg-ivory-100 border border-ivory-300 rounded-[2rem] px-8 py-5 text-obsidian-900 uppercase text-[11px] font-bold tracking-[0.2em] outline-none focus:border-gold/50 transition-all appearance-none"
                    >
                      <option value="GOLD">House of Gold</option>
                      <option value="DIAMOND">House of Diamond</option>
                      <option value="WATCH">The Horology Suite</option>
                      <option value="BESPOKE">Bespoke Jewelry</option>
                    </select>
                  </div>
                  
                  <Input label="Registry Serial (LV-XXXX)" value={formData.serial_number} onChange={(v: string) => setFormData({...formData, serial_number: v})} />
                </div>

                {/* Class-Specific Specifications */}
                <div className="space-y-8 pt-8 border-t border-ivory-200">
                  <div className="flex items-center gap-4">
                     <ShieldCheck size={18} className="text-gold" />
                     <h4 className="text-[11px] font-black text-obsidian-900 uppercase tracking-[0.4em] italic">Technical Specifications</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-ivory-50/50 p-10 rounded-[3rem] border border-ivory-200">
                    {formData.asset_class === 'GOLD' && (
                      <>
                        <Input label="Gold Purity (e.g., 24K)" value={formData.gold_purity} onChange={(v: string) => setFormData({...formData, gold_purity: v})} />
                        <Input label="Weight (Grams)" value={specifications.weight || ''} onChange={(v: string) => handleSpecChange('weight', v)} />
                      </>
                    )}
                    {formData.asset_class === 'DIAMOND' && (
                      <>
                        <Input label="GIA Report #" value={formData.gia_report_number} onChange={(v: string) => setFormData({...formData, gia_report_number: v})} />
                        <Input label="Carat" value={specifications.carat || ''} onChange={(v: string) => handleSpecChange('carat', v)} />
                        <Input label="Clarity" value={specifications.clarity || ''} onChange={(v: string) => handleSpecChange('clarity', v)} />
                        <Input label="Color" value={specifications.color || ''} onChange={(v: string) => handleSpecChange('color', v)} />
                      </>
                    )}
                    {formData.asset_class === 'WATCH' && (
                      <>
                        <Input label="Reference #" value={specifications.reference || ''} onChange={(v: string) => handleSpecChange('reference', v)} />
                        <Input label="Movement" value={specifications.movement || ''} onChange={(v: string) => handleSpecChange('movement', v)} />
                        <Input label="Year" value={specifications.year || ''} onChange={(v: string) => handleSpecChange('year', v)} />
                      </>
                    )}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-obsidian-900 text-gold py-8 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white disabled:opacity-50 transition-all shadow-2xl"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : 'Finalize Registry Entry'}
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
    <div className="space-y-4">
      <label className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest italic ml-6">{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={`ENTER ${label.toUpperCase()}`}
        className="w-full bg-ivory-100 border border-ivory-300 rounded-[2rem] px-8 py-5 text-obsidian-900 font-bold uppercase tracking-widest focus:outline-none focus:border-gold/50 transition-all shadow-inner placeholder:text-obsidian-200 text-xs"
      />
    </div>
  )
}

function StatBox({ label, value, color = "text-obsidian-900" }: any) {
  return (
    <div className="p-10 bg-white border border-ivory-300 rounded-[2.5rem] space-y-4 shadow-sm">
      <p className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.4em] italic">{label}</p>
      <p className={`text-3xl font-light italic tracking-tighter ${color}`}>{value}</p>
    </div>
  )
}