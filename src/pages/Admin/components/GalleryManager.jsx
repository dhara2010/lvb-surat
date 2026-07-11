import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { SectionHeader } from './AdminUI';

export default function GalleryManager({ token }) {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const loadData = () => fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/gallery').then(res=>res.json()).then(setData);
  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!file) return alert('Select file');
    const formData = new FormData();
    formData.append('image', file);
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/gallery', {
      method:'POST', headers: {'Authorization': `Bearer ${token}`}, body: formData
    });
    setFile(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Erase this photo from cloud storage?')) return;
    await fetch(`http://localhost:5000/api/gallery/${id}`, { method:'DELETE', headers:{'Authorization': `Bearer ${token}`}});
    loadData();
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <SectionHeader title="Gallery Assets" desc="Upload new chapter photographs or prune old ones." />
      
      <div className="bg-white border border-[#D9E6EC] p-6 rounded-2xl flex items-center justify-between shadow-sm">
        <form onSubmit={handleUpload} className="w-full flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider pl-1 text-[#64748B] block mb-2">Payload (Raw Image)</label>
            <input type="file" required onChange={e=>setFile(e.target.files[0])} accept="image/*" 
              className="w-full block text-sm text-[#1F2937] file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#F4F8FA] file:text-[#044765] hover:file:bg-[#D9E6EC] transition-all cursor-pointer bg-[#F4F8FA] border border-[#D9E6EC] rounded-xl outline-none" 
            />
          </div>
          <button className="w-full md:w-auto h-[46px] shrink-0 bg-[#044765] text-white px-8 rounded-xl font-bold uppercase tracking-wider hover:bg-[#03627D] transition-colors shadow-md">
            Upload
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data.map((d, i) => (
          <motion.div 
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.02 }}
            key={d.id} 
            className="group relative rounded-2xl overflow-hidden border border-[#D9E6EC] aspect-[4/3] bg-[#F4F8FA] shadow-sm"
          >
            <img src={d.image_url} alt="gallery thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <button type="button" onClick={()=>handleDelete(d.id)} className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 shadow-xl backdrop-blur-sm transition-transform hover:scale-110">
                <Trash2 size={18}/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {data.length === 0 && <p className="text-[#64748B] p-10 text-center border border-dashed border-[#D9E6EC] bg-white rounded-2xl shadow-sm">Database empty.</p>}
    </div>
  );
}
