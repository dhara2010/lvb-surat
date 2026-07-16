import React, { useState, useEffect } from 'react';
import { SectionHeader, resolveImageUrl } from '../../components/AdminUI';
import { Calendar, Search, MapPin, UserCheck, X, Check, CornerDownLeft, Undo2 } from 'lucide-react';

export default function AttendanceManager({ token }) {
  const getTodayDateString = () => {
    // Returns YYYY-MM-DD in local time zone
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayDateString());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapters, setChapters] = useState([]);

  // Modal / Quick Selector states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Load attendance data for the selected date
  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/attendance?date=${date}`);
      if (!res.ok) throw new Error('Failed to fetch attendance data.');
      const list = await res.json();
      setData(list);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading attendance.');
    } finally {
      setLoading(false);
    }
  };

  // Load distinct chapters from DB to populate the filter dropdown
  const loadChapters = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/chapters`);
      if (res.ok) {
        const list = await res.json();
        // Extract names
        const names = list.map(c => c.name);
        setChapters(names);
      }
    } catch (err) {
      console.error('Failed to load chapters:', err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [date]);

  useEffect(() => {
    loadChapters();
  }, []);

  // Check in a member
  const handleCheckIn = async (memberId) => {
    try {
      const checkInTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const res = await fetch(`${apiUrl}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memberId,
          date,
          checkInTime,
          status: 'Present'
        })
      });

      if (!res.ok) throw new Error('Failed to record check-in.');
      
      // Update local state
      setData(prev => prev.map(item => {
        if (item.member.id === memberId) {
          return { ...item, checkInTime, status: 'Present' };
        }
        return item;
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Undo check-in (clear record)
  const handleUndoCheckIn = async (memberId) => {
    if (!window.confirm('Are you sure you want to reset this check-in?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/attendance?memberId=${memberId}&date=${date}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to undo check-in.');
      
      // Update local state
      setData(prev => prev.map(item => {
        if (item.member.id === memberId) {
          return { ...item, checkInTime: '-', status: 'Not Arrived' };
        }
        return item;
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered members list for main table
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.member.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChapter = 
      selectedChapter === '' || 
      item.member.chapter.toLowerCase() === selectedChapter.toLowerCase();

    return matchesSearch && matchesChapter;
  });

  // Members eligible for quick check-in modal (Not Arrived yet)
  const modalFilteredMembers = data.filter(item => {
    if (item.status === 'Present') return false;
    return item.member.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
           item.member.memberId.toLowerCase().includes(modalSearch.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 pb-20 relative">
      <SectionHeader 
        title="Attendance Management" 
        desc="Record and verify member attendance for organization meetings in real time." 
      />

      {/* ─── CONTROLS PANEL ───────────────── */}
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Date Picker */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted flex items-center gap-1.5">
              <Calendar size={13} className="text-cyan-400" />
              Meeting Date
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm cursor-pointer" 
            />
          </div>

          {/* Search Member */}
          <div className="flex flex-col gap-1.5 w-full md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted flex items-center gap-1.5">
              <Search size={13} className="text-cyan-400" />
              Search Member
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by name, ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-bg border border-border p-3 pl-10 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm" 
              />
              <Search className="absolute left-3.5 top-3.5 text-muted" size={16} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-muted hover:text-heading transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Chapter Filter */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted flex items-center gap-1.5">
              <MapPin size={13} className="text-cyan-400" />
              Chapter
            </label>
            <select 
              value={selectedChapter} 
              onChange={e => setSelectedChapter(e.target.value)}
              className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm cursor-pointer appearance-none"
            >
              <option value="">All Chapters</option>
              {chapters.map((ch, idx) => (
                <option key={idx} value={ch}>{ch}</option>
              ))}
              {chapters.length === 0 && (
                <>
                  <option value="Surat Platinum">Surat Platinum</option>
                  <option value="Surat Gold">Surat Gold</option>
                  <option value="Surat Dynamic">Surat Dynamic</option>
                </>
              )}
            </select>
          </div>

        </div>

        {/* Action Button & Stats Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-800/60 pt-4 mt-2 gap-4">
          <div className="flex items-center gap-4 text-xs font-bold text-muted uppercase tracking-wider">
            <div>Total: <span className="text-heading font-black">{data.length}</span></div>
            <div className="h-3 w-[1px] bg-slate-800"></div>
            <div>Present: <span className="text-emerald-400 font-black">{data.filter(i=>i.status==='Present').length}</span></div>
            <div className="h-3 w-[1px] bg-slate-800"></div>
            <div>Not Arrived: <span className="text-slate-400 font-black">{data.filter(i=>i.status!=='Present').length}</span></div>
          </div>

          <button 
            onClick={() => { setIsModalOpen(true); setModalSearch(''); }}
            className="w-full sm:w-auto h-[44px] bg-gradient-to-r from-cyan-600 to-blue-500 hover:brightness-110 text-white px-6 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck size={16} strokeWidth={2.5} /> 
            Mark Attendance
          </button>
        </div>
      </div>

      {/* ─── ATTENDANCE TABLE ───────────────── */}
      <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-bg border-b border-border sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted w-24">Photo</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Member Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted w-32">Member ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Chapter</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted w-40">Check-in Time</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted w-40">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredData.map(item => (
                <tr 
                  key={item.member.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-all duration-200"
                >
                  {/* Photo */}
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                      <img 
                        loading="lazy" 
                        decoding="async" 
                        src={resolveImageUrl(item.member.photoUrl)} 
                        alt={item.member.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${item.member.name}&backgroundColor=09475f&textColor=fff`;
                        }} 
                      />
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="p-4">
                    <div className="font-extrabold text-slate-100">{item.member.name}</div>
                    <div className="text-xs text-muted mt-0.5">{item.member.businessName} • {item.member.businessCategory}</div>
                  </td>

                  {/* ID */}
                  <td className="p-4 text-sm font-bold text-slate-300">
                    {item.member.memberId}
                  </td>

                  {/* Chapter */}
                  <td className="p-4 text-sm text-slate-400 font-semibold">
                    {item.member.chapter}
                  </td>

                  {/* Check-in Time */}
                  <td className="p-4 text-sm font-semibold text-slate-100">
                    {item.checkInTime}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {item.status === 'Present' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Not Arrived
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-4 text-right">
                    {item.status === 'Present' ? (
                      <button 
                        onClick={() => handleUndoCheckIn(item.member.id)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                        title="Reset Check-in"
                      >
                        <Undo2 size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleCheckIn(item.member.id)}
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                        title="Mark Present"
                      >
                        <Check size={16} className="mr-0.5" strokeWidth={3} />
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="p-20 text-center text-sm font-semibold text-cyan-400">Loading attendance data...</div>
        )}
        {!loading && filteredData.length === 0 && (
          <div className="p-20 text-center text-sm font-semibold text-muted">
            {error ? error : "No matching members found."}
          </div>
        )}
      </div>

      {/* ─── QUICK MARK ATTENDANCE MODAL ───── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-bg-alt border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-heading">Quick Check-In Selector</h3>
                <p className="text-xs text-muted mt-1">Select a member to instantly mark them present for {date}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-heading p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="p-6 pb-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type member name or ID..."
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  className="w-full bg-bg border border-border p-3 pl-10 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm"
                  autoFocus
                />
                <Search className="absolute left-3.5 top-3.5 text-muted" size={16} />
              </div>
            </div>

            {/* Modal Members List */}
            <div className="max-h-[300px] overflow-y-auto px-6 pb-6 flex flex-col gap-2">
              {modalFilteredMembers.map(item => (
                <div 
                  key={item.member.id}
                  onClick={async () => {
                    await handleCheckIn(item.member.id);
                    // Clear search and modal if checked in
                    setModalSearch('');
                    setIsModalOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-bg/50 border border-border/60 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-150 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                      <img 
                        src={resolveImageUrl(item.member.photoUrl)} 
                        alt={item.member.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${item.member.name}&backgroundColor=09475f&textColor=fff`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-100 group-hover:text-cyan-400 transition-colors">{item.member.name}</div>
                      <div className="text-[10px] text-muted mt-0.5">{item.member.memberId} • {item.member.chapter}</div>
                    </div>
                  </div>
                  
                  <div className="text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Check In <Check size={12} strokeWidth={3} />
                  </div>
                </div>
              ))}

              {modalFilteredMembers.length === 0 && (
                <div className="text-center text-sm text-muted py-8 font-semibold">
                  No pending members matching query.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
