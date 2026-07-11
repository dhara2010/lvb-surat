import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Image as ImageIcon, Users, Calendar, MessageSquare, 
  LogOut, ShieldCheck, Shield, LayoutDashboard, Menu, X 
} from 'lucide-react';

import EventsManager from './components/EventsManager';
import LeadersManager from './components/LeadersManager';
import MembersManager from './components/MembersManager';
import GalleryManager from './components/GalleryManager';
import ContactsManager from './components/ContactsManager';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Navigation states
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sync activeTab with location if path matches
  const isEventsRoute = location.pathname.startsWith('/admin/events');
  useEffect(() => {
    if (isEventsRoute) {
      setActiveTab('events');
    }
  }, [location.pathname, isEventsRoute]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
    } else {
      alert('Invalid Credentials. Please try again.');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  // --- Login Screen ---
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FA] relative overflow-hidden font-sans">
        {/* Subtle Background Patterns */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0EA5A8]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#044765]/10 blur-[150px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-10 rounded-[28px] shadow-2xl bg-white border border-[#D9E6EC]"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#044765] flex items-center justify-center shadow-lg shadow-[#044765]/30 mb-5">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Admin <span className="text-[#0EA5A8]">Portal</span></h2>
            <p className="text-xs text-[#64748B] mt-2 tracking-widest font-semibold uppercase">LVB Surat Platinum</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider pl-1 text-[#64748B]">Username</label>
              <input required type="text" value={username} onChange={e=>setUsername(e.target.value)} 
                className="w-full bg-[#F4F8FA] border border-[#D9E6EC] p-4 rounded-xl text-[#1F2937] outline-none focus:border-[#0EA5A8] focus:bg-white transition-all font-medium" 
                placeholder="Enter admin username"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider pl-1 text-[#64748B]">Password</label>
              <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} 
                className="w-full bg-[#F4F8FA] border border-[#D9E6EC] p-4 rounded-xl text-[#1F2937] outline-none focus:border-[#0EA5A8] focus:bg-white transition-all font-medium" 
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full mt-4 bg-[#044765] text-white p-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#03627D] hover:shadow-lg transition-all">
              Secure Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'leaders', label: 'Leaders', icon: Shield },
    { id: 'contacts', label: 'Messages', icon: MessageSquare },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (id === 'events') {
      navigate('/admin/events');
    } else if (isEventsRoute) {
      navigate('/admin');
    }
    if (isMobile) setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0EA5A8]">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-widest text-white leading-none">LVB ADMIN</span>
            <span className="text-[10px] text-[#0EA5A8] uppercase tracking-widest mt-1 font-bold">Workspace</span>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-white p-2">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col p-4 gap-2 overflow-y-auto flex-grow">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2 pl-3">Menu Controls</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 w-full text-left group
                ${isActive ? 'bg-[#0EA5A8]/10 text-[#0EA5A8]' : 'text-white/70 hover:bg-white/5 hover:text-white'}
              `}
            >
              <Icon size={18} className={isActive ? 'text-[#0EA5A8]' : 'text-white/50 group-hover:text-white'} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="p-6 border-t border-white/10 shrink-0">
        <button onClick={logout} className="w-full py-3.5 px-4 flex items-center justify-center gap-2 rounded-xl text-red-100 font-bold bg-red-500/20 hover:bg-red-500/40 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F8FA] font-sans overflow-hidden">
      
      {/* ─── DESKTOP SIDEBAR ───────────────── */}
      <div className="hidden lg:flex w-[260px] h-screen shrink-0 flex-col bg-[#061826] shadow-xl relative z-20">
        <SidebarContent />
      </div>

      {/* ─── MOBILE OVERLAY SIDEBAR ────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#061826]/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-[#061826] shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ───────────────── */}
      <div className="flex-1 h-screen flex flex-col relative z-10 min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#D9E6EC] px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-[#044765] hover:bg-[#F4F8FA] rounded-md">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#1F2937] tracking-tight">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#044765]/10 flex items-center justify-center text-[#044765] border border-[#0EA5A8]/20">
              <ShieldCheck size={18} />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-[#1F2937]">Admin Session</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F4F8FA] scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {isEventsRoute ? (
                <Outlet context={{ token }} />
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {activeTab === 'dashboard' && <DashboardHome token={token} setTab={handleNavClick} />}
                  {activeTab === 'events' && <EventsManager token={token} />}
                  {activeTab === 'leaders' && <LeadersManager token={token} />}
                  {activeTab === 'members' && <MembersManager token={token} />}
                  {activeTab === 'gallery' && <GalleryManager token={token} />}
                  {activeTab === 'contacts' && <ContactsManager token={token} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-component for Dashboard Home
function DashboardHome({ token, setTab }) {
  const [stats, setStats] = useState([
    { label: 'Total Members', count: '...', icon: Users, tab: 'members' },
    { label: 'Total Events', count: '...', icon: Calendar, tab: 'events' },
    { label: 'Gallery Images', count: '...', icon: ImageIcon, tab: 'gallery' },
    { label: 'Messages', count: '...', icon: MessageSquare, tab: 'contacts' },
  ]);

  useEffect(() => {
    // Quick aggressive fetch to get counts
    const fetchStats = async () => {
      const endpoints = [
        { url: '/api/members', index: 0 },
        { url: '/api/events', index: 1 },
        { url: '/api/gallery', index: 2 },
        { url: '/api/contacts', index: 3 },
      ];
      endpoints.forEach(async (ep) => {
        try {
          const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + ep.url);
          const data = await res.json();
          setStats(prev => {
            const next = [...prev];
            next[ep.index].count = Array.isArray(data) ? data.length : 0;
            return next;
          });
        } catch (err) { }
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#D9E6EC]">
        <h2 className="text-lg font-bold text-[#1F2937] mb-2">Welcome Back, Admin.</h2>
        <p className="text-[#64748B] text-sm">Here is the current overview of the LVB Platform.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              onClick={() => setTab(stat.tab)}
              className="bg-white p-6 rounded-[24px] border border-[#D9E6EC] shadow-sm hover:shadow-md cursor-pointer group transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4F8FA] text-[#044765] flex items-center justify-center group-hover:bg-[#0EA5A8] group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#1F2937]">{stat.count}</div>
                <div className="text-sm font-semibold text-[#64748B] mt-1">{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}


