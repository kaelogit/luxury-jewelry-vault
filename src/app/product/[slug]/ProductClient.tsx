'use client'

import React, { useRef } from 'react'
import { 
  ShieldCheck, Globe, Zap, Award, Weight, Box, 
  Gem, ChevronRight, Fingerprint, 
  Clock, ArrowRight, Share2, FileCheck, Star, 
  ChevronLeft, Verified, ShoppingBag, Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelectionStore } from '@/store/useSelectionStore'
import { useUIStore } from '@/store/useUIStore'
import Link from 'next/link'
import SovereignReviews from '@/components/product/SovereignReviews'

// I. INTERFACE DEFINITION: Syncing Registry Metadata
interface Product {
  id: string
  title: string
  price: number
  image_url: string
  asset_class: string
  serial_number: string
  description: string
  slug: string
  gold_purity?: string
  gia_report_number?: string
  specifications?: {
    reference?: string
    movement?: string
    year?: string
    carat?: string
    clarity?: string
    color?: string
    weight?: string
    type?: string
  }
}

interface ProductClientProps {
  product: Product
  recommendations: Product[]
}

export default function ProductClient({ product, recommendations }: ProductClientProps) {
  const addItem = useSelectionStore((state) => state.addItem)
  const openDrawer = useUIStore((state) => state.openSelectionDrawer)
  const scrollRef = useRef<HTMLDivElement>(null)

  // II. ACQUISITION LOGIC: Handshake with Selection Store
  const handleAcquisition = () => {
    if (!product) return
    addItem({
      id: product.id,
      title: product.title, // Mapping title to name for store consistency
      price: product.price,
      image: product.image_url, // Mapping image_url to image for store consistency
      house: product.asset_class,
      asset_class: product.asset_class
    })
    openDrawer()
  }

  // III. LOGISTICS NAVIGATION: Slider Logic
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const isHighValue = Number(product.price) >= 50000

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 md:pt-40 pb-32 px-6 md:px-12 selection:bg-gold selection:text-white overflow-x-hidden">
      <div className="max-w-[1800px] mx-auto">
        
        {/* BREADCRUMBS: The Sovereign Path */}
        <nav className="flex items-center gap-6 mb-16 text-[10px] font-black uppercase tracking-[0.4em]">
          <Link href="/collection" className="text-obsidian-300 hover:text-gold transition-colors italic">Registry</Link>
          <ChevronRight size={10} className="text-ivory-300" />
          <span className="text-obsidian-300 uppercase italic">{product.asset_class}</span>
          <ChevronRight size={10} className="text-ivory-300" />
          <span className="text-obsidian-900 border-b border-gold/40 pb-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-40 items-start mb-48">
          
          {/* IV. VISUAL ENGINE: The Optical Chamber */}
          <div className="lg:sticky lg:top-40">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="aspect-square bg-white border border-ivory-300 rounded-[3.5rem] md:rounded-[5rem] overflow-hidden relative group shadow-2xl"
            >
              <img 
                src={product.image_url} 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2.5s] group-hover:scale-105" 
                alt={product.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/10 via-transparent to-transparent opacity-60" />
              
              {/* Institutional Badging */}
              <div className="absolute top-10 left-10 flex flex-col gap-4">
                 <div className="px-6 py-3 bg-white/90 backdrop-blur-2xl border border-ivory-200 rounded-full flex items-center gap-3 shadow-xl">
                    <ShieldCheck size={14} className="text-gold" />
                    <span className="text-[10px] font-black text-obsidian-900 uppercase tracking-[0.3em]">Vault Secured</span>
                 </div>
                 {isHighValue && (
                   <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-6 py-3 bg-gold text-white rounded-full flex items-center gap-3 shadow-2xl shadow-gold/20"
                   >
                     <Star size={12} fill="white" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Reserve Asset</span>
                   </motion.div>
                 )}
              </div>
            </motion.div>
          </div>

          {/* V. MANIFEST: Technical specifications & Acquisition */}
          <div className="space-y-24">
            <header className="space-y-10">
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <Verified size={16} className="text-gold" />
                  <span className="text-[11px] font-black text-gold uppercase tracking-[0.5em] italic leading-none">Institutional Authenticated</span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-300 uppercase tracking-widest leading-none border-l border-ivory-300 pl-8 italic">SIG_{product.serial_number}</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-7xl md:text-[10rem] font-light text-obsidian-900 tracking-tighter leading-[0.8] italic uppercase">
                  {product.title.split(' ').map((word, i) => i === 1 ? <span key={i} className="text-obsidian-400">{word} </span> : word + ' ')}
                </h1>
                <p className="text-5xl md:text-7xl font-light text-obsidian-900 tracking-tighter italic">
                  ${Number(product.price).toLocaleString()} <span className="text-xl md:text-2xl text-obsidian-200 non-italic font-black ml-4 uppercase">USD</span>
                </p>
              </div>

              <p className="text-obsidian-600 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl italic border-l-2 border-gold pl-10">
                {product.description || "A physical masterwork secured within the Lume deep-storage network. Fully verified through GIA/LBMA protocols and prepared for armored transit."}
              </p>
            </header>

            {/* THE TECHNICAL BLUEPRINT GRID */}
            <section className="space-y-16">
              <div className="flex items-center gap-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-obsidian-300 italic">Technical Blueprint</h4>
                 <div className="h-[1px] flex-1 bg-ivory-300" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-12">
                <TechnicalSpec label="Asset Classification" value={product.asset_class} icon={<Box size={16} />} />
                
                {product.asset_class === 'WATCH' && (
                  <>
                    <TechnicalSpec label="Reference Signature" value={product.specifications?.reference} icon={<Fingerprint size={16}/>} />
                    <TechnicalSpec label="Movement Calibre" value={product.specifications?.movement} icon={<Clock size={16}/>} />
                  </>
                )}
                {product.asset_class === 'DIAMOND' && (
                  <>
                    <TechnicalSpec label="Carat Mass" value={product.specifications?.carat} icon={<Gem size={16}/>} />
                    <TechnicalSpec label="GIA Verification ID" value={product.gia_report_number} icon={<FileCheck size={16}/>} />
                  </>
                )}
                {product.asset_class === 'GOLD' && (
                  <>
                    <TechnicalSpec label="Fineness Purity" value={product.gold_purity} icon={<Award size={16}/>} />
                    <TechnicalSpec label="Net Physical Weight" value={product.specifications?.weight} icon={<Weight size={16}/>} />
                  </>
                )}
              </div>
            </section>

            {/* THE ACQUISITION TERMINAL */}
            <div className="p-10 md:p-16 bg-white border border-ivory-300 rounded-[4rem] space-y-14 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-10 border-b border-ivory-100 pb-14">
                 <div className="text-center md:text-left space-y-3">
                   <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.3em]">Logistical Status</p>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                      <p className="text-sm font-bold text-gold uppercase tracking-[0.2em] italic">Immediate Release Active</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-5 bg-ivory-50 border border-ivory-200 rounded-2xl text-obsidian-400 hover:text-gold hover:border-gold transition-all shadow-inner"><Share2 size={20} /></button>
                    <button className="p-5 bg-ivory-50 border border-ivory-200 rounded-2xl text-obsidian-400 hover:text-gold hover:border-gold transition-all shadow-inner"><Download size={20} /></button>
                 </div>
              </div>

              <button 
                onClick={handleAcquisition} 
                className="group relative w-full h-[92px] bg-obsidian-900 text-gold rounded-[2rem] text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-6 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Initiate Acquisition</span> 
                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        {/* VI. MEMBER LEDGER: Social Verification */}
        <SovereignReviews productId={product.id} assetClass={product.asset_class} />

        {/* VII. MARKET INTELLIGENCE: Complementary Assets */}
        <section className="pb-32 mt-48">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 px-4 gap-12">
             <div className="space-y-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                   <ShoppingBag className="text-gold" size={16} />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic leading-none">Market Intelligence</p>
                </div>
                <h3 className="text-6xl md:text-8xl font-light text-obsidian-900 uppercase italic tracking-tighter leading-none">
                  Members also <br/> <span className="text-obsidian-400">Acquired.</span>
                </h3>
             </div>
             <div className="flex gap-6">
                <button 
                  onClick={() => scroll('left')}
                  className="w-16 h-16 bg-white border border-ivory-300 rounded-full flex items-center justify-center text-obsidian-300 hover:text-gold hover:border-gold transition-all shadow-sm"
                >
                  <ChevronLeft size={24}/>
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-16 h-16 bg-white border border-ivory-300 rounded-full flex items-center justify-center text-obsidian-300 hover:text-gold hover:border-gold transition-all shadow-sm"
                >
                  <ChevronRight size={24}/>
                </button>
             </div>
          </div>

          <div className="relative -mx-6 md:-mx-12">
            <div 
              ref={scrollRef}
              className="flex gap-12 overflow-x-auto px-6 md:px-12 pb-20 no-scrollbar scroll-smooth snap-x"
            >
              {recommendations.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/product/${item.slug}`} 
                  className="w-[350px] md:w-[600px] shrink-0 group snap-start"
                >
                  <div className="aspect-[16/10] bg-white border border-ivory-300 rounded-[4rem] overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:border-gold/30 transition-all duration-1000 relative">
                    <img 
                      src={item.image_url} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/20 to-transparent" />
                  </div>
                  <div className="mt-10 flex justify-between items-start px-6">
                    <div className="space-y-3">
                       <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em] italic leading-none">{item.asset_class}</p>
                       <h5 className="text-3xl font-light text-obsidian-900 uppercase tracking-tight italic group-hover:text-gold transition-colors duration-700 leading-tight">
                         {item.title}
                       </h5>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-obsidian-200 uppercase tracking-widest italic mb-1 leading-none">Valuation</p>
                       <p className="text-2xl font-light text-obsidian-400 italic tracking-tighter leading-none">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

function TechnicalSpec({ label, value, icon }: { label: string, value: any, icon: any }) {
  return (
    <div className="space-y-6 group">
      <div className="flex items-center gap-4 text-obsidian-300 group-hover:text-gold transition-colors duration-700">
        <div className="p-3 bg-white border border-ivory-300 rounded-xl shadow-sm group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all">
          {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">{label}</span>
      </div>
      <p className="text-3xl md:text-4xl font-light text-obsidian-900 italic tracking-tight uppercase pl-16 border-l border-gold/20 group-hover:border-gold transition-all duration-1000 leading-none">
        {value || 'Verification Pending'}
      </p>
    </div>
  )
}