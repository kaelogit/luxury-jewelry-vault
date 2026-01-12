'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, ShieldCheck, Headset, Paperclip, 
  ChevronLeft, MessageSquare, Plus, X, 
   Menu, LayoutDashboard, ShoppingBag, User, Settings, Lock, Loader2, LogOut
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Toaster } from 'sonner' 
import LiveNotifications from '@/components/ui/LiveNotifications'

export default function ConciergePage() {
  const router = useRouter()
  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  // NEW INQUIRY STATES
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // I. INITIAL FETCH & GLOBAL THREAD LISTENER
  useEffect(() => {
    const initSupport = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      const { data } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('client_id', user.id)
        .order('updated_at', { ascending: false })

      if (data) setThreads(data)
      setLoading(false)
    }
    initSupport()

    // BOUTIQUE SYNC ENGINE: Listen for updates to the Inbox (Threads)
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
  }, [router, userId])

  // II. REAL-TIME MESSAGE STREAMING (Inside Selected Thread)
  useEffect(() => {
    if (!selectedThread?.id) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      
      // CLEAR UNREAD COUNT
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
          // Prevent duplicates
          if (prev.find(m => m.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
        scrollToBottom()
      }).subscribe()

    return () => { supabase.removeChannel(msgChannel) }
  }, [selectedThread?.id])

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // III. BOUTIQUE ACTIONS
  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim() || !firstMessage.trim() || !userId) return

    const { data: thread, error: threadError } = await supabase
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

      // We don't manually add to threads here because the 'inbox-updates' listener handles it
      setSelectedThread(thread)
      setShowNewChatModal(false)
      setNewSubject('')
      setFirstMessage('')
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !userId || !selectedThread || selectedThread.status !== 'open') return

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
    if (typeof window !== 'undefined') localStorage.clear()
    window.location.href = '/'
  }

  if (loading) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Opening Secure Line...</p>
    </div>
  )

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* GLOBAL NOTIFICATION OVERLAYS */}
      <Toaster position="bottom-right" expand={false} richColors closeButton />
      {userId && <LiveNotifications userId={userId} type="client" />}
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 z-[80] bg-white border-b border-gray-100 p-5 flex justify-between items-center shrink-0">
         
         <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Concierge</h2>
         <button onClick={() => router.push('/dashboard')} className="p-3 bg-black text-white rounded-xl shadow-lg">
            <X size={20} />
         </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-80 border-r border-gray-100 bg-white flex-col justify-between p-10 h-screen sticky top-0">
        <div className="space-y-12">
          <Link href="/" className="group block space-y-4">
            
            <h2 className="text-xl font-bold tracking-tighter text-black uppercase">Lume <span className="text-gold italic font-serif lowercase">Vault</span></h2>
          </Link>
          <nav className="space-y-2">
            <NavBtn label="Overview" icon={<LayoutDashboard size={18}/>} onClick={() => router.push('/dashboard')} />
            <NavBtn label="Support Inbox" icon={<MessageSquare size={18}/>} active />
            <NavBtn label="Registry Settings" icon={<Settings size={18}/>} onClick={() => router.push('/dashboard')} />
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors uppercase text-[9px] font-bold tracking-widest p-4">
          <LogOut size={16} /> Secure Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden bg-white">
        
        {/* INBOX PANEL */}
        <aside className={`w-full md:w-96 border-r border-gray-100 bg-white flex flex-col transition-all ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20 shrink-0">
            <h1 className="text-lg font-bold text-black uppercase tracking-tighter">Inquiries</h1>
            <button onClick={() => setShowNewChatModal(true)} className="p-2.5 bg-black text-gold rounded-xl shadow-xl active:scale-95 transition-all">
              <Plus size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {threads.map((thread) => (
              <button 
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`w-full text-left px-6 py-5 border-b border-gray-50 transition-all flex flex-col gap-1.5 ${selectedThread?.id === thread.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedThread?.id === thread.id ? 'text-gold' : 'text-gray-400'}`}>
                    {thread.status === 'open' ? 'Active inquiry' : 'Resolved'}
                  </span>
                  {thread.client_unread_count > 0 && <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
                </div>
                <h4 className="text-sm font-bold truncate uppercase tracking-tight">{thread.subject}</h4>
                <p className={`text-[10px] truncate ${selectedThread?.id === thread.id ? 'text-white/50' : 'text-gray-400'}`}>
                  {thread.last_message_preview || "View history..."}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* CHAT INTERFACE */}
        <section className="flex-1 flex flex-col relative bg-white">
          {selectedThread ? (
            <>
              <header className="p-5 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedThread(null)} className="md:hidden text-gray-400 p-2"><ChevronLeft /></button>
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gold shadow-inner"><Headset size={18} /></div>
                  <div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-tight">{selectedThread.subject}</h3>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Client Portal</p>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-gray-50/30 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] md:max-w-[70%] space-y-2">
                      <div className={`p-5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                        msg.sender_type === 'client' 
                        ? 'bg-black text-white rounded-br-none font-medium' 
                        : 'bg-white border border-gray-100 text-black rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[8px] font-bold text-gray-300 uppercase px-2 text-right tracking-widest">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              <footer className="p-6 border-t border-gray-100 bg-white">
                {selectedThread.status === 'open' ? (
                  <form onSubmit={handleSend} className="flex items-center gap-3 max-w-4xl mx-auto">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Secure message to concierge..."
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-6 text-sm outline-none focus:border-gold transition-all"
                    />
                    <button type="submit" className="p-3.5 bg-black text-gold rounded-full shadow-lg active:scale-90 transition-all hover:bg-gold hover:text-black">
                      <Send size={18} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-3 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400">
                    <Lock size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Thread Resolved</p>
                  </div>
                )}
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-200 gap-4">
              <MessageSquare size={48} className="opacity-5" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Awaiting enquiry selection</p>
            </div>
          )}
        </section>
      </main>

      {/* NEW INQUIRY MODAL */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl space-y-8 relative">
              <button onClick={() => setShowNewChatModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors"><X size={24}/></button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black font-serif italic text-center uppercase tracking-tighter">New Inquiry</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Private Client Relations</p>
              </div>

              <form onSubmit={handleStartNewChat} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Inquiry Subject</label>
                    <input type="text" required placeholder="e.g., Shipping Update" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Boutique Message</label>
                    <textarea required placeholder="How may we assist you?" value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} rows={4} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:border-gold resize-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-black text-gold rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all shadow-xl">
                  Initialize Thread
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** SHARED HELPERS **/
function NavBtn({ label, icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-black text-white shadow-xl scale-[1.02]' : 'text-gray-400 hover:text-black hover:bg-white hover:shadow-sm'}`}>
      <div className={`${active ? 'text-gold' : 'text-gray-300 group-hover:text-gold'} transition-colors`}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</span>
    </button>
  )
}