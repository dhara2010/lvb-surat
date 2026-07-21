import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../components/AdminUI';
import { Calendar, Search, MapPin, Download, UserCheck } from 'lucide-react';

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
  }, [apiUrl]);

  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    if (!eventId) {
      setAttendances([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/attendance/event/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAttendances(data);
      } else {
        setAttendances([]);
      }
    } catch (err) {
      console.error("Failed to fetch event attendances", err);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = attendances.filter(item => 
    (item.userId && item.userId.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportExcel = () => {
    if (filteredAttendances.length === 0) return alert("No data to export");
    const headers = ["User ID/Name", "Date", "Time (Server)", "Latitude", "Longitude", "Status"];
    const rows = filteredAttendances.map(item => [
      `"${item.userId || ''}"`,
      `"${item.date || ''}"`,
      `"${item.time || ''}"`,
      `"${item.latitude || ''}"`,
      `"${item.longitude || ''}"`,
      `"${item.status || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const ev = events.find(e => e._id === selectedEventId || e.id === selectedEventId);
    const filename = ev ? `Attendance-${ev.title.replace(/\s+/g, '-')}.csv` : 'Attendance.csv';
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onChange={handleEventChange}
              className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 transition-all font-medium text-sm"
            >
              <option value="">-- Choose an Event --</option>
              {events.map(ev => (
                <option key={ev._id || ev.id} value={ev._id || ev.id}>
                  {ev.title} ({ev.month} {ev.date}, {ev.year})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted flex items-center gap-1.5">
              <Search size={13} className="text-cyan-400" /> Filter Records
            </label>
            <input 
              type="text" 
              placeholder="Search by User ID or Name..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              disabled={!selectedEventId}
              className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 transition-all font-medium text-sm disabled:opacity-50"
            />
          </div>

          <button 
            onClick={exportExcel}
            disabled={!selectedEventId || filteredAttendances.length === 0}
            className="h-[48px] bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={16} /> Export CSV
          </button>

        </div>
      </div>

      {selectedEventId && (
        <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-bg border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">User / Member</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Date & Time</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Location Coordinates</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-sm font-semibold text-muted">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-sm font-semibold text-muted">
                      No attendance records found for this event.
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((item, i) => (
                    <tr key={item._id || item.id || i} className="hover:bg-bg/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-heading text-sm">{item.userId}</div>
                      </td>
                      <td className="p-4 text-sm text-heading">
                        <div className="font-semibold">{item.date}</div>
                        <div className="text-xs text-muted">{item.time} IST</div>
                      </td>
                      <td className="p-4 text-sm text-heading">
                        <div className="flex items-center gap-1 font-mono text-xs text-cyan-400">
                          <MapPin size={12} />
                          {item.latitude}, {item.longitude}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <UserCheck size={12} /> Verified Present
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
