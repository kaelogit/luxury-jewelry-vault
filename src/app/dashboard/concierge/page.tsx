'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, ShieldCheck, User, Headset, 
  Paperclip, Image as ImageIcon, MoreVertical, 
  ArrowLeft, Lock, Loader2, Globe, Clock
} from 'lucide-react'
import Link from 'next/link'

// MOCK DATA for the "Greater" visual experience
const THREADS = [
  { id: 1, title: "Acquisition Settlement", asset: "Patek Philippe 5711", status: "Active", lastMsg: "Armored transit confirmed for Jan 06." },
  { id: 2, title: "Bespoke Sourcing", asset: "Fancy Vivid Pink Diamond", status: "Pending", lastMsg: "We are auditing a stone in Antwerp." },
]

export default function ConciergePage() {
  const [activeThread, setActiveThread] = useState(THREADS[0])
  const [message, setMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <main className="h-screen bg-ivory-100 flex overflow-hidden selection:bg-gold selection:text-white">
      
      {/* I. THREAD REGISTRY (Sidebar) */}
      <aside className="w-96 border-r border-ivory-300 bg-white flex flex-col">
        <div className="p-10 border-b border-ivory-100 space-y-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-obsidian-300 hover:text-gold uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Return to Vault
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-obsidian-900 italic tracking-tighter">Concierge <span className="text-obsidian-400">Desk.</span></h1>
            <p className="text-[9px] font-black text-gold uppercase tracking-[0.4em] italic">E2E Encrypted Channel</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {THREADS.map((thread) => (
            <button 
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-500 ${activeThread.id === thread.id ? 'bg-obsidian-900 border-obsidian-900 shadow-xl' : 'bg-white border-ivory-200 hover:border-gold/30'}`}
            >
              <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${activeThread.id === thread.id ? 'text-gold' : 'text-gold'}`}>
                {thread.status} Protocol
              </p>
              <h4 className={`text-md font-bold italic tracking-tight mb-1 ${activeThread.id === thread.id ? 'text-white' : 'text-obsidian-900'}`}>
                {thread.title}
              </h4>
              <p className={`text-[10px] truncate ${activeThread.id === thread.id ? 'text-white/50' : 'text-obsidian-300'}`}>
                {thread.lastMsg}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* II. DIALOGUE INTERFACE (Main) */}
      <section className="flex-1 flex flex-col relative">
        {/* Persistent Background Security Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <ShieldCheck size={500} className="text-obsidian-900" />
        </div>

        {/* HEADER: Custodian Identity */}
        <header className="p-8 border-b border-ivory-300 bg-white/80 backdrop-blur-xl flex justify-between items-center relative z-20">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-14 h-14 bg-ivory-100 border border-ivory-300 rounded-2xl flex items-center justify-center text-gold">
                <Headset size={24} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold border-4 border-white rounded-full" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-obsidian-900 uppercase tracking-tight italic">Vault Custodian #402</h3>
              <div className="flex items-center gap-3 text-[10px] text-obsidian-400 font-black uppercase tracking-widest">
                <Globe size={10} className="text-gold" /> Node: Zurich Central
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-ivory-50 border border-ivory-200 rounded-full flex items-center gap-2 text-[9px] font-black text-obsidian-300 uppercase tracking-widest">
                <Lock size={10} className="text-gold" /> AES-256
             </div>
             <MoreVertical className="text-ivory-300" size={20} />
          </div>
        </header>

        {/* MESSAGE REGISTRY */}
        <div className="flex-1 overflow-y-auto p-12 space-y-10 relative z-10" ref={scrollRef}>
          <Message 
            sender="custodian" 
            text="Welcome back, Sovereign. I have verified your recent acquisition of the Patek Philippe 5711. Our logistics team in Zurich has successfully moved the asset from the primary vault to the armored transit depot." 
            time="11:42 AM"
          />
          <Message 
            sender="client" 
            text="Thank you. Can you confirm if the GIA certificate is physically included in the transport case, or is it only available as a Digital Twin in my dashboard?" 
            time="11:45 AM"
          />
          <Message 
            sender="custodian" 
            text="The physical document is secured in the inner hermetic seal of the case. I am attaching a high-res scan of the refinery signature for your immediate review." 
            time="11:46 AM"
          />
          {/* SYSTEM EVENT: Certificate Delivered */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-obsidian-900 rounded-[3rem] border border-gold/30 shadow-2xl flex items-center justify-between gap-8 group"
          >
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gold border border-white/10">
                  <ShieldCheck size={28} />
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Encrypted Manifest Attached</p>
                  <p className="text-white text-sm font-medium italic">Sovereign_Registry_Signature_8821.pdf</p>
               </div>
            </div>
            <button className="px-8 py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
              Download
            </button>
          </motion.div>
        </div>

        {/* INPUT COMMAND */}
        <footer className="p-8 bg-white border-t border-ivory-300 relative z-20">
          <form className="max-w-4xl mx-auto flex items-center gap-6">
             <button type="button" className="p-4 text-obsidian-300 hover:text-gold transition-colors">
                <Paperclip size={20} />
             </button>
             <input 
              type="text" 
              placeholder="Transmit secure message..."
              className="flex-1 bg-ivory-50 border border-ivory-200 rounded-2xl py-5 px-8 text-obsidian-900 font-medium outline-none focus:border-gold transition-all"
             />
             <button type="submit" className="p-5 bg-obsidian-900 text-gold rounded-2xl hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95">
                <Send size={20} />
             </button>
          </form>
        </footer>
      </section>
    </main>
  )
}

function Message({ sender, text, time }: any) {
  const isClient = sender === 'client'
  return (
    <div className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] space-y-2`}>
        <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-sm ${
          isClient 
          ? 'bg-gold text-white rounded-br-none italic font-medium' 
          : 'bg-white border border-ivory-300 text-obsidian-600 rounded-bl-none italic'
        }`}>
          {text}
        </div>
        <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-obsidian-300 ${isClient ? 'justify-end' : 'justify-start'}`}>
          {time} {isClient ? <Clock size={10} /> : <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />}
        </div>
      </div>
    </div>
  )
}