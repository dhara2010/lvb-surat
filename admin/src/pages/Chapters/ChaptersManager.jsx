import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn, resolveImageUrl } from '../../components/AdminUI';

export default function ChaptersManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', city: '', memberCount: '', foundedYear: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/chapters')
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
    const payload = {
      ...form,
      memberCount: Number(form.memberCount) || 0,
      foundedYear: Number(form.foundedYear) || undefined
    };
    try {
      if (editingId) {
        const res = await fetch(`${apiUrl}/api/chapters/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast('Chapter updated successfully', 'success');
        } else {
          showToast('Failed to update chapter', 'error');
        }
        setEditingId(null);
      } else {
        const res = await fetch(`${apiUrl}/api/chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast('Chapter created successfully', 'success');
        } else {
          showToast('Failed to create chapter', 'error');
        }
      }
      setForm({ name: '', city: '', memberCount: '', foundedYear: '', image: '' });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, city: d.city, memberCount: String(d.memberCount), foundedYear: String(d.foundedYear || ''), image: d.image || '' });
    if (scrollToTop) scrollToTop();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete chapter?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/api/chapters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Chapter deleted successfully', 'success');
        loadData();
      } else {
        showToast('Failed to delete chapter', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete chapter', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader title="Chapter Management" desc="Manage local active LVB Chapters and locations details." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <InputGroup label="Chapter Name" placeholder="e.g. Surat Platinum" val={form.name} setVal={v => setForm({ ...form, name: v })} w="flex-1 w-full" />
            <InputGroup label="City Location" placeholder="e.g. Surat" val={form.city} setVal={v => setForm({ ...form, city: v })} w="flex-1 w-full" />
            <InputGroup label="Member Count" placeholder="e.g. 150" type="number" val={form.memberCount} setVal={v => setForm({ ...form, memberCount: v })} w="w-full md:w-[150px]" />
            <InputGroup label="Founded Year" placeholder="e.g. 2020" type="number" val={form.foundedYear} setVal={v => setForm({ ...form, foundedYear: v })} w="w-full md:w-[150px]" req={false} />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <FileInputGroup label="Banner Image URL" placeholder="/gallery/29-1.webp" val={form.image} setVal={v => setForm({ ...form, image: v })} token={token} showToast={showToast} w="flex-1 w-full" req={false} />
            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <SubmitButton editing={editingId !== null} />
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', city: '', memberCount: '', foundedYear: '', image: '' }); }} 
                  className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex-1 md:flex-none">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Cover', 'Chapter Name', 'City', 'Members', 'Founded', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
            <td className="p-4 w-28">
              <div className="w-16 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-750 shadow-sm">
                {d.image && <img loading="lazy" decoding="async" src={resolveImageUrl(d.image)} alt="chapter logo" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />}
              </div>
            </td>
            <td className="p-4 font-extrabold text-slate-100">{d.name}</td>
            <td className="p-4 text-slate-300 text-sm">{d.city}</td>
            <td className="p-4 text-cyan-400 font-bold text-sm">{d.memberCount} members</td>
            <td className="p-4 text-slate-400 text-sm font-semibold">{d.foundedYear || 'N/A'}</td>
            <td className="p-4 w-32 text-right">
              <EditBtn onClick={() => handleEdit(d)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No chapters cataloged."
      />
    </div>
  );
}
