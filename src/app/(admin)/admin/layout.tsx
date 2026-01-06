'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Diamond, Wallet, MessageSquare, 
  Truck, Settings, Power, ShieldCheck, History 
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  // SOVEREIGN LOGOUT PROTOCOL
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/auth/login';
    } else {
      console.error("Logout Protocol Failure:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-ivory-100 text-obsidian-900 font-sans selection:bg-gold selection:text-white">
      
      {/* SIDEBAR: Command Infrastructure */}
      <aside className="w-72 border-r border-ivory-300 flex flex-col p-8 bg-white shadow-sm relative z-20">
        
        {/* BRANDING: Sovereign Logo Section */}
        <div className="mb-12 px-2">
          <h1 className="text-2xl font-light tracking-tighter text-obsidian-900 uppercase italic leading-tight">
            LUME <span className="text-gold font-bold">VAULT.</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
             <div className="h-[1px] w-4 bg-gold/50" />
             <p className="text-[9px] text-obsidian-400 tracking-[0.4em] font-black uppercase italic">Admin Protocol</p>
          </div>
        </div>

        {/* NAVIGATION: Sovereign Registry Links */}
        <nav className="flex-1 space-y-1.5">
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={pathname === '/admin/dashboard'} />
          <NavItem href="/admin/inventory" icon={<Diamond size={18}/>} label="Registry" active={pathname === '/admin/inventory'} />
          <NavItem href="/admin/orders" icon={<History size={18}/>} label="Ledger" active={pathname === '/admin/orders'} />
          <NavItem href="/admin/concierge" icon={<MessageSquare size={18}/>} label="Concierge" active={pathname === '/admin/concierge'} />
          <NavItem href="/admin/tracking" icon={<Truck size={18}/>} label="Logistics" active={pathname === '/admin/tracking'} />
        </nav>

        {/* FOOTER: Security Handshake */}
        <div className="mt-auto space-y-6 pt-8 border-t border-ivory-200">
          <NavItem href="/admin/security" icon={<Settings size={18}/>} label="Settings" active={pathname === '/admin/security'} />
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group hover:bg-red-50/50 border border-transparent hover:border-red-100"
          >
            <span className="text-obsidian-400 group-hover:text-red-600 transition-colors">
              <Power size={18} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-400 group-hover:text-red-600 italic text-left">
              Terminate Session
            </span>
          </button>

          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-gold" />
              <span className="text-[8px] font-black text-obsidian-400 uppercase tracking-[0.3em]">
                Encrypted Session
              </span>
            </div>
            <div className="h-[1px] w-8 bg-ivory-300" />
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT: The Gallery Canvas */}
      <main className="flex-1 overflow-y-auto bg-ivory-100 p-10 lg:p-14 relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${
        active 
        ? 'bg-obsidian-900 text-gold shadow-xl shadow-obsidian-900/10' 
        : 'text-obsidian-400 hover:text-obsidian-900 hover:bg-white border border-transparent hover:border-ivory-300'
      }`}>
        <span className={`${active ? 'text-gold' : 'text-obsidian-400 group-hover:text-gold'} transition-colors duration-500`}>
          {icon}
        </span>
        <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${active ? 'italic' : ''}`}>{label}</span>
      </div>
    </Link>
  );
}