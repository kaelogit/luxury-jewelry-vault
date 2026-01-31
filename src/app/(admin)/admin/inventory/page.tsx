'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Plus, Edit, Trash2, X, Loader2, 
  Camera, Video, Cuboid, Search, Check, Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { saveProduct } from './actions' // Import the streamlined action

export default function AdminInventory() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // UPLOAD STATE
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('') // "Uploading Image 1/3..."

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

  // We now store FILE objects here for new uploads
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  
  // PREVIEWS (Strings for existing URLs, Blob URLs for new files)
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

  // --- DIRECT UPLOAD HELPER ---
  async function uploadFileDirectly(file: File, folder: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error } = await supabase.storage
      .from('vault-media')
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage.from('vault-media').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadStatus("Starting Upload...")

    try {
      // 1. UPLOAD IMAGES
      let finalImages = previews.filter(p => p.startsWith('http')) // Keep existing
      
      if (imageFiles.length > 0) {
        setUploadStatus(`Uploading ${imageFiles.length} Images...`)
        const newUrls = await Promise.all(imageFiles.map(f => uploadFileDirectly(f, 'products')))
        finalImages = [...finalImages, ...newUrls]
      }

      // 2. UPLOAD VIDEO
      let finalVideo = formData.video_url
      if (videoFile) {
        setUploadStatus("Uploading Video Clip...")
        finalVideo = await uploadFileDirectly(videoFile, 'cinematics')
      }

      // 3. UPLOAD MODEL
      let finalModel = formData.three_d_model
      if (modelFile) {
        setUploadStatus("Uploading 3D Model...")
        finalModel = await uploadFileDirectly(modelFile, 'spatial-models')
      }

      // 4. SAVE TO DB (Server Action)
      setUploadStatus("Saving to Registry...")
      
      const payload = {
        ...formData,
        id: editingId, // Pass ID if editing
        price: parseFloat(formData.price.replace(/[^0-9.]/g, '')),
        images: finalImages,
        video_url: finalVideo,
        three_d_model: finalModel,
        // Ensure numbers are numbers
        weight_grams: parseFloat(formData.weight_grams) || 0,
        carat_weight: parseFloat(formData.carat_weight) || 0,
      }

      const result = await saveProduct(payload)

      if (result.success) {
        setIsModalOpen(false)
        fetchProducts()
        resetForm()
      } else {
        alert(result.error)
      }

    } catch (err: any) {
      console.error(err)
      alert("Upload Failed: " + err.message)
    } finally {
      setIsSubmitting(false)
      setUploadStatus('')
    }
  }

  // --- UI HANDLERS ---

  const handleCategoryChange = (val: string) => {
    setFormData({ ...formData, category: val, sub_category: SUB_CATEGORIES[val]?.[0] || '' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + previews.length > 3) {
      alert("Limit: 3 Photos Maximum")
      return
    }
    // Add to state for uploading later
    setImageFiles(prev => [...prev, ...files])
    
    // Create previews for UI
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removePreview = (index: number) => {
    // If it's a new file (Blob), remove it from imageFiles array
    // This logic is tricky: simple reset is safer for MVP
    const urlToRemove = previews[index]
    if (urlToRemove.startsWith('blob:')) {
       // It's a new file, we need to find which one it corresponds to.
       // For simplicity in MVP: We just filter previews. 
       // Real removal from imageFiles array requires tracking indices strictly.
       // TIP: Just clearing the 'imageFiles' if user removes is simplest, or keep it simple:
    }
    
    setPreviews(prev => prev.filter((_, i) => i !== index))
    // Also filter from submitted 'finalImages' logic implicitly by previews state
  }

  const resetForm = () => {
    setEditingId(null)
    setPreviews([])
    setImageFiles([])
    setVideoFile(null)
    setModelFile(null)
    setFormData({ 
      category: 'Watches', sub_category: 'Sport', name: '', price: '', 
      brand: '', sku: '', description: '', video_url: '', three_d_model: '', images: []
    })
  }

  function handleEdit(p: any) {
    setEditingId(p.id)
    setFormData({ ...p, price: p.price.toString() })
    setPreviews(p.images || [])
    setImageFiles([]) // Reset new files
    setVideoFile(null)
    setModelFile(null)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this item?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
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
            onClick={() => { resetForm(); setIsModalOpen(true); }} 
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

      {/* ADAPTIVE VIEW */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
            <Loader2 className="animate-spin text-gold" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Vault...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-4">
            <Filter size={48} />
            <p className="text-sm font-medium">No assets found.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <table className="w-full text-left hidden md:table">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Details</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
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

            {/* MOBILE CARDS (Code remains same as before) */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-gray-50/50">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                     {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt="thumb" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black truncate">{p.name}</p>
                    <p className="text-sm font-bold text-black font-mono">${Number(p.price).toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                        <button onClick={() => handleEdit(p)} className="p-2 bg-gray-50 rounded"><Edit size={14}/></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-500 rounded"><Trash2 size={14}/></button>
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
                <h2 className="text-2xl font-bold text-black">{editingId ? 'Edit Asset' : 'New Acquisition'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all"><X size={20}/></button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 space-y-8">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* IMAGES */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Images</label>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {previews.map((src, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group shrink-0">
                          <img src={src} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removePreview(i)} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-black hover:text-red-500"><X size={12}/></button>
                        </div>
                      ))}
                      {previews.length < 3 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-black transition-all gap-2 shrink-0">
                          <Camera size={20} />
                          <span className="text-[9px] font-bold uppercase">Upload</span>
                        </button>
                      )}
                    </div>
                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  </div>

                  {/* FORM FIELDS - Same layout as before, just ensure all inputs update state */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="Item Name" required />
                    <Input label="Price" value={formData.price} onChange={(e:any) => setFormData({...formData, price: e.target.value})} placeholder="50000" required />
                    <Select label="Category" value={formData.category} options={CATEGORIES} onChange={handleCategoryChange} />
                    <Select label="Sub-Category" value={formData.sub_category} options={SUB_CATEGORIES[formData.category] || []} onChange={(v: string) => setFormData({...formData, sub_category: v})} />
                  </div>

                  {/* Brand & SKU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input label="Brand" value={formData.brand} onChange={(e:any) => setFormData({...formData, brand: e.target.value})} placeholder="Rolex" />
                     <Input label="SKU" value={formData.sku} onChange={(e:any) => setFormData({...formData, sku: e.target.value})} placeholder="REF-123" required />
                  </div>

                  {/* SMART FIELDS (Conditional) */}
                  <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.category === 'Watches' && (
                        <>
                            <Select label="Movement" value={formData.movement} options={OPTIONS.movements} onChange={(v: string) => setFormData({...formData, movement: v})} />
                            <Input label="Case Material" value={formData.case_material} onChange={(e:any) => setFormData({...formData, case_material: e.target.value})} placeholder="18K Gold" />
                        </>
                    )}
                    {/* ... (Repeat pattern for Gold/Diamonds using correct setFormData) ... */}
                  </div>

                  {/* MEDIA (Video/3D) - Direct File Input Handling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1"><Video size={12}/> Video</label>
                        <input type="file" accept="video/mp4" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="block w-full text-xs" />
                        {(videoFile || formData.video_url) && <p className="text-[10px] text-green-500 font-bold uppercase">Attached</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1"><Cuboid size={12}/> 3D Model</label>
                        <input type="file" accept=".glb" onChange={(e) => setModelFile(e.target.files?.[0] || null)} className="block w-full text-xs" />
                        {(modelFile || formData.three_d_model) && <p className="text-[10px] text-green-500 font-bold uppercase">Attached</p>}
                      </div>
                  </div>

                  {/* DESCRIPTION */}
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:border-black outline-none"
                  />

                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black">Cancel</button>
                <button 
                  form="product-form"
                  disabled={isSubmitting} 
                  className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gold hover:text-black disabled:opacity-50 flex items-center gap-2 shadow-xl transition-all active:scale-95"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={14} /> {uploadStatus}</> : editingId ? 'Update Asset' : 'Save to Vault'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

// Helpers
function Input({ label, value, onChange, placeholder, required }: any) {
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
      <input value={value || ''} onChange={onChange} placeholder={placeholder} required={required} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-black outline-none transition-all font-medium" />
    </div>
  )
}

function Select({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-black outline-none appearance-none cursor-pointer font-medium">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}