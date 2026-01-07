'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Diamond, Wallet, MessageSquare, 
  Truck, Settings, Power, ShieldCheck, History,
  UserCircle, Activity, Box
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [adminName, setAdminName] = useState('Administrator');
  const [loading, setLoading] = useState(true);

  // SECURITY GATE: Only allow authorized admins
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login?redirect=/admin/dashboard');
        return;
      }

      // Check for Admin Metadata (Assuming you set 'role: admin' in Supabase)
      const userRole = session.user.user_metadata?.role;
      if (userRole !== 'admin') {
        router.push('/dashboard'); // Send regular users back to client dashboard
        return;
      }

      setAdminName(session.user.user_metadata?.full_name || 'System Admin');
      setLoading(false);
    };

    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  if (loading) return (
    <div className="h-screen bg-obsidian-900 flex flex-col items-center justify-center gap-4">
      <Activity className="text-gold animate-pulse" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/60 italic">Authorizing Admin Node...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-ivory-50 text-obsidian-900 font-sans selection:bg-gold selection:text-white">
      
      {/* SIDEBAR: Operational Hub */}
      <aside className="w-72 border-r border-ivory-300 flex flex-col p-8 bg-white shadow-sm relative z-20">
        
        {/* BRANDING: Lume Vault Command */}
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold flex items-center justify-center rounded-lg shadow-lg shadow-gold/20">
                <ShieldCheck size={18} className="text-white" />
             </div>
             <h1 className="text-xl font-medium tracking-tight text-obsidian-900 font-serif italic uppercase">
               Vault <span className="text-gold not-italic">Ops</span>
             </h1>
          </div>
          <p className="text-[8px] text-obsidian-400 tracking-[0.3em] font-bold uppercase mt-3 pl-1">Lume Control Center v4.0</p>
        </div>

        {/* ADMIN IDENTITY CARD */}
        <div className="mb-10 p-4 bg-ivory-100 rounded-xl border border-ivory-200 flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-white border border-ivory-300 flex items-center justify-center text-obsidian-400">
              <UserCircle size={24} strokeWidth={1.5} />
           </div>
           <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-obsidian-900 truncate">{adminName}</p>
              <p className="text-[8px] font-bold text-gold uppercase tracking-widest">Master Admin</p>
           </div>
        </div>

        {/* NAVIGATION: Core Management */}
        <nav className="flex-1 space-y-1">
          <p className="text-[8px] font-bold text-obsidian-300 uppercase tracking-widest pl-4 mb-2">Systems</p>
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={pathname === '/admin/dashboard'} />
          <NavItem href="/admin/inventory" icon={<Box size={18}/>} label="Inventory" active={pathname === '/admin/inventory'} />
          <NavItem href="/admin/orders" icon={<History size={18}/>} label="Order Ledger" active={pathname === '/admin/orders'} />
          <NavItem href="/admin/mempool" icon={<Activity size={18}/>} label="Payment Node" active={pathname === '/admin/mempool'} />
          
          <div className="pt-6">
            <p className="text-[8px] font-bold text-obsidian-300 uppercase tracking-widest pl-4 mb-2">Client Relations</p>
            <NavItem href="/admin/concierge" icon={<MessageSquare size={18}/>} label="Advisory Desk" active={pathname === '/admin/concierge'} />
            <NavItem href="/admin/tracking" icon={<Truck size={18}/>} label="Global Logistics" active={pathname === '/admin/tracking'} />
          </div>
        </nav>

        {/* FOOTER: Power Controls */}
        <div className="mt-auto pt-6 border-t border-ivory-200">
          <NavItem href="/admin/settings" icon={<Settings size={18}/>} label="System Config" active={pathname === '/admin/settings'} />
          
          <button 
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-4 px-5 py-3 rounded-lg transition-all text-obsidian-400 hover:text-red-500 hover:bg-red-50"
          >
            <Power size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto bg-ivory-50 p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all group ${
        active 
        ? 'bg-obsidian-900 text-white shadow-xl shadow-obsidian-900/10' 
        : 'text-obsidian-400 hover:text-obsidian-900 hover:bg-white'
      }`}>
        <span className={`${active ? 'text-gold' : 'text-obsidian-300 group-hover:text-gold'} transition-colors`}>
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</span>
      </div>
    </Link>
  );
}