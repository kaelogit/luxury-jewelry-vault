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

  // --- STANDARD FILTERS ---
  const CATEGORIES = ['Watches', 'Gold', 'Diamonds']
  const FILTERS = {
    purities: ['24K', '22K', '18K', '14K', '.999 Fine'],
    clarities: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'],
    movements: ['Automatic', 'Manual Wind', 'Quartz', 'Tourbillon'],
    diamondColors: ['D', 'E', 'F', 'G', 'H', 'Fancy Intense Yellow'],
    shapes: ['Round', 'Princess', 'Emerald', 'Radiant', 'Oval']
  }

  const [formData, setFormData] = useState<any>({
    name: '', price: '', category: 'Watches', brand: '', sku: '',
    description: '', gold_purity: '24K', carat_weight: '',
    diamond_clarity: 'VVS1', diamond_color: 'D', shape: 'Round',
    movement: 'Automatic', video_url: '', three_d_model: '', images: []
  })

  // State for image previews (up to 3)
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const supabase = createClient(); const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) {
      setProducts(data)
      const uniqueBrands: any = Array.from(new Set(data.map(p => p.brand).filter(Boolean)))
      setBrands(uniqueBrands)
    }
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + previews.length > 3) {
      alert("Maximum 3 images allowed per product.")
      return
    }
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return
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
    // Send existing URLs separately so backend knows what to keep
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
    <main className="space-y-10 pb-20 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-black tracking-tight">Product <span className="text-gold font-serif italic">Inventory</span></h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{products.length} Items in Catalog</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({category: 'Watches'}); setPreviews([]); setIsModalOpen(true); }} className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all active:scale-95 flex items-center gap-2">
          <Plus size={16}/> Add Product
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input 
          type="text" 
          placeholder="Search by name, SKU, or brand..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full pl-14 pr-6 py-3 bg-transparent outline-none text-sm" 
        />
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400">Product</th>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400">Category</th>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400">Price</th>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-sans">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="p-6 flex items-center gap-4">
                  <img src={p.images?.[0]} className="w-12 h-16 object-cover rounded bg-gray-100 shadow-sm" alt="thumbnail" />
                  <div>
                    <p className="text-xs font-bold text-black uppercase">{p.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold tracking-tighter">{p.brand} • SKU: {p.sku}</p>
                  </div>
                </td>
                <td className="p-6 text-[9px] font-bold text-gray-500 uppercase tracking-widest">{p.category}</td>
                <td className="p-6 text-xs font-bold text-black font-sans">${Number(p.price).toLocaleString()}</td>
                <td className="p-6 flex gap-4 text-gray-300">
                  <button onClick={() => handleEdit(p)} className="hover:text-gold transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-5xl bg-white rounded-3xl p-10 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b pb-6">
                <h2 className="text-2xl font-bold text-black">{editingId ? 'Edit' : 'Add New'} <span className="text-gold font-serif italic">Product</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* PHOTO UPLOAD SECTION */}
                <div className="space-y-4">
                   <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Product Photos (Max 3)</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {previews.map((src, i) => (
                       <div key={i} className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                         <img src={src} className="w-full h-full object-cover" alt="preview" />
                         <button type="button" onClick={() => removePreview(i)} className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 shadow-lg hover:bg-white"><Trash size={12}/></button>
                       </div>
                     ))}
                     {previews.length < 3 && (
                       <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-gold hover:text-gold transition-all">
                         <Camera size={24} />
                         <span className="text-[8px] font-bold uppercase mt-2">Upload Photo</span>
                       </button>
                     )}
                   </div>
                   <input type="file" name="images" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Product Name" name="name" defaultValue={formData.name} placeholder="e.g. Rolex Daytona" />
                  <Input label="Price (USD)" name="price" defaultValue={formData.price} placeholder="75000" />
                  <Select label="Category" name="category" value={formData.category} options={CATEGORIES} onChange={(v) => setFormData({...formData, category: v})} />
                  <Input label="SKU / Reference" name="sku" defaultValue={formData.sku} placeholder="Ref-001" />
                </div>

                {/* BRAND SELECTION */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand</label>
                   <input 
                     list="brand-list" 
                     name="brand" 
                     defaultValue={formData.brand} 
                     placeholder="Select or type new brand..."
                     className="w-full bg-white border border-gray-100 rounded-xl px-5 py-3.5 text-sm text-black outline-none focus:border-gold shadow-sm" 
                   />
                   <datalist id="brand-list">
                     {brands.map(b => <option key={b} value={b} />)}
                   </datalist>
                </div>

                {/* CATEGORY SPECIFIC FIELDS */}
                <div className="p-8 bg-gray-50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100">
                  {formData.category === 'Watches' && (
                    <>
                      <Select label="Movement" name="movement" defaultValue={formData.movement} options={FILTERS.movements} />
                      <Input label="Case Material" name="case_material" defaultValue={formData.case_material} placeholder="e.g. Gold, Steel" />
                    </>
                  )}
                  {formData.category === 'Gold' && (
                    <>
                      <Select label="Gold Purity" name="gold_purity" defaultValue={formData.gold_purity} options={FILTERS.purities} />
                      <Input label="Weight (Grams)" name="weight_grams" defaultValue={formData.weight_grams} placeholder="100" />
                    </>
                  )}
                  {formData.category === 'Diamonds' && (
                    <>
                      <Select label="Clarity" name="diamond_clarity" defaultValue={formData.diamond_clarity} options={FILTERS.clarities} />
                      <Select label="Shape" name="shape" defaultValue={formData.shape} options={FILTERS.shapes} />
                      <Input label="Carat Weight" name="carat_weight" defaultValue={formData.carat_weight} placeholder="2.5" />
                    </>
                  )}
                </div>

                {/* MEDIA UPLOAD SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Video size={14}/> Product Video (.mp4)</label>
                     <input type="file" name="video_file" accept="video/mp4" className="text-[10px] text-gray-400 file:bg-gray-100 file:border-none file:px-4 file:py-2 file:rounded-full file:mr-4 file:cursor-pointer" />
                     {formData.video_url && <p className="text-[8px] text-gold truncate">Active: {formData.video_url}</p>}
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Cuboid size={14}/> 3D Model (.glb)</label>
                     <input type="file" name="model_file" accept=".glb" className="text-[10px] text-gray-400 file:bg-gray-100 file:border-none file:px-4 file:py-2 file:rounded-full file:mr-4 file:cursor-pointer" />
                     {formData.three_d_model && <p className="text-[8px] text-gold truncate">Active: {formData.three_d_model}</p>}
                   </div>
                </div>

                <div className="md:col-span-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                   <textarea 
                     name="description" 
                     defaultValue={formData.description} 
                     className="w-full bg-white border border-gray-100 rounded-xl p-5 text-sm min-h-[120px] outline-none focus:border-gold shadow-sm" 
                   />
                </div>

                <button disabled={isSubmitting} className="w-full bg-black text-white py-6 rounded-full font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : editingId ? 'Update Product' : 'Publish Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Input({ label, name, defaultValue, placeholder = "" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        name={name} 
        defaultValue={defaultValue} 
        placeholder={placeholder} 
        className="w-full bg-white border border-gray-100 rounded-xl px-5 py-3.5 text-sm text-black outline-none focus:border-gold transition-all shadow-sm" 
      />
    </div>
  )
}

function Select({ label, name, value, defaultValue, options, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <select 
        name={name} 
        value={value} 
        defaultValue={defaultValue} 
        onChange={(e) => onChange?.(e.target.value)} 
        className="w-full bg-white border border-gray-100 rounded-xl px-5 py-3.5 text-sm text-black outline-none focus:border-gold h-[52px] shadow-sm cursor-pointer"
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}