'use client'

import React, { useState, useMemo } from 'react'
import { 
  ChevronRight, ShoppingBag, Truck, ShieldCheck, CheckCircle2, Cuboid, ChevronLeft, ArrowRight 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelectionStore } from '@/store/useSelectionStore'
import { useUIStore } from '@/store/useUIStore'
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Image from 'next/image'
import SovereignReviews from '@/components/product/SovereignReviews' // NEW INTEGRATION

// I. PERFORMANCE TOOLKIT
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

interface Product {
  id: string; name: string; price: number; images: string[]; category: 'Watches' | 'Diamonds' | 'Gold';
  sub_category?: string; description: string; slug: string; sku?: string;
  brand?: string; gold_purity?: string; diamond_clarity?: string;
  diamond_color?: string; diamond_cut?: string; shape?: string; 
  movement?: string; case_material?: string; has_box_and_papers?: boolean;
  weight_grams?: number; metal_color?: string; video_url?: string; three_d_model?: string;
}

export default function ProductClient({ product, recommendations }: { product: Product, recommendations: any[] }) {
  const addItem = useSelectionStore((state) => state.addItem)
  const openDrawer = useUIStore((state) => state.openSelectionDrawer)
  
  const [activeTab, setActiveTab] = useState<'specs' | 'logistics'>('specs')
  const [currentImg, setCurrentImg] = useState(0)
  const [show3D, setShow3D] = useState(false) 

  const technicalSpecs = useMemo(() => [
    { label: 'Registry ID', value: product.sku || product.id.slice(0, 8).toUpperCase() },
    { label: 'Maison', value: product.brand },
    { label: 'Movement', value: product.movement },
    { label: 'Fineness', value: product.gold_purity },
    { label: 'Clarity', value: product.diamond_clarity },
    { label: 'Color Grade', value: product.diamond_color },
    { label: 'Mass', value: product.weight_grams ? `${product.weight_grams}g` : null },
    { label: 'Cut / Shape', value: product.shape },
    { label: 'Case Material', value: product.case_material },
    { label: 'Finish', value: product.metal_color },
  ].filter(spec => spec.value), [product]);

  const handleAcquisition = () => {
    addItem({
      id: product.id, name: product.name, price: product.price,
      image: product.images?.[0] || '', category: product.category,
      slug: product.slug, house: product.brand || 'Lume Vault'
    })
    openDrawer()
  }

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        
        {/* II. BREADCRUMBS */}
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian-400">
          <Link href="/collection" className="hover:text-gold transition-colors">Archive</Link>
          <ChevronRight size={10} className="text-gold" />
          <span className="text-gold font-black">{product.category}</span>
          <ChevronRight size={10} className="text-gold" />
          <span className="text-obsidian-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
          
          {/* III. MEDIA STAGE */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/5] bg-ivory-50 border border-ivory-200 rounded-sm overflow-hidden group">
              <AnimatePresence mode="wait">
                {!show3D ? (
                  <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    <Image 
                      src={product.images?.[currentImg] || ''} 
                      alt={product.name} 
                      fill 
                      priority 
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </motion.div>
                ) : (
                  <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    {/* @ts-ignore */}
                    <model-viewer
                      src={product.three_d_model}
                      poster={product.images[0]}
                      auto-rotate
                      camera-controls
                      touch-action="pan-y"
                      style={{ width: '100%', height: '100%' } as any}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NAVIGATION OVERLAYS */}
              {!show3D && product.images?.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <MediaNavButton onClick={() => setCurrentImg(prev => (prev > 0 ? prev - 1 : product.images.length - 1))} icon={<ChevronLeft size={20} />} />
                  <MediaNavButton onClick={() => setCurrentImg(prev => (prev < product.images.length - 1 ? prev + 1 : 0))} icon={<ChevronRight size={20} />} />
                </div>
              )}
            </div>

            {/* THUMBNAIL TICKER */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {product.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => { setCurrentImg(i); setShow3D(false); }} 
                  className={`relative w-24 h-28 flex-shrink-0 rounded-sm overflow-hidden border transition-all ${currentImg === i && !show3D ? 'border-gold shadow-lg' : 'border-ivory-200 opacity-40 hover:opacity-100'}`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
              {product.three_d_model && (
                <button onClick={() => setShow3D(true)} className={`w-24 h-28 flex-shrink-0 bg-obsidian-900 flex flex-col items-center justify-center gap-2 rounded-sm border transition-all ${show3D ? 'border-gold shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <Cuboid size={20} className="text-gold" />
                  <span className="text-[8px] text-white font-black uppercase tracking-widest">360° VIEW</span>
                </button>
              )}
            </div>
          </div>

          {/* IV. ASSET INFORMATION */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-ivory-100 px-4 py-1.5 border border-gold/20 rounded-full text-[9px] font-black uppercase tracking-widest text-gold">
                  {product.brand || product.category}
                </span>
                {product.has_box_and_papers && (
                  <div className="flex items-center gap-2 text-[9px] font-bold text-obsidian-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-gold" /> Registry Verified
                  </div>
                )}
              </div>
              <h1 className="text-5xl md:text-8xl font-medium text-obsidian-900 tracking-tight leading-[0.85] font-serif italic">
                {product.name}
              </h1>
              <p className="text-4xl md:text-5xl font-light text-obsidian-900 font-serif">
                ${Number(product.price).toLocaleString()}
              </p>
            </header>

            <div className="space-y-10">
              <p className="text-xl text-obsidian-600 leading-relaxed font-medium italic border-l-2 border-gold pl-8">
                {product.description}
              </p>

              <div className="space-y-6">
                <button 
                  onClick={handleAcquisition} 
                  className="w-full py-8 bg-obsidian-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-gold hover:text-obsidian-900 transition-all duration-700 shadow-2xl active:scale-95 group"
                >
                  Secure Acquisition <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <TrustBadge icon={<Truck size={14} />} text="Insured Logistics" />
                  <TrustBadge icon={<CheckCircle2 size={14} />} text="Professional Audit" />
                </div>
              </div>
            </div>

            {/* V. TECHNICAL REGISTRY ACCORDIONS */}
            <div className="border-t border-ivory-200 pt-10">
               <Accordion title="Technical Registry" isOpen={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>
                 <div className="grid grid-cols-2 gap-y-6 text-[11px] font-bold uppercase tracking-[0.2em] text-obsidian-900 pb-10">
                    {technicalSpecs.map((spec, i) => (
                      <React.Fragment key={i}>
                        <p className="text-obsidian-400 italic">{spec.label}</p>
                        <p className="text-right md:text-left">{spec.value}</p>
                      </React.Fragment>
                    ))}
                 </div>
               </Accordion>

               <Accordion title="Handover Protocol" isOpen={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')}>
                 <div className="space-y-4 pb-10">
                    <p className="text-[12px] text-obsidian-500 leading-relaxed font-medium">
                      All acquisitions include fully insured global transit. Title of ownership is officially transferred upon physical handover and signature verification.
                    </p>
                    <Link href="/shipping" className="text-[10px] font-black uppercase text-gold tracking-widest border-b border-gold/30 pb-1">
                      View Logistics Standards
                    </Link>
                 </div>
               </Accordion>
            </div>
          </div>
        </div>

        {/* VI. SOVEREIGN VERDICT (INTEGRATED) */}
        <SovereignReviews productId={product.id} category={product.category} />

        {/* VII. RECOMMENDATIONS */}
        <section className="mt-32 pt-24 border-t border-ivory-200">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Curation</p>
               <h2 className="text-4xl md:text-6xl font-serif italic text-obsidian-900 leading-none">Complementary <br/> <span className="text-gold not-italic">Acquisitions.</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {recommendations.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function MediaNavButton({ onClick, icon }: any) {
  return (
    <button onClick={onClick} className="pointer-events-auto p-4 bg-white/95 rounded-full shadow-2xl hover:bg-obsidian-900 hover:text-white transition-all opacity-0 group-hover:opacity-100">
      {icon}
    </button>
  )
}

function TrustBadge({ icon, text }: any) {
  return (
    <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-obsidian-400 uppercase tracking-widest border border-ivory-200 py-5 rounded-2xl bg-ivory-50/50">
      <div className="text-gold">{icon}</div> {text}
    </div>
  )
}

function Accordion({ title, children, isOpen, onClick }: any) {
  return (
    <div className="border-b border-ivory-100 group">
      <button onClick={onClick} className="w-full flex justify-between items-center py-8 text-[12px] font-black uppercase tracking-[0.4em] text-obsidian-900 transition-all hover:text-gold">
        {title}
        <div className={`w-1.5 h-1.5 bg-gold rounded-full transition-all duration-700 ${isOpen ? 'scale-[4] shadow-[0_0_20px_rgba(197,160,40,0.8)]' : 'opacity-20'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}