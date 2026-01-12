'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase' // FIX: Using the correct factory
import { 
  Send, User, ShieldCheck, Gem, MoreVertical, 
  Search, MessageSquare, Loader2, Lock, 
  ArrowLeft, Clock, Globe, Briefcase, ChevronRight,
  Mail, MapPin, UserCircle, Phone, Plus, X, ChevronLeft, CheckCircle2, RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminSupportCenter() {
  const supabase = createClient() // FIX: Initialize factory once at the top
  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [adminId, setAdminId] = useState<string | null>(null)
  
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [newChatSubject, setNewChatSubject] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // I. SYSTEM INITIALIZATION: Fetch ALL threads for Admin visibility
  const initSupport = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setAdminId(user.id)

    const { data, error } = await supabase
      .from('chat_threads')
      .select(`
        *,
        profiles!client_id (
          full_name, 
          email, 
          country, 
          phone
        )
      `)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error("Registry Sync Error:", error.message)
      setLoading(false)
      return
    }

    if (data) setThreads(data)
    setLoading(false)
  }

  useEffect(() => {
    initSupport()

    // FIX: Standard postgres_changes for real-time thread updates
    const threadChannel = supabase.channel('support-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_threads' 
      }, () => initSupport())
      .subscribe()

    return () => { supabase.removeChannel(threadChannel) }
  }, [])

  // II. LIVE CHAT STREAMING: Messages & Mark as Read
  useEffect(() => {
    if (!selectedThread?.id) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)

      // FIX: Mark thread as seen by admin
      await supabase
        .from('chat_threads')
        .update({ admin_unread_count: 0 })
        .eq('id', selectedThread.id)

      scrollToBottom()
    }

    fetchMessages()

    const msgChannel = supabase.channel(`live-chat-${selectedThread.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `thread_id=eq.${selectedThread.id}` 
      }, (payload) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
        scrollToBottom()
      }).subscribe()

    return () => { supabase.removeChannel(msgChannel) }
  }, [selectedThread?.id])

  // III. CLIENT SEARCH
  useEffect(() => {
    if (clientSearch.length < 2) {
      setClients([])
      return
    }
    const searchClients = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .ilike('full_name', `%${clientSearch}%`)
        .limit(5)
      if (data) setClients(data)
    }
    searchClients()
  }, [clientSearch])

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // IV. BOUTIQUE ACTIONS
  const handleToggleStatus = async () => {
    if (!selectedThread) return
    const newStatus = selectedThread.status === 'open' ? 'closed' : 'open'
    
    const { data } = await supabase
      .from('chat_threads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', selectedThread.id)
      .select(`*, profiles!client_id (full_name, country, email, phone)`)
      .single()

    if (data) setSelectedThread(data)
  }

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || !newChatSubject.trim() || !firstMessage.trim() || !adminId) return

    try {
      const { data: thread, error: tErr } = await supabase
        .from('chat_threads')
        .insert([{ 
          client_id: selectedClient.id, 
          subject: newChatSubject, 
          status: 'open',
          last_message_preview: firstMessage.slice(0, 100)
        }])
        .select()
        .single()

      if (tErr) throw tErr

      if (thread) {
        await supabase.from('messages').insert([{
          thread_id: thread.id,
          sender_id: adminId,
          sender_type: 'admin',
          content: firstMessage
        }])

        const { data: fullThread } = await supabase
          .from('chat_threads')
          .select(`*, profiles!client_id (full_name, email, country, phone)`)
          .eq('id', thread.id)
          .single();

        setSelectedThread(fullThread)
        setIsNewChatOpen(false)
        setNewChatSubject('')
        setFirstMessage('')
        setSelectedClient(null)
        setClientSearch('')
      }
    } catch (err) {
      console.error("Initialization Failed")
      alert("Error initializing chat. Check connection.")
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !adminId || !selectedThread) return

    const content = newMessage
    setNewMessage('')

    await supabase.from('messages').insert([
      { thread_id: selectedThread.id, sender_id: adminId, sender_type: 'admin', content }
    ])
  }

  if (loading) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading Support Terminal...</p>
    </div>
  )

  return (
    <main className="h-[calc(100vh-120px)] flex gap-6 overflow-hidden relative">
      
      {/* 1. MESSAGE LIST */}
      <aside className={`w-full md:w-80 flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-50 space-y-4 bg-gray-50/30">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Inbox</h2>
            <button onClick={() => setIsNewChatOpen(true)} className="p-2 bg-black text-gold rounded-full shadow-lg hover:scale-110 transition-all">
              <Plus size={16} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input placeholder="Search..." className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold uppercase outline-none focus:border-gold" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {threads.map((thread) => (
            <button 
              key={thread.id} 
              onClick={() => setSelectedThread(thread)}
              className={`w-full text-left p-6 border-b border-gray-50 transition-all flex flex-col gap-1.5 ${selectedThread?.id === thread.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start">
                <h4 className={`text-[11px] font-bold uppercase truncate ${selectedThread?.id === thread.id ? 'text-white' : 'text-black'}`}>
                  {thread.profiles?.full_name || 'Client'}
                </h4>
                {thread.admin_unread_count > 0 && <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-tight text-gold`}>
                {thread.subject}
              </p>
              <p className={`text-[9px] truncate ${selectedThread?.id === thread.id ? 'text-white/40' : 'text-gray-400'}`}>
                {thread.last_message_preview || "View history"}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. CHAT WORKSPACE */}
      <section className="flex-1 flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm relative">
        {selectedThread ? (
          <>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedThread(null)} className="md:hidden text-gray-400 p-2"><ChevronLeft /></button>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gold"><UserCircle size={24} /></div>
                <div>
                  <h3 className="text-sm font-bold text-black uppercase">{selectedThread.profiles?.full_name}</h3>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase">
                    {selectedThread.status === 'open' ? (
                      <span className="text-green-500">Active Support</span>
                    ) : (
                      <span className="text-gray-400">Resolved</span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedThread.status === 'open' 
                  ? 'bg-gold/10 text-gold hover:bg-gold hover:text-white' 
                  : 'bg-black text-white hover:bg-gold'
                }`}
              >
                {selectedThread.status === 'open' ? <CheckCircle2 size={14} /> : <RotateCcw size={14} />}
                {selectedThread.status === 'open' ? 'Resolve' : 'Reopen'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender_type === 'admin' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-white text-black border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-gray-300 font-bold uppercase mt-2 px-2">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <form onSubmit={handleSend} className="relative flex gap-4">
                <input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 text-sm outline-none focus:border-gold"
                />
                <button type="submit" className="w-14 h-14 bg-black text-gold rounded-xl flex items-center justify-center hover:bg-gold hover:text-black transition-all shadow-md active:scale-95">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-200 gap-4">
            <MessageSquare size={64} className="opacity-10 text-gold" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Select a conversation</p>
          </div>
        )}
      </section>

      {/* 3. NEW MODAL */}
      <AnimatePresence>
        {isNewChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
              <button onClick={() => { setIsNewChatOpen(false); setSelectedClient(null); }} className="absolute top-6 right-6 text-gray-300 hover:text-black transition-colors"><X size={24}/></button>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest text-center">Start Conversation</h2>
              
              <form onSubmit={handleStartChat} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Client Name</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                    <input 
                      placeholder="Search..." 
                      value={clientSearch} 
                      onChange={(e) => setClientSearch(e.target.value)} 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold" 
                    />
                  </div>
                  {clients.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-xl mt-2 overflow-hidden shadow-lg">
                      {clients.map((client) => (
                        <button key={client.id} type="button" onClick={() => { setSelectedClient(client); setClientSearch(client.full_name); setClients([]); }} className="w-full flex items-center gap-4 p-4 hover:bg-gold/5 text-left border-b border-gray-50 last:border-0">
                          <span className="text-[10px] font-bold uppercase">{client.full_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Subject</label>
                    <input value={newChatSubject} onChange={(e) => setNewChatSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Initial Message</label>
                    <textarea value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} rows={3} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm resize-none" required />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-black text-gold rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-xl">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}