'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { MessageSquare, Bell } from 'lucide-react'

interface Props {
  userId: string;
  type: 'admin' | 'client';
}

export default function LiveNotifications({ userId, type }: Props) {
  useEffect(() => {
    if (!userId) return

    // Listen for new messages across ALL threads
    const channel = supabase.channel('global-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMsg = payload.new
        
        // Logic: If I am an Admin, notify me of Client messages. 
        // If I am a Client, notify me of Admin messages.
        const shouldNotify = type === 'admin' 
          ? newMsg.sender_type === 'client' 
          : (newMsg.sender_type === 'admin' && newMsg.recipient_id === userId) 
            // Note: If you don't have recipient_id, we can check thread ownership

        if (shouldNotify) {
          toast.custom((t) => (
            <div className="bg-black border border-gold/30 p-5 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] animate-in slide-in-from-right-5">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                <MessageSquare size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">New Boutique Message</p>
                <p className="text-xs text-white line-clamp-1 opacity-80">{newMsg.content}</p>
              </div>
              <button 
                onClick={() => toast.dismiss(t)}
                className="text-[10px] font-bold text-gray-500 uppercase hover:text-white"
              >
                Dismiss
              </button>
            </div>
          ), { duration: 5000, position: 'top-right' })
          
          // Optional: Play a very subtle "Luxury" chime
          const audio = new Audio('/chime.mp3')
          audio.volume = 0.2
          audio.play().catch(() => {})
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, type])

  return null // This is a "headless" logic component
}