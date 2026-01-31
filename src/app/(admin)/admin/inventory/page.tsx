'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Plus, Edit, Trash2, X, Loader2, 
  Camera, Video, Cuboid, Search, Check, Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createProduct, updateProduct } from './actions'

export default function AdminInventory() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // SMARTER CONTROLS
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [brands, setBrands] = useState<string[]>([])

  const CATEGORIES = ['Watches', 'Gold', 'Diamonds']
  
  const SUB_CATEGORIES: any = {
    'Watches': ['Sport', 'Dress', 'Vintage', 'Complications', 'Pocket Watch'],
    'Gold': ['Chain', 'Bracelet', 'Ring', 'Pendant', 'Investment Bar'],
    'Diamonds': ['Engagement Ring', 'Earrings', 'Necklace', 'Loose Stone', 'Custom']
  }

  const OPTIONS = {
    movements: ['Automatic', 'Manual', 'Quartz'],
    clarity: ['FL (Flawless)', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'],
    colors: ['D (Colorless)', 'E', 'F', 'G', 'H', 'Yellow'],
    shapes: ['Round', 'Princess', 'Emerald', 'Oval', 'Cushion'],
    purity: ['24K', '22K', '18K', '14K']
  }

  const [formData, setFormData] = useState<any>({
    name: '', price: '', category: 'Watches', sub_category: 'Sport', 
    brand: '', sku: '', description: '', 
    gold_purity: '24K', carat_weight: '', diamond_clarity: 'VVS1', 
    diamond_color: 'D (Colorless)', shape: 'Round', movement: 'Automatic', 
    video_url: '', three_d_model: '', images: []
  })

  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) {
      setProducts(data)
      const uniqueBrands: any = Array.from(new Set(data.map(p => p.brand).filter(Boolean)))
      setBrands(uniqueBrands)
    }
    setLoading(false)
  }

  const handleCategoryChange = (val: string) => {
    setFormData({ ...formData, category: val, sub_category: SUB_CATEGORIES[val]?.[0] || '' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + previews.length > 3) {
      alert("Limit: 3 Photos Maximum")
      return
    }
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this item?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
  }

  function handleEdit(p: any) {
    setEditingId(p.id)
    setFormData({ ...p, price: p.price.toString() })
    setPreviews(p.images || [])
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = new FormData(e.currentTarget as HTMLFormElement)
      
      const existing = previews.filter(p => p.startsWith('http'))
      form.append('existing_images', JSON.stringify(existing))
      
      if (editingId) {
          form.append('existing_video', formData.video_url || '')
          form.append('existing_model', formData.three_d_model || '')
      }

      let result;
      if (editingId) {
        result = await updateProduct(editingId, form)
      } else {
        result = await createProduct(form)
      }

      if (result.success) {
        setIsModalOpen(false)
        fetchProducts()
        setEditingId(null)
        setPreviews([])
        setFormData({ category: 'Watches', sub_category: 'Sport', name: '', price: '', brand: '', sku: '' })
      } else {
        alert(result.error)
      }
    } catch (err) {
      alert("Something went wrong. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // SMART FILTERING
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-20 font-sans">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">{products.length} assets managed</p>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData({category: 'Watches', sub_category: 'Sport'}); setPreviews([]); setIsModalOpen(true); }} 
            className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={18}/> Add Item
          </button>
        </div>

        {/* SMART FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['All', ...CATEGORIES].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-black transition-all text-sm" 
            />
          </div>
        </div>
      </div>

      {/* ADAPTIVE VIEW (Grid on Mobile, Table on Desktop) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
            <Loader2 className="animate-spin text-gold" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Vault...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-4">
            <Filter size={48} />
            <p className="text-sm font-medium">No assets found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <table className="w-full text-left hidden md:table">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Details</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Classification</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Valuation</th>
                  <th className="p-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                         {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt="thumb" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black group-hover:text-gold transition-colors">{p.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{p.brand} • {p.sku}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-600 tracking-wide">{p.category}</span>
                        <span className="text-[10px] text-gray-400">{p.sub_category}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-bold text-black font-mono tracking-tight">${Number(p.price).toLocaleString()}</td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MOBILE GRID CARDS */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-gray-50/50">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                     {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt="thumb" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-black truncate">{p.name}</p>
                      <p className="text-sm font-bold text-black font-mono">${Number(p.price).toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{p.brand}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-bold uppercase text-gray-500">{p.category}</span>
                      <div className="flex-1" />
                      <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-black bg-gray-50 rounded-lg"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-black tracking-tight">{editingId ? 'Edit Asset' : 'New Acquisition'}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Enter details below</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all"><X size={20}/></button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 space-y-8">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* PHOTOS */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Asset Imagery (Max 3)</label>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {previews.map((src, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group shrink-0">
                          <img src={src} className="w-full h-full object-cover" alt="preview" />
                          <button type="button" onClick={() => removePreview(i)} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-black hover:text-red-500 transition-colors"><X size={12}/></button>
                        </div>
                      ))}
                      {previews.length < 3 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all gap-2 shrink-0">
                          <Camera size={20} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Upload</span>
                        </button>
                      )}
                    </div>
                    <input type="file" name="images" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  </div>

                  {/* CORE INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Item Name" name="name" defaultValue={formData.name} placeholder="e.g. Royal Oak 41mm" required />
                    <Input label="Price (USD)" name="price" defaultValue={formData.price} placeholder="50000" required />
                    
                    <Select label="Category" name="category" value={formData.category} options={CATEGORIES} onChange={handleCategoryChange} />
                    <Select label="Sub-Category" name="sub_category" value={formData.sub_category} options={SUB_CATEGORIES[formData.category] || []} onChange={(v: string) => setFormData({...formData, sub_category: v})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">Brand</label>
                        <input list="brand-list" name="brand" defaultValue={formData.brand} placeholder="Select or type brand..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-black outline-none transition-all font-medium" />
                        <datalist id="brand-list">{brands.map(b => <option key={b} value={b} />)}</datalist>
                    </div>
                    <Input label="SKU / Reference" name="sku" defaultValue={formData.sku} placeholder="REF-12345" required />
                  </div>

                  {/* SMART CATEGORY FIELDS */}
                  <div className="p-6 md:p-8 bg-gray-50/80 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.category === 'Watches' && (
                      <>
                        <Select label="Movement" name="movement" defaultValue={formData.movement} options={OPTIONS.movements} />
                        <Input label="Case Material" name="case_material" defaultValue={formData.case_material} placeholder="e.g. 18K Rose Gold" />
                      </>
                    )}
                    {formData.category === 'Gold' && (
                      <>
                        <Select label="Purity" name="gold_purity" defaultValue={formData.gold_purity} options={OPTIONS.purity} />
                        <Input label="Weight (Grams)" name="weight_grams" defaultValue={formData.weight_grams} placeholder="e.g. 50" />
                      </>
                    )}
                    {formData.category === 'Diamonds' && (
                      <>
                        <Select label="Clarity" name="diamond_clarity" defaultValue={formData.diamond_clarity} options={OPTIONS.clarity} />
                        <Select label="Color" name="diamond_color" defaultValue={formData.diamond_color} options={OPTIONS.colors} />
                        <Select label="Shape" name="shape" defaultValue={formData.shape} options={OPTIONS.shapes} />
                        <Input label="Carat Weight" name="carat_weight" defaultValue={formData.carat_weight} placeholder="e.g. 1.05" />
                      </>
                    )}
                  </div>

                  {/* FILES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1"><Video size={12}/> Video File (.mp4)</label>
                        <div className="relative">
                          <input type="file" name="video_file" accept="video/mp4" className="block w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer bg-gray-50 rounded-xl border border-gray-200" />
                          {formData.video_url && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"><Check size={16}/></div>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1"><Cuboid size={12}/> 3D Model (.glb)</label>
                        <div className="relative">
                          <input type="file" name="model_file" accept=".glb" className="block w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer bg-gray-50 rounded-xl border border-gray-200" />
                          {formData.three_d_model && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"><Check size={16}/></div>}
                        </div>
                      </div>
                  </div>

                  <div className="space-y-1 group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">Description</label>
                      <textarea name="description" defaultValue={formData.description} placeholder="Detailed heritage and condition report..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:border-black outline-none transition-all resize-none font-medium leading-relaxed" />
                  </div>

                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors">Cancel</button>
                <button 
                  form="product-form"
                  disabled={isSubmitting} 
                  className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gold hover:text-black disabled:opacity-50 flex items-center gap-2 shadow-xl transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : null}
                  {editingId ? 'Update Asset' : 'Save to Vault'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Input({ label, name, defaultValue, placeholder = "", required = false }: any) {
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">{label} {required && <span className="text-red-400">*</span>}</label>
      <input 
        name={name} 
        defaultValue={defaultValue} 
        placeholder={placeholder} 
        required={required}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-black outline-none transition-all placeholder:text-gray-300 font-medium" 
      />
    </div>
  )
}

function Select({ label, name, value, defaultValue, options, onChange }: any) {
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">{label}</label>
      <div className="relative">
        <select 
            name={name} 
            value={value} 
            defaultValue={defaultValue} 
            onChange={(e) => onChange?.(e.target.value)} 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-black outline-none appearance-none cursor-pointer font-medium"
        >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
        </div>
      </div>
    </div>
  )
}