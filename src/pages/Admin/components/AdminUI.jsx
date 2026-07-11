import { Plus, Trash2, Edit2, Search } from 'lucide-react';

export const SectionHeader = ({ title, desc }) => (
  <div className="mb-6">
    <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-[#1F2937]">{title}</h1>
    <p className="text-[#64748B] text-sm font-medium">{desc}</p>
  </div>
);

export const InputGroup = ({ label, placeholder, val, setVal, w="w-full", req=true }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-[#64748B]">{label}</label>
    <input required={req} type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#F4F8FA] border border-[#D9E6EC] p-3 rounded-xl text-[#1F2937] outline-none focus:border-[#0EA5A8] focus:bg-white transition-all font-medium text-sm" 
    />
  </div>
);

export const TextareaGroup = ({ label, placeholder, val, setVal, w="w-full", req=false }) => (
  <div className={`flex flex-col gap-1.5 ${w}`}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1 text-[#64748B]">{label}</label>
    <textarea required={req} value={val||''} onChange={e=>setVal(e.target.value)} placeholder={placeholder} rows="3"
      className="w-full bg-[#F4F8FA] border border-[#D9E6EC] p-3 rounded-xl text-[#1F2937] outline-none focus:border-[#0EA5A8] focus:bg-white transition-all font-medium text-sm whitespace-pre-wrap" 
    />
  </div>
);

export const FileInputGroup = ({ label, placeholder, val, setVal, token, w="w-full", req=true }) => {
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
      <label className="text-xs font-bold uppercase tracking-wider pl-1 text-[#64748B]">{label}</label>
      <div className="relative flex items-center">
        <input required={req} type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
          className="w-full bg-[#F4F8FA] border border-[#D9E6EC] p-3 pr-[110px] rounded-xl text-[#1F2937] outline-none focus:border-[#0EA5A8] focus:bg-white transition-all font-medium text-sm" 
        />
        <label className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#044765]/10 hover:bg-[#044765]/20 text-[#044765] hover:text-[#044765] text-xs font-bold px-4 rounded-lg cursor-pointer flex items-center justify-center transition-all">
          Upload
          <input type="file" onChange={handleUpload} accept="image/*" className="hidden" />
        </label>
      </div>
    </div>
  );
};

export const SubmitButton = ({ editing }) => (
  <button type="submit" className={`h-[44px] shrink-0 bg-[#044765] text-white px-6 rounded-xl font-bold uppercase tracking-wider hover:bg-[#03627D] transition-all shadow-md flex items-center justify-center gap-2 ${editing ? '!bg-[#0EA5A8]' : ''}`}>
    {editing ? <Edit2 size={16} strokeWidth={3}/> : <Plus size={16} strokeWidth={3}/>} 
    {editing ? 'Update' : 'Add Record'}
  </button>
);

export const EditBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="text-[#0EA5A8] hover:bg-[#0EA5A8]/10 p-2.5 rounded-lg transition-all mr-1" aria-label="Edit">
    <Edit2 size={18} />
  </button>
);

export const DeleteBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="text-red-500 hover:bg-red-50 p-2.5 rounded-lg transition-all" aria-label="Delete">
    <Trash2 size={18} />
  </button>
);

export const PremiumTable = ({ headers, rows, emptyText }) => (
  <div className="bg-white border border-[#D9E6EC] rounded-2xl overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-[#F4F8FA] border-b border-[#D9E6EC]">
          <tr>
            {headers.map((h, i) => <th key={i} className="p-4 text-xs font-bold uppercase tracking-widest text-[#64748B]">{h}</th>)}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    {rows.length === 0 && <div className="p-10 text-center text-sm font-semibold text-[#64748B]">{emptyText}</div>}
  </div>
);
