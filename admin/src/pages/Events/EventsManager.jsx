import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, TextareaGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn, resolveImageUrl } from '../../components/AdminUI';

const initialForm = {
  title: '', date: '', month: '', year: '', time: '', cost: '',
  venue: '', mapLink: '', organizer: '', image: '', descriptionPart1: '', descriptionPart2: '',
  eventDate: '', attendanceEnabled: true, attendanceOpenTime: '07:00', attendanceCloseTime: '08:00',
  sessions: [], tickets: []
};

export default function EventsManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/events')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const payload = { ...form };
      delete payload.id;
      delete payload._id;
      delete payload.attendanceInfo;
      delete payload.attendanceStatus;

      if (editingId) {
        const res = await fetch(`${apiUrl}/api/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const errData = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error(errData.error || 'Your admin session has expired. Please logout and log back in.');
          }
          throw new Error(errData.error || errData.message || `HTTP ${res.status}: Failed to update event`);
        }
        setEditingId(null);
        showToast('Event updated successfully', 'success');
      } else {
        const res = await fetch(`${apiUrl}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const errData = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error(errData.error || 'Your admin session has expired. Please logout and log back in.');
          }
          throw new Error(errData.error || errData.message || `HTTP ${res.status}: Failed to create event`);
        }
        showToast('Event created successfully', 'success');
      }
      setForm(initialForm);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id || d._id);
    const cleanForm = { ...d };
    delete cleanForm.id;
    delete cleanForm._id;
    delete cleanForm.attendanceInfo;
    delete cleanForm.attendanceStatus;

    setForm({
      ...initialForm,
      ...cleanForm,
      attendanceEnabled: d.attendanceEnabled !== undefined ? d.attendanceEnabled : true,
      attendanceOpenTime: d.attendanceOpenTime !== undefined && d.attendanceOpenTime !== null && d.attendanceOpenTime !== '' ? d.attendanceOpenTime : '07:00',
      attendanceCloseTime: d.attendanceCloseTime !== undefined && d.attendanceCloseTime !== null && d.attendanceCloseTime !== '' ? d.attendanceCloseTime : '08:00',
      eventDate: d.eventDate || '',
      sessions: d.sessions || [],
      tickets: d.tickets || []
    });
    if (scrollToTop) scrollToTop();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error(errData.error || 'Your admin session has expired. Please logout and log back in.');
        }
        throw new Error(errData.error || errData.message || 'Failed to delete event');
      }
      showToast('Event deleted successfully', 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const addSession = () => {
    setForm({
      ...form,
      sessions: [...form.sessions, { iconType: 'mic', title: '', primaryLabel: '', primaryText: '', secondaryLabel: '', secondaryText: '', description: '' }]
    });
  };

  const rmSession = (index) => {
    setForm({
      ...form,
      sessions: form.sessions.filter((_, i) => i !== index)
    });
  };

  const updateSession = (index, field, val) => {
    const next = [...form.sessions];
    next[index][field] = val;
    setForm({ ...form, sessions: next });
  };

  const addTicket = () => {
    setForm({
      ...form,
      tickets: [...form.tickets, { category: '', description: '', price: 0, status: 'Available', bookingUrl: '' }]
    });
  };

  const rmTicket = (index) => {
    setForm({
      ...form,
      tickets: form.tickets.filter((_, i) => i !== index)
    });
  };

  const updateTicket = (index, field, val) => {
    const next = [...form.tickets];
    next[index][field] = val;
    setForm({ ...form, tickets: next });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, image: data.imageUrl }));
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Upload error', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader 
        title="Event Schedule" 
        desc="Manage robust event details, timelines, attendance rules, sessions, and pricing configurations." 
      />

      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-2">Basic Info</h3>
          
          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
            <InputGroup label="Title" placeholder="Event Title" val={form.title} setVal={v => setForm({ ...form, title: v })} w="flex-1 w-full" />
            <InputGroup label="Organizer" placeholder="LVB Surat" val={form.organizer} setVal={v => setForm({ ...form, organizer: v })} w="w-full md:w-1/3" req={false} />
            <div className="flex flex-col gap-1.5 w-full md:w-1/4">
              <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400">Event Image</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={form.image || ''} 
                  onChange={e => setForm({ ...form, image: e.target.value })} 
                  placeholder="/gallery/events.webp" 
                  className="flex-1 bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl text-slate-100 outline-none focus:border-cyan-500 focus:bg-slate-900 transition-all font-medium text-sm"
                />
                <label className="cursor-pointer bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-3 rounded-xl transition-all font-semibold text-sm whitespace-nowrap">
                  Upload
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <InputGroup label="Day" placeholder="11" val={form.date} setVal={v => setForm({ ...form, date: v })} w="w-[80px]" req={false} />
            <InputGroup label="Month" placeholder="Jul" val={form.month} setVal={v => setForm({ ...form, month: v })} w="w-[90px]" req={false} />
            <InputGroup label="Year" placeholder="2026" val={form.year} setVal={v => setForm({ ...form, year: v })} w="w-[90px]" req={false} />
            <InputGroup label="Time" placeholder="7:15 am - 9:30 am" val={form.time} setVal={v => setForm({ ...form, time: v })} w="w-[180px]" req={false} />
            <InputGroup label="Cost Display" placeholder="₹ 500.00" val={form.cost} setVal={v => setForm({ ...form, cost: v })} w="w-[150px]" req={false} />
            <InputGroup label="Venue text" placeholder="Libris 3rd Floor..." val={form.venue} setVal={v => setForm({ ...form, venue: v })} w="flex-1 min-w-[200px]" req={false} />
          </div>
          
          <div className="flex flex-col gap-4">
            <InputGroup label="Map Embed URL (iframe src)" placeholder="https://maps.google.com/..." val={form.mapLink} setVal={v => setForm({ ...form, mapLink: v })} w="w-full" req={false} />
            <TextareaGroup label="Description Part 1 (HTML allowed)" placeholder="Join us for..." val={form.descriptionPart1} setVal={v => setForm({ ...form, descriptionPart1: v })} />
            <TextareaGroup label="Description Part 2 (HTML allowed)" placeholder="Whether you are..." val={form.descriptionPart2} setVal={v => setForm({ ...form, descriptionPart2: v })} />
          </div>

          {/* ATTENDANCE SETTINGS */}
          <div className="mt-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-2 mb-4">Attendance Rules & IST Timings</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400">Attendance Enabled</label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/60 p-3 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="attendanceEnabled" 
                    checked={form.attendanceEnabled} 
                    onChange={e => setForm({ ...form, attendanceEnabled: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="attendanceEnabled" className="text-sm font-semibold cursor-pointer text-slate-200">
                    {form.attendanceEnabled ? 'Enabled' : 'Disabled'}
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400">Event Date (YYYY-MM-DD)</label>
                <input 
                  type="date" 
                  value={form.eventDate || ''} 
                  onChange={e => setForm({ ...form, eventDate: e.target.value })} 
                  className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 outline-none focus:border-cyan-500 font-medium text-sm"
                />
              </div>

              <InputGroup label="Open Time (IST 24hr)" placeholder="07:00" val={form.attendanceOpenTime} setVal={v => setForm({ ...form, attendanceOpenTime: v })} w="w-[140px]" req={false} />
              <InputGroup label="Close Time (IST 24hr)" placeholder="08:00" val={form.attendanceCloseTime} setVal={v => setForm({ ...form, attendanceCloseTime: v })} w="w-[140px]" req={false} />
            </div>
          </div>
          
          {/* SESSIONS SECTION */}
          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
              <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Event Sessions</h3>
              <button type="button" onClick={addSession} className="text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">+ Add Session</button>
            </div>
            <div className="flex flex-col gap-4">
              {form.sessions.map((s, i) => (
                <div key={i} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 relative">
                  <button type="button" onClick={() => rmSession(i)} className="absolute top-4 right-4 text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors">X Remove</button>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <div className="flex flex-col gap-1.5 w-[140px]">
                      <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400">Icon Type</label>
                      <select value={s.iconType || 'mic'} onChange={e => updateSession(i, 'iconType', e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 outline-none focus:border-cyan-500 font-medium text-sm">
                        <option value="mic">Mic (Speaker)</option>
                        <option value="briefcase">Briefcase (Business)</option>
                        <option value="users">Users (Team)</option>
                      </select>
                    </div>
                    <InputGroup label="Session Title" placeholder="Learning Session" val={s.title} setVal={v => updateSession(i, 'title', v)} w="w-[200px]" req={false} />
                    <InputGroup label="Primary Label" placeholder="Speaker:" val={s.primaryLabel} setVal={v => updateSession(i, 'primaryLabel', v)} w="w-[120px]" req={false} />
                    <InputGroup label="Primary Text" placeholder="Name" val={s.primaryText} setVal={v => updateSession(i, 'primaryText', v)} w="flex-1" req={false} />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <InputGroup label="Secondary Label" placeholder="Topic:" val={s.secondaryLabel} setVal={v => updateSession(i, 'secondaryLabel', v)} w="w-[120px]" req={false} />
                    <InputGroup label="Secondary Text" placeholder="Leadership" val={s.secondaryText} setVal={v => updateSession(i, 'secondaryText', v)} w="flex-1" req={false} />
                    <InputGroup label="Description" placeholder="..." val={s.description} setVal={v => updateSession(i, 'description', v)} w="w-full" req={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TICKETS SECTION */}
          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
              <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Tickets</h3>
              <button type="button" onClick={addTicket} className="text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">+ Add Ticket</button>
            </div>
            <div className="flex flex-col gap-4">
              {form.tickets.map((t, i) => (
                <div key={i} className="flex flex-wrap gap-3 items-start bg-slate-900/50 p-5 rounded-2xl border border-slate-800 relative">
                  <InputGroup label="Category Name" placeholder="Meeting Fees for Visitors" val={t.category} setVal={v => updateTicket(i, 'category', v)} w="flex-1 min-w-[200px]" req={false} />
                  <InputGroup label="Price" placeholder="2500" val={t.price} setVal={v => updateTicket(i, 'price', v)} w="w-[120px]" req={false} />
                  <div className="flex flex-col gap-1.5 w-[130px]">
                    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400">Status</label>
                    <select value={t.status || 'Available'} onChange={e => updateTicket(i, 'status', e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 outline-none focus:border-cyan-500 font-medium text-sm">
                      <option value="Available">Available</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                  <InputGroup label="Info Description" placeholder="Includes breakfast..." val={t.description} setVal={v => updateTicket(i, 'description', v)} w="flex-1 min-w-[200px]" req={false} />
                  <button type="button" onClick={() => rmTicket(i)} className="bg-rose-500/10 text-rose-400 px-4 py-3.5 mt-6 rounded-xl hover:bg-rose-500 hover:text-white transition-all font-bold">X</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-800">
            <SubmitButton editing={editingId !== null} />
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="h-[46px] px-6 rounded-xl font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Date Block', 'Event Description', 'Attendance Rule', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
            <td className="p-5 font-black text-lg text-slate-100 w-40">
              <span className="text-cyan-400">{d.date || '--'}</span> <span className="opacity-70 text-sm uppercase">{d.month || 'TBD'}</span>
            </td>
            <td className="p-5 font-medium text-slate-300">
              <div className="font-bold text-slate-200">{d.title}</div>
              <div className="text-xs bg-slate-800 inline-block px-2 py-0.5 mt-1 rounded border border-slate-700/50 text-slate-400">
                {d.sessions?.length || 0} Sessions | {d.tickets?.length || 0} Tickets
              </div>
            </td>
            <td className="p-5 text-xs font-semibold text-slate-400">
              {d.attendanceEnabled !== false ? (
                <div className="flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold">Enabled</span>
                  <span>{(d.attendanceOpenTime !== undefined && d.attendanceOpenTime !== null && d.attendanceOpenTime !== '') ? d.attendanceOpenTime : '07:00'} - {(d.attendanceCloseTime !== undefined && d.attendanceCloseTime !== null && d.attendanceCloseTime !== '') ? d.attendanceCloseTime : '08:00'} IST</span>
                </div>
              ) : (
                <span className="text-rose-400 font-bold">Disabled</span>
              )}
            </td>
            <td className="p-5 w-32 text-right">
              <EditBtn onClick={() => handleEdit(d)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No events found."
      />
    </div>
  );
}
