import { Plus, Trash2, Edit2 } from 'lucide-react';

export const SectionHeader = ({ title, desc }) => (
  <div className="mb-4">
    <h1 className="text-3xl font-black mb-1">{title}</h1>
    <p className="text-gray-400 text-sm font-medium">{desc}</p>
  </div>
);

export const InputGroup = ({ label, placeholder, val, setVal, w="w-full" }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-gray-400">{label}</label>
    <input required type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
      className="w-full bg-black/20 border border-white/10 p-3.5 rounded-xl text-white outline-none focus:border-[#14B8A6] focus:bg-black/30 transition-all font-medium text-sm" 
    />
  </div>
);

export const FileInputGroup = ({ label, placeholder, val, setVal, token, w="w-full" }) => {
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
      if(data.imageUrl) setVal(data.imageUrl);
    } catch {
      alert("Upload failed.");
    }
  };
  return (
    <div className={`flex flex-col gap-1.5 ${w}`}>
      <label className="text-xs font-bold uppercase tracking-wider pl-1 text-gray-400">{label}</label>
      <div className="relative flex items-center">
        <input required type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
          className="w-full bg-black/20 border border-white/10 p-3.5 pr-28 rounded-xl text-white outline-none focus:border-[#14B8A6] focus:bg-black/30 transition-all font-medium text-sm" 
        />
        <label className="absolute right-1.5 top-1.5 bottom-1.5 bg-white/10 hover:bg-white/20 text-[#14B8A6] hover:text-emerald-400 text-xs font-bold px-4 rounded-lg cursor-pointer flex items-center justify-center transition-all">
          Upload
          <input type="file" onChange={handleUpload} accept="image/*" className="hidden" />
        </label>
      </div>
    </div>
  );
};

export const SubmitButton = ({ editing }) => (
  <button type="submit" className={`h-[46px] shrink-0 bg-white text-[#0B1F3A] px-6 rounded-xl font-bold uppercase tracking-wider hover:bg-[#14B8A6] hover:text-white transition-all shadow-lg flex items-center gap-2 ${editing ? '!bg-[#14B8A6] text-white' : ''}`}>
    {editing ? <Edit2 size={18} strokeWidth={3}/> : <Plus size={18} strokeWidth={3}/>} 
    {editing ? 'Update' : 'Add Record'}
  </button>
);

export const EditBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="text-blue-400/80 hover:text-blue-400 hover:bg-blue-400/10 p-2.5 rounded-lg transition-all mr-1" aria-label="Edit">
    <Edit2 size={18} />
  </button>
);

export const DeleteBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="text-red-400/80 hover:text-red-400 hover:bg-red-400/10 p-2.5 rounded-lg transition-all" aria-label="Delete">
    <Trash2 size={18} />
  </button>
);

export const PremiumTable = ({ headers, rows, emptyText }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
    <table className="w-full text-left border-collapse">
      <thead className="bg-black/20 border-b border-white/10">
        <tr>
          {headers.map((h, i) => <th key={i} className="p-5 text-xs font-bold uppercase tracking-widest text-[#14B8A6]">{h}</th>)}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    {rows.length === 0 && <div className="p-10 text-center text-sm font-semibold text-gray-500">{emptyText}</div>}
  </div>
);
