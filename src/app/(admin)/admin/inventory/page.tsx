'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Plus, Edit, Trash2, X, Loader2, 
  Camera, Video, Cuboid, Search, Trash, Check 
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
  const [searchQuery, setSearchQuery] = useState('')
  const [brands, setBrands] = useState<string[]>([])

  // --- CONFIGURATION ---
  const CATEGORIES = ['Watches', 'Gold', 'Diamonds']
  
  const SUB_CATEGORIES: any = {
    'Watches': ['Sport', 'Dress', 'Vintage', 'Complications', 'Pocket Watch'],
    'Gold': ['Chain', 'Bracelet', 'Ring', 'Pendant', 'Investment Bar'],
    'Diamonds': ['Engagement Ring', 'Earrings', 'Necklace', 'Loose Stone', 'Custom']
  }

  // Simplified Options
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
    // Specifics
    gold_purity: '24K', carat_weight: '', diamond_clarity: 'VVS1', 
    diamond_color: 'D (Colorless)', shape: 'Round', movement: 'Automatic', 
    // Media
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
    setFormData({ ...formData, category: val, sub_category: SUB_CATEGORIES[val][0] })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + previews.length > 3) {
      alert("You can only upload 3 photos max.")
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
    if (!confirm('Delete this item? This cannot be undone.')) return
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
    
    const form = new FormData(e.currentTarget as HTMLFormElement)
    
    // Pass existing images so the server knows not to delete them
    const existing = previews.filter(p => p.startsWith('http'))
    form.append('existing_images', JSON.stringify(existing))
    
    // Pass existing video/model URLs if we are editing
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
      setFormData({ category: 'Watches', sub_category: 'Sport' })
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-20 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} items in stock</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({category: 'Watches', sub_category: 'Sport'}); setPreviews([]); setIsModalOpen(true); }} 
          className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Plus size={18}/> Add Item
        </button>
      </header>

      {/* SEARCH */}
      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, brand, or SKU..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-black transition-all text-sm" 
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
              <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="p-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                     {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt="thumb" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand} • {p.sku}</p>
                  </div>
                </td>
                <td className="p-6">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                    {p.category}
                  </span>
                </td>
                <td className="p-6 text-sm font-bold text-black">${Number(p.price).toLocaleString()}</td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-black">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
              </div>

              <div className="overflow-y-auto p-8 space-y-8">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* PHOTOS */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Photos (Max 3)</label>
                    <div className="flex gap-4">
                      {previews.map((src, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group">
                          <img src={src} className="w-full h-full object-cover" alt="preview" />
                          <button type="button" onClick={() => removePreview(i)} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"><X size={12}/></button>
                        </div>
                      ))}
                      {previews.length < 3 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors gap-1">
                          <Camera size={20} />
                          <span className="text-[10px] font-bold uppercase">Add</span>
                        </button>
                      )}
                    </div>
                    <input type="file" name="images" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  </div>

                  {/* CORE INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Item Name" name="name" defaultValue={formData.name} placeholder="e.g. Rolex Submariner" />
                    <Input label="Price (USD)" name="price" defaultValue={formData.price} placeholder="15000" />
                    
                    <Select label="Category" name="category" value={formData.category} options={CATEGORIES} onChange={handleCategoryChange} />
                    <Select label="Sub-Category" name="sub_category" value={formData.sub_category} options={SUB_CATEGORIES[formData.category] || []} onChange={(v: string) => setFormData({...formData, sub_category: v})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</label>
                        <input list="brand-list" name="brand" defaultValue={formData.brand} placeholder="Select or type brand..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black outline-none transition-all" />
                        <datalist id="brand-list">{brands.map(b => <option key={b} value={b} />)}</datalist>
                    </div>
                    <Input label="SKU / Reference" name="sku" defaultValue={formData.sku} placeholder="REF-12345" />
                  </div>

                  {/* SMART CATEGORY FIELDS */}
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.category === 'Watches' && (
                      <>
                        <Select label="Movement" name="movement" defaultValue={formData.movement} options={OPTIONS.movements} />
                        <Input label="Case Material" name="case_material" defaultValue={formData.case_material} placeholder="e.g. Steel, Gold" />
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
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Video size={14}/> Video File (.mp4)</label>
                        <input type="file" name="video_file" accept="video/mp4" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
                        {formData.video_url && <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1"><Check size={10}/> File Uploaded</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Cuboid size={14}/> 3D Model (.glb)</label>
                        <input type="file" name="model_file" accept=".glb" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
                        {formData.three_d_model && <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1"><Check size={10}/> File Uploaded</p>}
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                      <textarea name="description" defaultValue={formData.description} placeholder="Item details..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm min-h-[100px] focus:border-black outline-none transition-all" />
                  </div>

                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-black">Cancel</button>
                <button 
                  form="product-form"
                  disabled={isSubmitting} 
                  className="px-8 py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                  {editingId ? 'Update Item' : 'Save Item'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Input({ label, name, defaultValue, placeholder = "" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <input 
        name={name} 
        defaultValue={defaultValue} 
        placeholder={placeholder} 
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black outline-none transition-all placeholder:text-gray-400" 
      />
    </div>
  )
}

function Select({ label, name, value, defaultValue, options, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select 
            name={name} 
            value={value} 
            defaultValue={defaultValue} 
            onChange={(e) => onChange?.(e.target.value)} 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black outline-none appearance-none cursor-pointer"
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