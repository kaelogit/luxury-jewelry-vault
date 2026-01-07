'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileVideo, Box, X, ShieldCheck, Fingerprint, Film } from 'lucide-react'

interface FilePreview {
  name: string
  type: string
  size: string
}

export default function MediaUploader({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [previews, setPreviews] = useState<FilePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (files: File[]) => {
    const newPreviews = files.map(f => ({ 
      name: f.name, 
      type: f.type, 
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB' 
    }))
    setPreviews(newPreviews)
    onUpload(files)
  }

  const removeFile = (index: number) => {
    setPreviews(prev => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div className="space-y-8">
      {/* I. INGRESS ZONE */}
      <div 
        className={`
          relative group border border-dashed rounded-2xl p-16 
          flex flex-col items-center justify-center text-center transition-all duration-700
          ${isDragging ? 'border-gold bg-gold/5' : 'border-ivory-300 bg-white hover:border-gold/30'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <input 
          type="file" 
          multiple 
          accept="video/mp4,.glb,.jpg,.png"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative w-20 h-20 bg-ivory-50 border border-ivory-200 rounded-2xl flex items-center justify-center text-gold shadow-inner transition-transform group-hover:scale-110">
             <UploadCloud size={32} strokeWidth={1} />
           </div>
        </div>
        
        <div className="space-y-3 relative z-10">
          <h4 className="text-2xl font-medium text-obsidian-900 font-serif italic tracking-tight">Register Master Artifacts</h4>
          <p className="label-caps text-obsidian-400">Upload 4K Cinematic or 3D Spatial Geometry</p>
        </div>

        <div className="mt-8 px-6 py-2 bg-ivory-50 border border-ivory-200 rounded-full flex items-center gap-3">
           <ShieldCheck size={12} className="text-gold" />
           <span className="text-[9px] font-bold text-obsidian-500 uppercase tracking-widest">Encrypted Upload Active</span>
        </div>
      </div>

      {/* II. REGISTRY LIST */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 px-2 mb-4">
                <Fingerprint size={14} className="text-gold" />
                <p className="label-caps text-obsidian-400">Vault Ingress Queue</p>
            </div>

            {previews.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-white p-5 rounded-xl border border-ivory-200 shadow-sm group hover:border-gold/40 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-ivory-50 rounded-lg flex items-center justify-center text-gold border border-ivory-200 shadow-inner">
                    {file.name.endsWith('.glb') ? <Box size={20} /> : <Film size={20} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-obsidian-900 truncate max-w-[280px] font-serif italic">{file.name}</p>
                    <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest">{file.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 px-3 py-1 bg-gold/5 border border-gold/20 rounded-full">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                      <span className="text-[8px] font-bold text-gold uppercase tracking-widest">Authenticated</span>
                   </div>
                   <button 
                    onClick={() => removeFile(i)}
                    className="text-ivory-300 hover:text-red-500 transition-colors p-2"
                   >
                     <X size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}