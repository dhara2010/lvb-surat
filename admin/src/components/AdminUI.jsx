import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

export const SectionHeader = ({ title, desc }) => (
  <div className="flex flex-col gap-1 pb-4 border-b border-border">
    <h2 className="text-2xl font-black tracking-tight text-heading uppercase font-display">{title}</h2>
    <p className="text-sm font-medium text-muted">{desc}</p>
  </div>
);

export const InputGroup = ({ label, placeholder, val, setVal, type="text", w="w-full", req=true }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">{label}</label>
    <input required={req} type={type} value={val || ''} onChange={e=>setVal(e.target.value)} placeholder={placeholder} 
      className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm" 
    />
  </div>
);

export const TextareaGroup = ({ label, placeholder, val, setVal, rows=3, w="w-full", req=true }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">{label}</label>
    <textarea required={req} rows={rows} value={val || ''} onChange={e=>setVal(e.target.value)} placeholder={placeholder} 
      className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm resize-none" 
    />
  </div>
);

export const FileInputGroup = ({ label, placeholder, val, setVal, token, showToast, w="w-full", req=true }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if(data.imageUrl) {
        setVal(data.imageUrl);
        if (showToast) showToast('File uploaded successfully.', 'success');
      } else {
        if (showToast) showToast("Upload failed: " + (data.message || "Unknown error"), 'error');
        else alert("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Upload failed.", 'error');
      else alert("Upload failed.");
    }
  };
  
  return (
    <div className={`flex flex-col gap-1.5 ${w}`}>
      <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">{label}</label>
      <div className="relative flex items-center">
        <input required={req} type="text" value={val || ''} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
          className="w-full bg-bg border border-border p-3 pr-[110px] rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm" 
        />
        <label className="absolute right-1.5 top-1.5 bottom-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 text-xs font-bold px-4 rounded-lg cursor-pointer flex items-center justify-center transition-all">
          Upload
          <input type="file" onChange={handleUpload} accept="image/*" className="hidden" />
        </label>
      </div>
    </div>
  );
};

export const SubmitButton = ({ editing }) => (
  <button type="submit" className={`h-[44px] shrink-0 bg-cyan-600 hover:bg-cyan-505 text-white px-6 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${editing ? '!bg-amber-600 hover:!bg-amber-500' : ''}`}>
    {editing ? <Edit2 size={16} strokeWidth={3}/> : <Plus size={16} strokeWidth={3}/>} 
    {editing ? 'Update' : 'Add Record'}
  </button>
);

export const EditBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="text-cyan-400 hover:bg-cyan-500/10 p-2.5 rounded-lg transition-all mr-1" aria-label="Edit">
    <Edit2 size={18} />
  </button>
);

export const DeleteBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="text-rose-500 hover:bg-rose-500/10 p-2.5 rounded-lg transition-all" aria-label="Delete">
    <Trash2 size={18} />
  </button>
);

export const PremiumTable = ({ headers, rows, emptyText }) => (
  <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-bg border-b border-border">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-4 text-xs font-bold uppercase tracking-widest text-muted">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">{rows}</tbody>
      </table>
    </div>
    {rows.length === 0 && <div className="p-10 text-center text-sm font-semibold text-muted">{emptyText}</div>}
  </div>
);

// Helper function to resolve dynamic image paths
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${url}`;
};
