import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../components/AdminUI';
import { Calendar, Search, MapPin, Download, UserCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function EventAttendanceManager({ token }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Load events
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/events`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  const loadAttendances = async () => {
    if (!selectedEventId) return setAttendances([]);
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/event-attendance/${selectedEventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch attendance');
      const data = await res.json();
      setAttendances(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();
  }, [selectedEventId]);

  const filteredAttendances = attendances.filter(item => 
    item.userId.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportExcel = () => {
    if (filteredAttendances.length === 0) return alert("No data to export");
    const dataToExport = filteredAttendances.map(item => ({
      "User ID/Name": item.userId,
      "Date": item.date,
      "Time (Server)": item.time,
      "Latitude": item.latitude,
      "Longitude": item.longitude,
      "Status": item.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    
    // Generate Event title for filename
    const ev = events.find(e => e._id === selectedEventId);
    const filename = ev ? `Attendance-${ev.title.replace(/\s+/g, '-')}.xlsx` : 'Attendance.xlsx';
    
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 relative">
      <SectionHeader 
        title="Event Attendance Management" 
        desc="View, search and export geo-verified attendance records for events." 
      />

      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted flex items-center gap-1.5">
              <Calendar size={13} className="text-cyan-400" /> Select Event
            </label>
            <select 
              value={selectedEventId} 
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 cursor-pointer text-sm"
            >
              <option value="">-- Choose an Event --</option>
              {events.map(ev => (
                <option key={ev._id} value={ev._id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted flex items-center gap-1.5">
              <Search size={13} className="text-cyan-400" /> Search Attendee
            </label>
            <input 
              type="text" 
              placeholder="Search by ID or name..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          <div className="flex w-full items-end justify-end h-full">
            <button 
              onClick={exportExcel}
              disabled={filteredAttendances.length === 0}
              className="px-6 h-[46px] w-full disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:brightness-110 text-white rounded-xl font-bold transition-all"
            >
              <Download size={18} /> Export Excel
            </button>
          </div>

        </div>

        <div className="text-xs font-bold text-muted uppercase mt-4">
          Total Attendees: <span className="text-cyan-400">{filteredAttendances.length}</span>
        </div>
      </div>

      <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-muted">User ID/Name</th>
                <th className="p-4 text-xs font-bold uppercase text-muted">Date & Time</th>
                <th className="p-4 text-xs font-bold uppercase text-muted">Location </th>
                <th className="p-4 text-xs font-bold uppercase text-muted py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAttendances.map(item => (
                <tr key={item._id} className="hover:bg-slate-900/10">
                  <td className="p-4 font-bold text-slate-100">{item.userId}</td>
                  <td className="p-4 text-sm text-slate-300">{item.date} <span className="text-cyan-400 ml-2">{item.time}</span></td>
                  <td className="p-4 text-xs text-slate-400 font-mono">
                    <MapPin size={12} className="inline mr-1 text-red-400"/>
                    {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredAttendances.length === 0 && !loading && (
                <tr><td colSpan="4" className="p-8 text-center text-muted text-sm font-semibold">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
