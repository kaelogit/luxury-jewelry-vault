'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Plus, Edit, Trash2, X, Upload, Loader2, 
  Camera, Video, Cuboid, Search, Trash 
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

  // --- CATALOG CONFIGURATION ---
  const CATEGORIES = ['Watches', 'Gold', 'Diamonds']
  
  const SUB_CATEGORIES: any = {
    'Watches': ['Sport', 'Dress', 'Vintage', 'Complications', 'Heritage'],
    'Gold': ['Chains', 'Bracelets', 'Rings', 'Pendants', 'Bullion'],
    'Diamonds': ['Engagement Rings', 'Earrings', 'Necklaces', 'Loose Stones', 'Bespoke']
  }

  const FILTERS = {
    purities: ['24K', '22K', '18K', '14K', '.999 Fine'],
    clarities: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'],
    movements: ['Automatic', 'Manual Wind', 'Quartz', 'Tourbillon'],
    diamondColors: ['D', 'E', 'F', 'G', 'H', 'Fancy Intense Yellow'],
    shapes: ['Round', 'Princess', 'Emerald', 'Radiant', 'Oval']
  }

  const [formData, setFormData] = useState<any>({
    name: '', price: '', category: 'Watches', sub_category: 'Sport', 
    brand: '', sku: '', description: '', gold_purity: '24K', 
    carat_weight: '', diamond_clarity: 'VVS1', diamond_color: 'D', 
    shape: 'Round', movement: 'Automatic', video_url: '', 
    three_d_model: '', images: []
  })

  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (data) {
      setProducts(data)
      const uniqueBrands: any = Array.from(new Set(data.map(p => p.brand).filter(Boolean)))
      setBrands(uniqueBrands)
    }
    setLoading(false)
  }

  const handleCategoryChange = (val: string) => {
    setFormData({
      ...formData,
      category: val,
      sub_category: SUB_CATEGORIES[val][0]
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + previews.length > 3) {
      alert("Maximum 3 images allowed per asset.")
      return
    }
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    // Important: Reset file input so user can re-add if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this asset? This cannot be undone.')) return
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
    // Pass existing images explicitly so server knows what to keep
    form.append('existing_images', JSON.stringify(previews.filter(p => p.startsWith('http'))))

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
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="space-y-8 pb-20 font-sans max-w-7xl mx-auto px-6 pt-6">
      
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black tracking-tight uppercase">
            Asset <span className="text-gold font-serif italic normal-case">Registry</span>
          </h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            {products.length} Items in Vault
          </p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({category: 'Watches', sub_category: 'Sport'}); setPreviews([]); setIsModalOpen(true); }} 
          className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all active:scale-95 flex items-center gap-3 shadow-lg"
        >
          <Plus size={16}/> Add New Asset
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm relative group focus-within:border-gold transition-all max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Search registry by name, brand, or SKU..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full pl-12 pr-6 py-3 bg-transparent outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-300 text-black" 
        />
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="p-6 pl-8 text-[9px] font-bold uppercase text-gray-400 tracking-widest">Description</th>
              <th className="p-6 text-[9px] font-bold uppercase text-gray-400 tracking-widest">Classification</th>
              <th className="p-6 text-[9px] font-bold uppercase text-gray-400 tracking-widest">Valuation</th>
              <th className="p-6 text-[9px] font-bold uppercase text-gray-400 tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="p-6 pl-8 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                     <img src={p.images?.[0]} className="w-full h-full object-cover" alt="thumbnail" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black uppercase tracking-tight">{p.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold tracking-wide uppercase mt-1">
                      {p.brand || 'No Brand'} • {p.sku || 'No SKU'}
                    </p>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{p.category}</p>
                  <p className="text-[8px] font-bold text-gold uppercase tracking-tighter">{p.sub_category}</p>
                </td>
                <td className="p-6 text-xs font-bold text-black font-sans">${Number(p.price).toLocaleString()}</td>
                <td className="p-6 text-right pr-8">
                  <div className="flex items-center justify-end gap-3 text-gray-300">
                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-black hover:text-white rounded-lg transition-all"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-5xl bg-white rounded-[2rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-black uppercase tracking-tight">
                  {editingId ? 'Modify' : 'Register'} <span className="text-gold font-serif italic normal-case">Asset</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-black transition-colors"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* PHOTO UPLOAD SECTION */}
                <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest ml-1">Asset Imagery (Up to 3)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previews.map((src, i) => (
                        <div key={i} className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                          <img src={src} className="w-full h-full object-cover" alt="preview" />
                          <button type="button" onClick={() => removePreview(i)} className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"><Trash size={12}/></button>
                        </div>
                      ))}
                      {previews.length < 3 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-gold hover:text-gold transition-all bg-gray-50/50 hover:bg-white">
                          <Camera size={20} />
                          <span className="text-[8px] font-bold uppercase mt-2 tracking-widest">Add Photo</span>
                        </button>
                      )}
                    </div>
                    <input type="file" name="images" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Name" name="name" defaultValue={formData.name} placeholder="e.g. Royal Oak 41mm" />
                  <Input label="Market Value (USD)" name="price" defaultValue={formData.price} placeholder="50000" />
                  
                  <Select 
                    label="Primary Category" 
                    name="category" 
                    value={formData.category} 
                    options={CATEGORIES} 
                    onChange={handleCategoryChange} 
                  />

                  <Select 
                    label="Sub-Category" 
                    name="sub_category" 
                    value={formData.sub_category} 
                    options={SUB_CATEGORIES[formData.category] || []} 
                    onChange={(v: string) => setFormData({...formData, sub_category: v})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Manufacturer Brand</label>
                      <input 
                        list="brand-list" 
                        name="brand" 
                        defaultValue={formData.brand} 
                        placeholder="Select or enter brand..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black outline-none focus:border-gold shadow-sm font-medium transition-all hover:border-gray-300" 
                      />
                      <datalist id="brand-list">
                        {brands.map(b => <option key={b} value={b} />)}
                      </datalist>
                  </div>
                  <Input label="Reference ID / SKU" name="sku" defaultValue={formData.sku} placeholder="Ref-0021" />
                </div>

                {/* CATEGORY SPECIFIC FIELDS */}
                <div className="p-8 bg-gray-50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100">
                  {formData.category === 'Watches' && (
                    <>
                      <Select label="Movement" name="movement" defaultValue={formData.movement} options={FILTERS.movements} />
                      <Input label="Case Material" name="case_material" defaultValue={formData.case_material} placeholder="e.g. 18K Rose Gold" />
                    </>
                  )}
                  {formData.category === 'Gold' && (
                    <>
                      <Select label="Purity" name="gold_purity" defaultValue={formData.gold_purity} options={FILTERS.purities} />
                      <Input label="Weight (Grams)" name="weight_grams" defaultValue={formData.weight_grams} placeholder="50.0" />
                    </>
                  )}
                  {formData.category === 'Diamonds' && (
                    <>
                      <Select label="Clarity" name="diamond_clarity" defaultValue={formData.diamond_clarity} options={FILTERS.clarities} />
                      <Select label="Shape" name="shape" defaultValue={formData.shape} options={FILTERS.shapes} />
                      <Input label="Carat Weight" name="carat_weight" defaultValue={formData.carat_weight} placeholder="1.50" />
                    </>
                  )}
                </div>

                {/* MEDIA LINKS - FIXED TO PREVENT EMPTY FILE SUBMISSION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Video size={14}/> Cinematic Clip (.mp4)</label>
                      <input type="file" name="video_file" accept="video/mp4" className="text-[10px] text-gray-400 file:bg-gray-100 file:border-none file:px-4 file:py-2 file:rounded-full file:mr-4 file:cursor-pointer hover:file:bg-black hover:file:text-white transition-colors" />
                      {formData.video_url && <p className="text-[8px] text-gold truncate font-bold uppercase tracking-widest">Media Connected</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Cuboid size={14}/> 3D Spatial Render (.glb)</label>
                      <input type="file" name="model_file" accept=".glb" className="text-[10px] text-gray-400 file:bg-gray-100 file:border-none file:px-4 file:py-2 file:rounded-full file:mr-4 file:cursor-pointer hover:file:bg-black hover:file:text-white transition-colors" />
                      {formData.three_d_model && <p className="text-[8px] text-gold truncate font-bold uppercase tracking-widest">Model Connected</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Asset Description</label>
                    <textarea 
                      name="description" 
                      defaultValue={formData.description} 
                      placeholder="Enter detailed heritage and features..."
                      className="w-full bg-white border border-gray-200 rounded-xl p-5 text-sm min-h-[140px] outline-none focus:border-gold shadow-sm font-medium leading-relaxed resize-none transition-all hover:border-gray-300" 
                    />
                </div>

                <button disabled={isSubmitting} className="w-full bg-black text-white py-5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-xl active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Syncing Registry...
                    </>
                  ) : editingId ? 'Update Asset Record' : 'Commit to Vault'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

// UI HELPERS
function Input({ label, name, defaultValue, placeholder = "" }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">{label}</label>
      <input 
        name={name} 
        defaultValue={defaultValue} 
        placeholder={placeholder} 
        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black outline-none focus:border-gold transition-all shadow-sm font-medium hover:border-gray-300 placeholder:text-gray-300" 
      />
    </div>
  )
}

function Select({ label, name, value, defaultValue, options, onChange }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">{label}</label>
      <div className="relative">
        <select 
            name={name} 
            value={value} 
            defaultValue={defaultValue} 
            onChange={(e) => onChange?.(e.target.value)} 
            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-black outline-none focus:border-gold h-[52px] shadow-sm cursor-pointer font-medium appearance-none hover:border-gray-300"
        >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
      </div>
    </div>
  )
}