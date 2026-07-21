import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, TextareaGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn } from '../../components/AdminUI';

export default function NotificationsManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/notifications')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      if (editingId) {
        const res = await fetch(`${apiUrl}/api/notifications/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('Announcement updated successfully', 'success');
        } else {
          showToast('Failed to update announcement', 'error');
        }
        setEditingId(null);
      } else {
        const res = await fetch(`${apiUrl}/api/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('Announcement broadcasted successfully', 'success');
        } else {
          showToast('Failed to broadcast announcement', 'error');
        }
      }
      setForm({ title: '', message: '', type: 'info' });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ title: d.title, message: d.message, type: d.type || 'info' });
    if (scrollToTop) scrollToTop();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete announcement?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Announcement deleted successfully', 'success');
        loadData();
      } else {
        showToast('Failed to delete announcement', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete announcement', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader title="Announcements & Alerts" desc="Broadcast general chapter announcements and important alerts." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <InputGroup label="Alert Title" placeholder="e.g. Next Weekly Meeting Rescheduled" val={form.title} setVal={v => setForm({ ...form, title: v })} w="flex-1 w-full" />
            <div className="flex flex-col gap-1.5 w-full md:w-[200px]">
              <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400">Alert Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} 
                className="w-full bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl text-slate-100 outline-none focus:border-cyan-500 font-medium text-sm">
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="success">Success (Green)</option>
                <option value="event">Event (Purple)</option>
              </select>
            </div>
          </div>
          <TextareaGroup label="Message Alert Content" placeholder="Type alert details here..." val={form.message} setVal={v => setForm({ ...form, message: v })} rows={3} />
          
          <div className="flex justify-end gap-2 items-center">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', message: '', type: 'info' }); }} 
                className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all">
                Cancel
              </button>
            )}
            <SubmitButton editing={editingId !== null} />
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Status', 'Alert Details', 'Message Content', 'Broadcasted', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
            <td className="p-4 w-28">
              <span className={`inline-block px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-lg border 
                ${d.type === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                  d.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                  d.type === 'event' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 
                  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'}`}>
                {d.type || 'info'}
              </span>
            </td>
            <td className="p-4 font-extrabold text-slate-100 max-w-[200px] truncate">{d.title}</td>
            <td className="p-4 text-slate-400 text-sm max-w-[300px] truncate">{d.message}</td>
            <td className="p-4 text-slate-500 text-xs font-semibold">
              {new Date(d.created_at || d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </td>
            <td className="p-4 w-32 text-right">
              <EditBtn onClick={() => handleEdit(d)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No alerts broadcasted yet."
      />
    </div>
  );
}
