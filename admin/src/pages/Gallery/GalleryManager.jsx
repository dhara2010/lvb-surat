import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { SectionHeader, resolveImageUrl } from '../../components/AdminUI';

export default function GalleryManager({ token, showToast }) {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/gallery')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showToast('Please select an image file first.', 'error');
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setFile(null);
        e.target.reset();
        showToast('Gallery image uploaded successfully.', 'success');
        loadData();
      } else {
        showToast('Image upload failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Image upload failed.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete photo?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Gallery image deleted successfully.', 'success');
        loadData();
      } else {
        showToast('Failed to delete gallery image.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete gallery image.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader title="Gallery Assets" desc="Upload chapter photography or manage existing ones." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm">
        <form onSubmit={handleUpload} className="w-full flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-slate-400 block mb-2">Payload (Raw Image)</label>
            <input type="file" required onChange={e => setFile(e.target.files[0])} accept="image/*" 
              className="w-full block text-sm text-slate-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 transition-all cursor-pointer bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none" 
            />
          </div>
          <button className="w-full md:w-auto h-[46px] shrink-0 bg-cyan-600 hover:bg-cyan-505 text-white px-8 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md">
            Upload Image
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data.map((d) => (
          <div 
            key={d.id} 
            className="group relative rounded-2xl overflow-hidden border border-slate-800 aspect-[4/3] bg-slate-900/20 shadow-sm"
          >
            <img loading="lazy" decoding="async" src={resolveImageUrl(d.image_url)} alt="gallery thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <button type="button" onClick={() => handleDelete(d.id)} className="bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-500 shadow-xl backdrop-blur-sm transition-transform hover:scale-110">
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && <p className="text-slate-500 p-10 text-center border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl shadow-sm">Database empty.</p>}
    </div>
  );
}
