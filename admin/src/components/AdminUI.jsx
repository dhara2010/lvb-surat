import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

export const SectionHeader = ({ title, desc }) => (
  <div className="mb-6">
    <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-heading">{title}</h1>
    <p className="text-muted text-sm font-medium">{desc}</p>
  </div>
);

export const InputGroup = ({ label, placeholder, val, setVal, w="w-full", req=true, type="text" }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">{label}</label>
    <input required={req} type={type} value={val || ''} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
      className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm" 
    />
  </div>
);

export const PasswordInputGroup = ({ label, placeholder, val, setVal, w="w-full", req=true }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`flex flex-col gap-1.5 ${w}`}>
      <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">{label}</label>
      <div className="relative flex items-center">
        <input 
          required={req} 
          type={show ? "text" : "password"} 
          value={val || ''} 
          onChange={e=>setVal(e.target.value)} 
          placeholder={placeholder}
          className="w-full bg-bg border border-border p-3 pr-10 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm" 
        />
        <button 
          type="button" 
          onClick={() => setShow(!show)}
          className="absolute right-3 text-muted hover:text-heading focus:outline-none flex items-center justify-center cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export const TextareaGroup = ({ label, placeholder, val, setVal, w="w-full", req=false, rows=3 }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-muted">{label}</label>
    <textarea required={req} value={val || ''} onChange={e=>setVal(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 focus:bg-bg-alt transition-all font-medium text-sm whitespace-pre-wrap" 
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
<<<<<<< HEAD
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:5000") +
          "/api/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      
      const responseText = await res.text();
      let data = null;
      
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        data = { message: responseText || `HTTP ${res.status}` };
      }

      if (res.ok && data?.imageUrl) {
=======
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if(data.imageUrl) {
>>>>>>> 3357e0df5b435410dd8b44ec3274501dc391a6e5
        setVal(data.imageUrl);
        if (showToast) showToast('File uploaded successfully.', 'success');
      } else {
<<<<<<< HEAD
        alert("Upload Server Error: " + (data?.message || data?.error || `Status ${res.status}`));
      }
    } catch (err) {
      console.error("Upload network block:", err);
      alert("Upload Connection Failed: " + err.message);
=======
        if (showToast) showToast("Upload failed: " + (data.message || "Unknown error"), 'error');
        else alert("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Upload failed.", 'error');
      else alert("Upload failed.");
>>>>>>> 3357e0df5b435410dd8b44ec3274501dc391a6e5
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

<<<<<<< HEAD

=======
// Helper function to resolve dynamic image paths
>>>>>>> 3357e0df5b435410dd8b44ec3274501dc391a6e5
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${url}`;
};
