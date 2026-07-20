import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, TextareaGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn, resolveImageUrl } from '../../components/AdminUI';

export default function BlogsManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', author: 'Admin', image: '' });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/blogs')
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
        const res = await fetch(`${apiUrl}/api/blogs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('Blog article updated successfully', 'success');
        } else {
          showToast('Failed to update blog article', 'error');
        }
        setEditingId(null);
      } else {
        const res = await fetch(`${apiUrl}/api/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('Blog article published successfully', 'success');
        } else {
          showToast('Failed to publish blog article', 'error');
        }
      }
      setForm({ title: '', content: '', author: 'Admin', image: '' });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ title: d.title, content: d.content, author: d.author || 'Admin', image: d.image || '' });
    if (scrollToTop) scrollToTop();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete blog article?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Blog article deleted successfully', 'success');
        loadData();
      } else {
        showToast('Failed to delete blog article', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete blog article', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader title="Blog Articles" desc="Compose and publish informative articles or news updates." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <InputGroup label="Article Title" placeholder="e.g. Growing your business through networking" val={form.title} setVal={v => setForm({ ...form, title: v })} w="flex-1 w-full" />
            <InputGroup label="Author" placeholder="e.g. Admin" val={form.author} setVal={v => setForm({ ...form, author: v })} w="w-full md:w-[200px]" />
          </div>
          <TextareaGroup label="Article Content (Supports text & HTML)" placeholder="Type body copy here..." val={form.content} setVal={v => setForm({ ...form, content: v })} rows={5} />
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <FileInputGroup label="Featured Image URL" placeholder="/gallery/1-1.webp" val={form.image} setVal={v => setForm({ ...form, image: v })} token={token} showToast={showToast} w="flex-1 w-full" req={false} />
            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <SubmitButton editing={editingId !== null} />
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', content: '', author: 'Admin', image: '' }); }} 
                  className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex-1 md:flex-none">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Cover', 'Article Title', 'Author', 'Published Date', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
            <td className="p-4 w-28">
              <div className="w-16 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-750 shadow-sm">
                {d.image && <img loading="lazy" decoding="async" src={resolveImageUrl(d.image)} alt="blog thumbnail" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />}
              </div>
            </td>
            <td className="p-4 font-extrabold text-slate-100 max-w-[300px] truncate">{d.title}</td>
            <td className="p-4 text-slate-300 text-sm font-semibold">{d.author}</td>
            <td className="p-4 text-slate-400 text-xs font-semibold">
              {new Date(d.created_at || d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td className="p-4 w-32 text-right">
              <EditBtn onClick={() => handleEdit(d)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No blog articles written yet."
      />
    </div>
  );
}
