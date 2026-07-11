import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, TextareaGroup, SubmitButton } from '../components/AdminUI';

const initialForm = {
  title: '', date: '', month: '', year: '', time: '', cost: '',
  venue: '', mapLink: '', organizer: '', image: '', descriptionPart1: '', descriptionPart2: '',
  sessions: [], tickets: []
};

export default function EventForm({ initialData = null, onSubmit, token, onCancel }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialForm,
        ...initialData,
        sessions: initialData.sessions || [],
        tickets: initialData.tickets || []
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Helper for dynamic arrays
  const addSession = () => setForm({ ...form, sessions: [...form.sessions, { iconType: 'mic', title: '', primaryLabel: '', primaryText: '', secondaryLabel: '', secondaryText: '', description: '' }] });
  const rmSession = (i) => setForm({ ...form, sessions: form.sessions.filter((_, idx) => idx !== i) });
  const updateSession = (i, field, val) => {
    const s = [...form.sessions];
    s[i][field] = val;
    setForm({ ...form, sessions: s });
  };

  const addTicket = () => setForm({ ...form, tickets: [...form.tickets, { category: '', description: '', price: 0 }] });
  const rmTicket = (i) => setForm({ ...form, tickets: form.tickets.filter((_, idx) => idx !== i) });
  const updateTicket = (i, field, val) => {
    const t = [...form.tickets];
    t[i][field] = val;
    setForm({ ...form, tickets: t });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadData = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, image: uploadData.imageUrl }));
      } else {
        alert(uploadData.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    }
  };

  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h3 className="text-secondary font-bold uppercase tracking-wider text-sm border-b border-border pb-2">Basic Info</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <InputGroup label="Title" placeholder="Event Title" val={form.title||''} setVal={v => setForm({...form, title: v})} w="flex-1 w-full" />
          <InputGroup label="Organizer" placeholder="LVB Surat" val={form.organizer||''} setVal={v => setForm({...form, organizer: v})} w="md:w-1/3 w-full" req={false} />
          <div className="flex flex-col gap-1.5 flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">Event Image</label>
            <div className="flex items-center gap-2">
              <input type="text" value={form.image||''} onChange={e=>setForm({...form, image: e.target.value})} placeholder="/12-1.webp" className="flex-1 bg-bg-alt border border-border p-3 rounded-xl text-body outline-none focus:border-secondary focus:bg-white transition-all font-medium text-sm" />
              <label className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-4 py-3 rounded-xl transition-all font-bold text-xs flex items-center justify-center whitespace-nowrap h-[46px]">
                Upload
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <InputGroup label="Day" placeholder="11" val={form.date||''} setVal={v => setForm({...form, date: v})} w="w-[45%] md:w-[80px]" req={false} />
          <InputGroup label="Month" placeholder="Jul" val={form.month||''} setVal={v => setForm({...form, month: v})} w="w-[45%] md:w-[90px]" req={false} />
          <InputGroup label="Year" placeholder="2026" val={form.year||''} setVal={v => setForm({...form, year: v})} w="w-[45%] md:w-[90px]" req={false} />
          <InputGroup label="Time" placeholder="7:15 am - 9:30 am" val={form.time||''} setVal={v => setForm({...form, time: v})} w="w-[45%] md:w-[180px]" req={false} />
          <InputGroup label="Cost Display" placeholder="₹ 500.00" val={form.cost||''} setVal={v => setForm({...form, cost: v})} w="w-[45%] md:w-[150px]" req={false} />
          <InputGroup label="Venue text" placeholder="Libris 3rd Floor..." val={form.venue||''} setVal={v => setForm({...form, venue: v})} w="flex-1 w-full min-w-[200px]" req={false} />
        </div>
        
        <div className="flex flex-col gap-4">
          <InputGroup label="Map Embed URL (iframe src)" placeholder="https://maps.google.com/..." val={form.mapLink||''} setVal={v => setForm({...form, mapLink: v})} w="w-full" req={false} />
          <TextareaGroup label="Description Part 1 (HTML allowed)" placeholder="Join us for..." val={form.descriptionPart1||''} setVal={v => setForm({...form, descriptionPart1: v})} />
          <TextareaGroup label="Description Part 2 (HTML allowed)" placeholder="Whether you are..." val={form.descriptionPart2||''} setVal={v => setForm({...form, descriptionPart2: v})} />
        </div>
        
        {/* SESSIONS SECTION */}
        <div className="mt-2">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h3 className="text-secondary font-bold uppercase tracking-wider text-sm">Event Sessions</h3>
            <button type="button" onClick={addSession} className="text-xs font-bold uppercase tracking-wider bg-bg-alt text-primary hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">+ Add Session</button>
          </div>
          <div className="flex flex-col gap-4">
            {form.sessions.map((s, i) => (
              <div key={i} className="bg-bg-alt p-5 rounded-xl border border-border relative shadow-sm">
                <button type="button" onClick={() => rmSession(i)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors">X Remove</button>
                <div className="flex flex-wrap gap-4 mt-6">
                   <div className="flex flex-col gap-1.5 w-[140px]">
                      <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">Icon Type</label>
                      <select value={s.iconType} onChange={e => updateSession(i, 'iconType', e.target.value)} className="w-full bg-white border border-border p-3 rounded-xl text-body outline-none focus:border-secondary font-medium text-sm">
                         <option value="mic">Mic (Speaker)</option>
                         <option value="briefcase">Briefcase (Business)</option>
                         <option value="users">Users (Team)</option>
                      </select>
                   </div>
                   <InputGroup label="Session Title" placeholder="Learning Session" val={s.title} setVal={v => updateSession(i, 'title', v)} w="w-full md:w-[200px]" req={false} />
                   <InputGroup label="Primary Label" placeholder="Speaker:" val={s.primaryLabel} setVal={v => updateSession(i, 'primaryLabel', v)} w="w-full md:w-[120px]" req={false} />
                   <InputGroup label="Primary Text" placeholder="Name" val={s.primaryText} setVal={v => updateSession(i, 'primaryText', v)} w="flex-1 w-full" req={false} />
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                   <InputGroup label="Secondary Label" placeholder="Topic:" val={s.secondaryLabel} setVal={v => updateSession(i, 'secondaryLabel', v)} w="w-full md:w-[120px]" req={false} />
                   <InputGroup label="Secondary Text" placeholder="Leadership" val={s.secondaryText} setVal={v => updateSession(i, 'secondaryText', v)} w="flex-1 w-full min-w-[200px]" req={false} />
                   <InputGroup label="Description" placeholder="..." val={s.description} setVal={v => updateSession(i, 'description', v)} w="w-full" req={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TICKETS SECTION */}
        <div className="mt-2">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h3 className="text-secondary font-bold uppercase tracking-wider text-sm">Tickets</h3>
            <button type="button" onClick={addTicket} className="text-xs font-bold uppercase tracking-wider bg-bg-alt text-primary hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">+ Add Ticket</button>
          </div>
          <div className="flex flex-col gap-4">
            {form.tickets.map((t, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-bg-alt p-5 rounded-xl border border-border relative">
                <InputGroup label="Category Name" placeholder="Meeting Fees for Visitors" val={t.category} setVal={v => updateTicket(i, 'category', v)} w="flex-1 w-full" req={false} />
                <InputGroup label="Price" placeholder="2500" val={t.price} setVal={v => updateTicket(i, 'price', v)} w="w-full md:w-[120px]" req={false} />
                <InputGroup label="Info Description" placeholder="Includes breakfast..." val={t.description} setVal={v => updateTicket(i, 'description', v)} w="w-full md:w-[45%]" req={false} />
                <button type="button" onClick={() => rmTicket(i)} className="bg-red-50 text-red-500 px-4 py-3 md:mt-[22px] rounded-xl hover:bg-red-100 transition-all font-bold self-end md:self-auto">X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-border mt-2">
          <SubmitButton editing={!!initialData} />
          <button type="button" onClick={onCancel} className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-bg-alt text-muted hover:bg-slate-200 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
