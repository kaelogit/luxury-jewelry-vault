'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { MessageSquare, X } from 'lucide-react'

interface Props {
  userId: string;
  type: 'admin' | 'client';
}

export default function LiveNotifications({ userId, type }: Props) {
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // I. GLOBAL LISTENER: Monitoring the secure message stream
    const channel = supabase.channel('global-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        const newMsg = payload.new
        
        let shouldNotify = false

        if (type === 'admin') {
          // Admins are notified of any message sent by a client
          shouldNotify = newMsg.sender_type === 'client'
        } else {
          // Clients are only notified if the message is from an admin 
          // AND belongs to a thread they own.
          if (newMsg.sender_type === 'admin') {
            const { data: thread } = await supabase
              .from('chat_threads')
              .select('client_id')
              .eq('id', newMsg.thread_id)
              .single()

            if (thread?.client_id === userId) {
              shouldNotify = true
            }
          }
        }

        if (shouldNotify) {
          toast.custom((t) => (
            <div className="bg-obsidian-900 border border-gold/20 p-4 rounded-xl shadow-2xl flex items-start gap-4 min-w-[320px] animate-in slide-in-from-right-5 pointer-events-auto">
              <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0 border border-gold/10 mt-0.5">
                <MessageSquare size={14} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">
                  {type === 'admin' ? 'Client Inquiry' : 'Secure Message'}
                </p>
                <p className="text-xs text-white line-clamp-2 opacity-90 font-medium leading-relaxed">
                  "{newMsg.content}"
                </p>
              </div>
              <button 
                onClick={() => toast.dismiss(t)}
                className="text-gray-500 hover:text-white transition-colors mt-0.5"
              >
                <X size={14} />
              </button>
            </div>
          ), { duration: 6000, position: 'top-right' })
          
          // II. AUDIO CUE
          const audio = new Audio('/chime.mp3')
          audio.volume = 0.15
          audio.play().catch(() => {})
        }
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [userId, type, supabase])

  return null // Headless logic provider
}