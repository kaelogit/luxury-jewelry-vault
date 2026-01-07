'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, ShieldCheck, Headset, Paperclip, MoreVertical, 
  ArrowLeft, Lock, Loader2, Globe, Clock, FileText, ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ConciergePage() {
  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // I. SECURE CONNECTION: Fetching Client Identity & Active Threads
  useEffect(() => {
    const initTerminal = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('client_id', user.id)
        .order('updated_at', { ascending: false })

      if (data && data.length > 0) {
        setThreads(data)
        setSelectedThread(data[0])
      }
      setLoading(false)
    }
    initTerminal()
  }, [])

  // II. STREAMING PROTOCOL: Real-time Message Ingress
  useEffect(() => {
    if (!selectedThread) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      scrollToBottom()
    }

    fetchMessages()

    const channel = supabase.channel(`advisory-${selectedThread.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `thread_id=eq.${selectedThread.id}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        scrollToBottom()
      }).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedThread])

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // III. TRANSMISSION: Sending Client Commands
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !userId || !selectedThread) return

    const content = newMessage
    setNewMessage('')

    await supabase.from('messages').insert([{
      thread_id: selectedThread.id,
      sender_id: userId,
      sender_type: 'client',
      content
    }])

    // Update the thread's timestamp to move it to the top
    await supabase.from('chat_threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', selectedThread.id)
  }

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-gold animate-spin" size={40} />
      <p className="label-caps text-obsidian-400">Synchronizing Secure Channel</p>
    </div>
  )

  return (
    <main className="h-screen bg-ivory-100 flex overflow-hidden selection:bg-gold selection:text-white">
      
      {/* 1. SIDEBAR: THREAD REGISTRY */}
      <aside className={`w-96 border-r border-ivory-300 bg-white flex flex-col transition-all ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-10 border-b border-ivory-100 space-y-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-obsidian-300 hover:text-gold uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Return to Vault
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-obsidian-900 italic tracking-tighter">Advisory <span className="text-obsidian-400">Desk.</span></h1>
            <p className="text-[9px] font-black text-gold uppercase tracking-[0.4em] italic">E2E Encrypted</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {threads.map((thread) => (
            <button 
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-500 ${selectedThread?.id === thread.id ? 'bg-obsidian-900 border-obsidian-900 shadow-xl' : 'bg-white border-ivory-200 hover:border-gold/30'}`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-2 text-gold">Vault Protocol</p>
              <h4 className={`text-md font-bold italic tracking-tight mb-1 ${selectedThread?.id === thread.id ? 'text-white' : 'text-obsidian-900'}`}>
                {thread.subject}
              </h4>
              <p className={`text-[10px] truncate ${selectedThread?.id === thread.id ? 'text-white/50' : 'text-obsidian-300'}`}>
                Ref: {thread.id.slice(0, 8).toUpperCase()}
              </p>
            </button>
          ))}
          {threads.length === 0 && (
             <div className="text-center py-20 space-y-4 opacity-30">
                <ShieldCheck size={40} className="mx-auto" />
                <p className="label-caps !text-[8px]">No Active Consultations</p>
             </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN: DIALOGUE INTERFACE */}
      <section className="flex-1 flex flex-col relative bg-ivory-50/50">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <ShieldCheck size={500} className="text-obsidian-900" />
        </div>

        {selectedThread ? (
          <>
            <header className="p-8 border-b border-ivory-300 bg-white/80 backdrop-blur-xl flex justify-between items-center relative z-20">
              <div className="flex items-center gap-6">
                <button onClick={() => setSelectedThread(null)} className="md:hidden text-obsidian-400 p-2"><ChevronLeft /></button>
                <div className="relative">
                  <div className="w-14 h-14 bg-ivory-100 border border-ivory-300 rounded-2xl flex items-center justify-center text-gold shadow-inner">
                    <Headset size={24} strokeWidth={1.5} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold border-4 border-white rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-obsidian-900 uppercase tracking-tight italic">Vault Custodian</h3>
                  <div className="flex items-center gap-3 text-[10px] text-obsidian-400 font-black uppercase tracking-widest">
                    <Globe size={10} className="text-gold" /> Node: Global Hub
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-4 py-2 bg-ivory-50 border border-ivory-200 rounded-full flex items-center gap-2 text-[9px] font-black text-obsidian-300 uppercase tracking-widest">
                    <Lock size={10} className="text-gold" /> AES-256 SECURED
                 </div>
                 <MoreVertical className="text-ivory-300 cursor-pointer hover:text-gold transition-colors" size={20} />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-12 space-y-10 relative z-10 custom-scrollbar">
              {messages.map((msg, i) => (
                <Message 
                  key={msg.id} 
                  sender={msg.sender_type} 
                  text={msg.content} 
                  time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                />
              ))}
              <div ref={scrollRef} />
            </div>

            <footer className="p-8 bg-white border-t border-ivory-300 relative z-20">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-6">
                 <button type="button" className="p-4 text-obsidian-300 hover:text-gold transition-colors">
                    <Paperclip size={20} />
                 </button>
                 <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Transmit secure request..."
                  className="flex-1 bg-ivory-50 border border-ivory-200 rounded-2xl py-5 px-8 text-obsidian-900 font-medium outline-none focus:border-gold transition-all shadow-inner"
                 />
                 <button type="submit" className="p-5 bg-obsidian-900 text-gold rounded-2xl hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95">
                    <Send size={20} />
                 </button>
              </form>
            </footer>
          </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-obsidian-200 gap-6">
              <Lock size={64} className="opacity-10" />
              <p className="label-caps text-obsidian-300">Select consultation to view dialogue</p>
           </div>
        )}
      </section>
    </main>
  )
}

function Message({ sender, text, time }: any) {
  const isClient = sender === 'client'
  return (
    <div className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%] space-y-2">
        <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
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