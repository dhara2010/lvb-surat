import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/AdminUI';
import { MessageSquare, Search, Trash2, Mail, Phone, Calendar, Loader2 } from 'lucide-react';

export default function ContactsManager({ token, showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/contacts`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      const resData = await res.json();
      if (res.ok && Array.isArray(resData)) {
        setData(resData);
      } else if (resData && Array.isArray(resData.data)) {
        setData(resData.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Failed to fetch contact inquiries:', err);
      if (showToast) showToast('Failed to load inquiries', 'error');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const res = await fetch(`${apiUrl}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await res.json();
      if (res.ok) {
        if (showToast) showToast('Inquiry deleted successfully', 'success');
        fetchContacts();
      } else {
        if (showToast) showToast(resData.message || 'Failed to delete inquiry', 'error');
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
      if (showToast) showToast('Error deleting inquiry', 'error');
    }
  };

  const filteredData = Array.isArray(data) ? data.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (item.name && item.name.toLowerCase().includes(q)) ||
           (item.email && item.email.toLowerCase().includes(q)) ||
           (item.phone && item.phone.toLowerCase().includes(q)) ||
           (item.message && item.message.toLowerCase().includes(q));
  }) : [];

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader 
        title="Visitor Inquiries" 
        desc="View and manage incoming leads and contact submissions captured from the website." 
      />

      {/* FILTER / SEARCH BAR */}
      <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search inquiries by name, phone, email, or content..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-bg border border-border p-3 pl-10 rounded-xl text-heading outline-none focus:border-cyan-500 font-medium text-sm transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 text-muted" size={16} />
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-slate-400 text-sm font-semibold gap-3 border border-slate-800 rounded-3xl bg-slate-900/10">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span>Loading visitor inquiries...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-slate-400 p-12 text-center border border-dashed border-slate-800 bg-slate-900/10 rounded-3xl flex flex-col items-center gap-2">
          <MessageSquare className="w-10 h-10 text-slate-600 mb-1" />
          <p className="font-bold text-slate-300">No Visitor Inquiries Found</p>
          <p className="text-xs text-slate-500">New submissions from the Contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredData.map((d, i) => {
            const dateStr = d.created_at || d.createdAt;
            const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString(undefined, { 
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            }) : 'N/A';

            return (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.04 }}
                key={d.id || d._id || i} 
                className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4 hover:border-slate-700 transition-all duration-300 relative group"
              >
                <div className="flex justify-between items-start pt-1 pb-4 border-b border-slate-800">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-extrabold text-xl text-cyan-400">{d.name}</h4>
                    <div className="flex flex-wrap gap-2 text-xs font-bold tracking-wider text-slate-400">
                      {d.email && (
                        <span className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5">
                          <Mail size={13} className="text-cyan-400" /> {d.email}
                        </span>
                      )}
                      {d.phone && (
                        <span className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5">
                          <Phone size={13} className="text-cyan-400" /> {d.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {formattedDate}
                    </span>
                    <button 
                      onClick={() => handleDelete(d.id || d._id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap px-1 font-medium bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                  {d.message || 'No message provided.'}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
