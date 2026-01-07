'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Send, User, ShieldCheck, Gem, MoreVertical, 
  Search, MessageSquare, Loader2, Lock, 
  ArrowLeft, Clock, Fingerprint, Globe, Briefcase, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminAdvisoryHub() {
  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [adminId, setAdminId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // I. SYSTEM INITIALIZATION
  useEffect(() => {
    const initHub = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAdminId(user.id)

      const { data, error } = await supabase
        .from('chat_threads')
        .select(`
          *,
          profiles:client_id (full_name, country)
        `)
        .order('updated_at', { ascending: false })

      if (data) setThreads(data)
      setLoading(false)
    }

    initHub()

    // Real-time synchronization for new inquiries
    const threadChannel = supabase.channel('advisory-sync').on('postgres_changes', { 
      event: '*', schema: 'public', table: 'chat_threads' 
    }, () => initHub()).subscribe()

    return () => { supabase.removeChannel(threadChannel) }
  }, [])

  // II. MESSAGE STREAMING
  useEffect(() => {
    if (!selectedThread) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }

    fetchMessages()

    const msgChannel = supabase.channel(`live-msgs-${selectedThread.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `thread_id=eq.${selectedThread.id}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }).subscribe()

    return () => { supabase.removeChannel(msgChannel) }
  }, [selectedThread])

  // III. OUTBOUND TRANSMISSION
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !adminId || !selectedThread) return

    const content = newMessage
    setNewMessage('')

    const { error } = await supabase.from('messages').insert([
      { 
        thread_id: selectedThread.id, 
        sender_id: adminId, 
        sender_type: 'admin', 
        content 
      }
    ])
  }

  if (loading) return (
    <div className="h-screen bg-ivory-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="label-caps text-obsidian-400">Connecting Advisory Node</p>
    </div>
  )

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 overflow-hidden">
      
      {/* 1. CLIENT DIRECTORY */}
      <aside className="w-80 flex flex-col bg-white border border-ivory-300 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-ivory-100 space-y-4">
          <p className="label-caps text-obsidian-900">Active Inquiries</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-300" size={14} />
            <input 
              placeholder="Search Clients..." 
              className="w-full bg-ivory-50 border border-ivory-200 rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-gold transition-all" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {threads.map((thread) => (
            <div 
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-6 border-b border-ivory-50 cursor-pointer transition-all ${selectedThread?.id === thread.id ? 'bg-ivory-50 border-r-2 border-gold' : 'hover:bg-ivory-50/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[11px] font-bold text-obsidian-900 uppercase truncate">
                  {thread.profiles?.full_name || 'Verified Client'}
                </h4>
                {thread.unread && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
              </div>
              <p className="text-[10px] text-gold font-bold uppercase tracking-tight truncate mb-2">{thread.subject || 'Product Inquiry'}</p>
              <p className="text-[10px] text-obsidian-400 font-medium italic">
                {new Date(thread.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. ADVISORY TERMINAL */}
      <section className="flex-1 flex flex-col bg-white border border-ivory-300 rounded-xl overflow-hidden shadow-sm">
        {selectedThread ? (
          <>
            {/* TERMINAL HEADER */}
            <div className="p-6 border-b border-ivory-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-ivory-50 rounded-lg flex items-center justify-center border border-ivory-200">
                  <User size={18} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-obsidian-900 uppercase">
                    {selectedThread.profiles?.full_name}
                  </h3>
                  <p className="text-[9px] text-gold font-bold uppercase tracking-widest">Secured Channel Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full">
                <div className="w-1 h-1 rounded-full bg-green-600 animate-pulse" />
                <span className="text-[8px] font-black uppercase">Live</span>
              </div>
            </div>

            {/* MESSAGE FEED */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-ivory-50/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] p-6 rounded-xl text-sm leading-relaxed ${
                    msg.sender_type === 'admin' 
                    ? 'bg-obsidian-900 text-white font-medium' 
                    : 'bg-white text-obsidian-900 border border-ivory-200'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[8px] text-obsidian-300 font-bold uppercase tracking-widest mt-2 px-2">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* INPUT COMMAND */}
            <div className="p-6 border-t border-ivory-100 bg-white">
              <form onSubmit={handleSend} className="relative flex gap-4">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your advisor response..."
                  className="flex-1 bg-ivory-50 border border-ivory-200 rounded-lg py-4 px-6 text-xs text-obsidian-900 outline-none focus:border-gold transition-all"
                />
                <button type="submit" className="w-14 h-14 bg-obsidian-900 text-white rounded-lg flex items-center justify-center hover:bg-gold transition-all shadow-md">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-obsidian-200 gap-4">
            <MessageSquare size={48} className="opacity-20" />
            <p className="label-caps text-obsidian-300">Select a client thread to begin</p>
          </div>
        )}
      </section>

      {/* 3. CLIENT DOSSIER (RIGHT) */}
      {selectedThread && (
        <aside className="w-80 bg-white border border-ivory-300 rounded-xl p-8 space-y-8 shadow-sm">
          <p className="label-caps text-gold border-b border-ivory-100 pb-4">Client Dossier</p>
          
          <div className="space-y-6">
            <DossierItem label="Legal Name" value={selectedThread.profiles?.full_name} icon={<User />} />
            <DossierItem label="Domicile" value={selectedThread.profiles?.country || 'Global'} icon={<Globe />} />
            <DossierItem label="Member Status" value="Verified" icon={<ShieldCheck />} />
            <DossierItem label="Reference" value={`#TRD-${selectedThread.id.slice(0, 6).toUpperCase()}`} icon={<Briefcase />} />
          </div>

          <div className="pt-8 border-t border-ivory-100">
             <div className="p-4 bg-ivory-50 rounded-lg border border-ivory-200 space-y-2">
                <p className="text-[9px] font-bold text-obsidian-900 uppercase">Pro-Tip</p>
                <p className="text-[10px] text-obsidian-500 leading-relaxed">
                  Referencing the client's country allows for a more personalized logistical advisory.
                </p>
             </div>
          </div>
        </aside>
      )}
    </div>
  )
}

function DossierItem({ label, value, icon }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-obsidian-400">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 12, className: "text-gold" })}
        <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xs font-bold text-obsidian-900 uppercase pl-5 border-l border-ivory-100">
        {value}
      </p>
    </div>
  )
}