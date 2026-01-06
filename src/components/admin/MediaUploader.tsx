'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileVideo, Box, X, ShieldCheck, Fingerprint } from 'lucide-react'

export default function MediaUploader({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [previews, setPreviews] = useState<{name: string, type: string, size: string}[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (files: File[]) => {
    setPreviews(files.map(f => ({ 
      name: f.name, 
      type: f.type, 
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB' 
    })))
    onUpload(files)
  }

  return (
    <div className="space-y-6">
      {/* I. INGRESS ZONE: The Secure Drop */}
      <div 
        className={`
          relative group border-2 border-dashed rounded-[2.5rem] p-16 
          flex flex-col items-center justify-center text-center transition-all duration-700
          ${isDragging ? 'border-gold bg-gold/5 scale-[0.99]' : 'border-ivory-300 bg-white hover:border-gold/40'}
        `}
        onDragOver={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <input 
          type="file" 
          multiple 
          accept="video/mp4,.glb"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        
        {/* Animated Iconography */}
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-full scale-150 group-hover:bg-gold/20 transition-all" />
           <div className="relative w-20 h-20 bg-ivory-50 border border-ivory-200 rounded-3xl flex items-center justify-center text-gold shadow-inner group-hover:scale-110 transition-transform duration-500">
             <UploadCloud size={32} strokeWidth={1.5} />
           </div>
        </div>
        
        <div className="space-y-2 relative z-10">
          <h4 className="text-xl font-light text-obsidian-900 italic tracking-tight">Submit Master Artifacts</h4>
          <p className="text-[10px] text-obsidian-300 uppercase tracking-[0.4em] font-black">Drag 4K Cinema or 3D Geometry</p>
        </div>

        {/* Requirements Badge */}
        <div className="mt-10 px-6 py-2 bg-ivory-50 border border-ivory-200 rounded-full flex items-center gap-3">
           <ShieldCheck size={12} className="text-gold" />
           <span className="text-[9px] font-black text-obsidian-400 uppercase tracking-widest">Max Load: 100MB per Master</span>
        </div>
      </div>

      {/* II. REGISTRY LIST: The Uploaded Artifacts */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-3"
          >
            <div className="flex items-center gap-3 px-2 mb-2">
               <Fingerprint size={14} className="text-gold" />
               <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest italic">Pending Ingress Protocol</p>
            </div>

            {previews.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm group hover:border-gold/30 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-ivory-50 rounded-xl flex items-center justify-center text-gold border border-ivory-200 group-hover:bg-gold group-hover:text-white transition-all">
                    {file.name.endsWith('.glb') ? <Box size={18} /> : <FileVideo size={18} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-obsidian-900 truncate max-w-[240px] italic">{file.name}</p>
                    <p className="text-[9px] text-obsidian-300 font-black uppercase tracking-widest">{file.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <span className="text-[8px] font-black text-gold border border-gold/20 px-3 py-1 rounded-full uppercase tracking-tighter italic bg-gold/5">
                     Authenticated
                   </span>
                   <button 
                    onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-ivory-300 hover:text-red-400 transition-colors p-1"
                   >
                     <X size={14} />
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