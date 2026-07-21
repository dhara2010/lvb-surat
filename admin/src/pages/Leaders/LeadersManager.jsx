import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn, resolveImageUrl } from '../../components/AdminUI';

export default function LeadersManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', img: '' });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/leaders')
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
        const res = await fetch(`${apiUrl}/api/leaders/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('Leadership member updated successfully', 'success');
        } else {
          showToast('Failed to update leadership member', 'error');
        }
        setEditingId(null);
      } else {
        const res = await fetch(`${apiUrl}/api/leaders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('Leadership member added successfully', 'success');
        } else {
          showToast('Failed to add leadership member', 'error');
        }
      }
      setForm({ name: '', role: '', img: '' });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, role: d.role, img: d.img });
    if (scrollToTop) scrollToTop();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete leadership member?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/api/leaders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Leadership member deleted successfully', 'success');
        loadData();
      } else {
        showToast('Failed to delete leadership member', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete leadership member', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader title="Leadership Directory" desc="Manage board officers and executives shown in the 3D team carousel." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
          <InputGroup label="Full Name" placeholder="e.g. John Doe" val={form.name} setVal={v => setForm({ ...form, name: v })} w="flex-1 w-full" />
          <InputGroup label="Position" placeholder="e.g. Chapter Director" val={form.role} setVal={v => setForm({ ...form, role: v })} w="flex-1 w-full" />
          <FileInputGroup label="Portrait Image URL" placeholder="/members/john.png" val={form.img} setVal={v => setForm({ ...form, img: v })} token={token} showToast={showToast} w="flex-1 w-full" />
          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <SubmitButton editing={editingId !== null} />
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', role: '', img: '' }); }} 
                className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex-1 md:flex-none">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Portrait', 'Officer Name', 'Role Position', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
            <td className="p-4 w-24">
              <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-750 shadow-sm">
                <img loading="lazy" decoding="async" src={resolveImageUrl(d.img)} alt="leader portrait" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            </td>
            <td className="p-4 font-extrabold text-slate-100">{d.name}</td>
            <td className="p-4 text-slate-400 font-semibold text-sm tracking-wide">{d.role}</td>
            <td className="p-4 w-32 text-right">
              <EditBtn onClick={() => handleEdit(d)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No leaders cataloged."
      />
    </div>
  );
}
