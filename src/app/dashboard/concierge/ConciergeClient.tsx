'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, ShieldCheck, Headset, ChevronLeft, 
  MessageSquare, Plus, X, LayoutDashboard, 
  Settings, Lock, Loader2, LogOut 
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Toaster } from 'sonner' 
import LiveNotifications from '@/components/ui/LiveNotifications'

export default function ConciergeClient({ userId, initialThreads }: { userId: string, initialThreads: any[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [threads, setThreads] = useState<any[]>(initialThreads)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // I. REAL-TIME THREAD UPDATES (Inbox Sync)
  useEffect(() => {
    const threadChannel = supabase.channel('inbox-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_threads',
        filter: `client_id=eq.${userId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setThreads(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setThreads(prev => 
            prev.map(t => t.id === payload.new.id ? payload.new : t)
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          )
        }
      }).subscribe()

    return () => { supabase.removeChannel(threadChannel) }
  }, [userId, supabase])

  // II. REAL-TIME MESSAGE STREAMING
  useEffect(() => {
    if (!selectedThread?.id) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      
      await supabase
        .from('chat_threads')
        .update({ client_unread_count: 0 })
        .eq('id', selectedThread.id)

      scrollToBottom()
    }

    fetchMessages()

    const msgChannel = supabase.channel(`chat-${selectedThread.id}`)
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
  }, [selectedThread?.id, supabase])

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // III. ACTIONS
  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim() || !firstMessage.trim()) return

    const { data: thread } = await supabase
      .from('chat_threads')
      .insert([{ 
        client_id: userId, 
        subject: newSubject, 
        status: 'open',
        last_message_preview: firstMessage.slice(0, 100)
      }])
      .select()
      .single()

    if (thread) {
      await supabase.from('messages').insert([{
        thread_id: thread.id,
        sender_id: userId,
        sender_type: 'client',
        content: firstMessage
      }])
      setSelectedThread(thread)
      setShowNewChatModal(false)
      setNewSubject(''); setFirstMessage('')
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedThread || selectedThread.status !== 'open') return

    const content = newMessage
    setNewMessage('')

    await supabase.from('messages').insert([{
      thread_id: selectedThread.id,
      sender_id: userId,
      sender_type: 'client',
      content
    }])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden relative selection:bg-gold selection:text-white">
      <Toaster position="bottom-right" richColors />
      <LiveNotifications userId={userId} type="client" />
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 z-[80] bg-white border-b border-gray-100 p-5 flex justify-between items-center shrink-0">
         <h2 className="text-[10px] font-bold uppercase tracking-widest text-black">Customer Support</h2>
         <button onClick={() => router.push('/dashboard')} className="p-2.5 bg-black text-white rounded-xl shadow-lg"><X size={18} /></button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex w-80 border-r border-gray-100 bg-white flex-col justify-between p-10 h-screen sticky top-0">
        <div className="space-y-12">
          <Link href="/" className="block">
            <h2 className="text-xl font-bold tracking-tighter text-black uppercase leading-none">Lume <span className="text-gold italic font-serif">Vault</span></h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Client Relations</p>
          </Link>
          <nav className="space-y-2">
            <NavBtn label="Overview" icon={<LayoutDashboard size={18}/>} onClick={() => router.push('/dashboard')} />
            <NavBtn label="Messages" icon={<MessageSquare size={18}/>} active />
            <NavBtn label="Settings" icon={<Settings size={18}/>} onClick={() => router.push('/dashboard')} />
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors uppercase text-[9px] font-bold tracking-widest p-4">
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex overflow-hidden bg-white">
        {/* THREAD LIST */}
        <aside className={`w-full md:w-96 border-r border-gray-100 bg-white flex flex-col transition-all ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20 shrink-0">
            <h1 className="text-sm font-bold text-black uppercase tracking-widest">Conversations</h1>
            <button onClick={() => setShowNewChatModal(true)} className="p-2 bg-black text-gold rounded-lg shadow-lg active:scale-95 transition-all"><Plus size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {threads.map((thread) => (
              <button 
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`w-full text-left px-6 py-6 border-b border-gray-50 transition-all flex flex-col gap-1.5 ${selectedThread?.id === thread.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${selectedThread?.id === thread.id ? 'text-gold' : 'text-gray-400'}`}>
                    {thread.status === 'open' ? 'Active' : 'Resolved'}
                  </span>
                  {thread.client_unread_count > 0 && <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
                </div>
                <h4 className="text-[11px] font-bold truncate uppercase tracking-widest">{thread.subject}</h4>
                <p className={`text-[10px] truncate leading-none ${selectedThread?.id === thread.id ? 'text-white/40' : 'text-gray-400'}`}>
                  {thread.last_message_preview || "No messages yet"}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* MESSAGE WINDOW */}
        <section className="flex-1 flex flex-col bg-white relative">
          {selectedThread ? (
            <>
              <header className="p-5 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedThread(null)} className="md:hidden text-gray-400 p-2"><ChevronLeft /></button>
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gold border border-gold/5"><Headset size={18} /></div>
                  <div>
                    <h3 className="text-[11px] font-bold text-black uppercase tracking-widest">{selectedThread.subject}</h3>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Support Representative</p>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-gray-50/20 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] md:max-w-[70%] space-y-2">
                      <div className={`p-5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                        msg.sender_type === 'client' 
                        ? 'bg-black text-white rounded-br-none font-medium' 
                        : 'bg-white border border-gray-100 text-black rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[8px] font-bold text-gray-300 uppercase px-2 text-right">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              <footer className="p-6 border-t border-gray-100 bg-white">
                {selectedThread.status === 'open' ? (
                  <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 text-sm outline-none focus:border-gold transition-all"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="p-4 bg-black text-gold rounded-xl shadow-lg hover:bg-gold hover:text-black transition-all disabled:opacity-30">
                      <Send size={18} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-3 py-5 bg-gray-50 border border-gray-100 rounded-xl text-gray-400">
                    <Lock size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Conversation Resolved</p>
                  </div>
                )}
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-200 gap-4 bg-gray-50/10">
              <MessageSquare size={48} className="opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Select a conversation to begin</p>
            </div>
          )}
        </section>
      </main>

      {/* NEW INQUIRY MODAL */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl space-y-8 relative">
              <button onClick={() => setShowNewChatModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-black"><X size={24}/></button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black font-serif italic uppercase tracking-tight">New Message</h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Private Client Support</p>
              </div>
              <form onSubmit={handleStartNewChat} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest ml-1">Subject</label>
                    <input type="text" required placeholder="e.g., Shipping Update" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest ml-1">Your Message</label>
                    <textarea required placeholder="How can we assist you today?" value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} rows={4} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-gold resize-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-black text-gold rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-xl">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavBtn({ label, icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl transition-all group ${active ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black hover:bg-white hover:shadow-sm'}`}>
      <div className={`${active ? 'text-gold' : 'text-gray-300 group-hover:text-gold'} transition-colors`}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  )
}