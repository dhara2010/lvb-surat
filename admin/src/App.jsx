import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Image as ImageIcon, MessageSquare, 
  MapPin, BookOpen, Bell, Settings, LogOut, ShieldCheck, 
  Shield, LayoutDashboard, Menu, X, Sun, Moon, Lock,
  Eye, EyeOff, UserCheck
} from 'lucide-react';

import logoImg from './assets/LVB_Platinum-removebg-preview.png';

import DashboardHome from './pages/Dashboard/DashboardHome';
import MembersManager from './pages/Members/MembersManager';
import EventsManager from './pages/Events/EventsManager';
import GalleryManager from './pages/Gallery/GalleryManager';
import LeadersManager from './pages/Leaders/LeadersManager';
import ContactsManager from './pages/Contact/ContactsManager';
import ChaptersManager from './pages/Chapters/ChaptersManager';
import BlogsManager from './pages/Blogs/BlogsManager';
import NotificationsManager from './pages/Notifications/NotificationsManager';
import SettingsManager from './pages/Settings/SettingsManager';
import AdminsManager from './pages/Admins/AdminsManager';
import AttendanceManager from './pages/Attendance/AttendanceManager';
import EventAttendanceManager from './pages/EventAttendance/EventAttendanceManager';
import Preloader from './components/Preloader';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [tempToken, setTempToken] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');

  // Handle setting/removing theme class from document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
    localStorage.setItem('adminTheme', theme);
  }, [theme]);

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
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        setTempToken(data.token);
        setShowLoader(true);
      } else {
        alert(data.message || 'Invalid Credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed. Please verify the backend is running.');
    }
  };

  const handleLoaderComplete = () => {
    setToken(tempToken);
    localStorage.setItem('adminToken', tempToken);
    setShowLoader(false);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- Login Screen ---
  if (!token) {
    return (
      <>
        <AnimatePresence>
          {showLoader && (
            <Preloader onComplete={handleLoaderComplete} />
          )}
        </AnimatePresence>
        <div className="min-h-screen flex bg-bg font-sans transition-colors duration-300 relative overflow-hidden">
        {/* Glowing Background Details */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none"></div>
        
        {/* LEFT SIDE: Brand Branding Show (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-bg via-bg/90 to-cyan-950/20 z-0"></div>
          {/* Decorative mesh/grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          {/* Live vertical flow animation */}
          <div className="live-vertical-flow"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center px-12 flex flex-col items-center"
          >
            <img src={logoImg} alt="LVB Platinum Logo" className="w-[300px] h-auto object-contain mb-8 drop-shadow-[0_10px_30px_rgba(6,182,212,0.2)]" />
            <h2 className="text-3xl font-black text-white tracking-tight">LVB Surat <span className="text-cyan-400">Platinum</span></h2>
            <p className="text-slate-400 mt-3 text-sm font-medium tracking-wide max-w-sm">
              Access the administrative control center to manage chapter directory, schedule events, leaders, and announcements.
            </p>
          </motion.div>
        </div>
        
        {/* VERTICAL DIVIDER LINE */}
        <div className="hidden lg:block w-[1px] h-[60vh] bg-border self-center z-20"></div>
        
        {/* RIGHT SIDE: Interactive Login Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-10 rounded-[32px] shadow-2xl bg-bg-alt border border-border"
          >
            {/* Show logo on Mobile only */}
            <div className="flex flex-col items-center mb-8 text-center lg:hidden">
              <img src={logoImg} alt="LVB Platinum Logo" className="w-[140px] h-auto object-contain mb-4" />
              <h2 className="text-2xl font-black text-heading tracking-tight">Admin <span className="text-cyan-400">Portal</span></h2>
            </div>
            
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h3 className="text-2xl font-black text-heading tracking-tight">Sign In</h3>
              <p className="text-xs text-muted mt-1 uppercase font-bold tracking-widest">LVB Surat workspace</p>
            </div>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">Username</label>
                <input required type="text" value={username} onChange={e=>setUsername(e.target.value)} 
                  className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg transition-all font-medium text-sm" 
                  placeholder="Enter admin username"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">Password</label>
                <div className="relative flex items-center">
                  <input 
                    required 
                    type={showLoginPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    className="w-full bg-bg border border-border p-3.5 pr-12 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg transition-all font-medium text-sm" 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 text-muted hover:text-heading flex items-center justify-center cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button type="submit" className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-500 text-white p-3.5 rounded-xl font-bold tracking-widest uppercase hover:brightness-110 hover:shadow-lg transition-all cursor-pointer">
                Secure Login
              </button>
            </form>
          </motion.div>
        </div>
      </div>
     </>
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'attendance', label: 'Checkins', icon: UserCheck },
    { id: 'event-attendance', label: 'Event Attend.', icon: Calendar },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'leaders', label: 'Leaders', icon: Shield },
    { id: 'contacts', label: 'Visitor Inquiries', icon: MessageSquare },
    { id: 'chapters', label: 'Chapters', icon: MapPin },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'admins', label: 'Admin Accounts', icon: Lock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobile) setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-cyan-600 to-blue-500">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-widest text-heading leading-none">LVB ADMIN</span>
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest mt-1 font-bold">Workspace</span>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(false)} className="text-muted hover:text-heading p-2">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col p-4 gap-2 overflow-y-auto flex-grow">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 pl-3">Menu Controls</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left group
                ${isActive ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-body hover:bg-surface hover:text-heading'}
              `}
            >
              <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-muted group-hover:text-body'} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="p-6 border-t border-border shrink-0">
        <button onClick={logout} className="w-full py-3.5 px-4 flex items-center justify-center gap-2 rounded-xl text-rose-100 font-bold bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bg font-sans overflow-hidden text-body transition-colors duration-300">
      
      {/* ─── DESKTOP SIDEBAR ───────────────── */}
      <div className="hidden lg:flex w-[260px] h-screen shrink-0 flex-col bg-bg-alt border-r border-border shadow-xl relative z-20">
        <SidebarContent />
      </div>

      {/* ─── MOBILE OVERLAY SIDEBAR ────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-bg-alt shadow-2xl z-50 flex flex-col lg:hidden border-r border-border"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ───────────────── */}
      <div className="flex-1 h-screen flex flex-col relative z-10 min-w-0">
        {/* Top Navbar */}
        <header className="bg-bg-alt/30 border-b border-border/80 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-muted hover:bg-surface rounded-md">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-heading tracking-tight">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-xl bg-surface hover:bg-surface-hover border border-border flex items-center justify-center transition-all duration-300 text-cyan-400 cursor-pointer"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <ShieldCheck size={18} />
              </div>
              <span className="hidden sm:block text-sm font-semibold text-heading">Admin Session</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 bg-bg-alt/10 scroll-smooth transition-colors duration-300">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {activeTab === 'dashboard' && <DashboardHome setTab={handleNavClick} />}
                { activeTab === 'members' && <MembersManager token={token} /> }
                { activeTab === 'attendance' && <AttendanceManager token={token} /> }
                { activeTab === 'event-attendance' && <EventAttendanceManager token={token} /> }
                { activeTab === 'events' && <EventsManager token={token} /> }
                {activeTab === 'gallery' && <GalleryManager token={token} />}
                {activeTab === 'leaders' && <LeadersManager token={token} />}
                {activeTab === 'contacts' && <ContactsManager token={token} />}
                {activeTab === 'chapters' && <ChaptersManager token={token} />}
                {activeTab === 'blogs' && <BlogsManager token={token} />}
                {activeTab === 'notifications' && <NotificationsManager token={token} />}
                {activeTab === 'admins' && <AdminsManager token={token} />}
                {activeTab === 'settings' && <SettingsManager token={token} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
