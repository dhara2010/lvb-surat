import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageSquare, Diamond, Building2, Stethoscope, CalendarDays, Plane, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getMembers } from '../../api/membersApi';
import PageHeader from '../../components/ui/PageHeader';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

const vacantCategories = [
  { icon: Diamond, title: 'Diamond Merchant' },
  { icon: Building2, title: 'Real Estate Builder' },
  { icon: Stethoscope, title: 'General Physician' },
  { icon: CalendarDays, title: 'Event Management' },
  { icon: Plane, title: 'Travel Agency' }
];

export default function MembersDirectory() {
  const { data: membersData, loading, error } = useFetch(getMembers);
  const platinumMembers = membersData || [];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans overflow-x-hidden pb-0">
      
      <PageHeader 
        label="MEMBERS DIRECTORY"
        title={<>Relationships That <br className="md:hidden" /><span className="text-secondary">Grow Business</span></>}
        description="Meet the elite 50+ professionals forming the core of the Surat Platinum Chapter."
      />

      {/* ─── HERO SECTION ──────────────── */}
      <section className="relative mt-8 md:mt-10 px-4 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <motion.div {...inView(0.1)} className="w-full rounded-[40px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
            <img loading="lazy" decoding="async" src="/gallery/1-1.webp" 
              alt="Group Meet" 
              className="w-full h-[250px] md:h-[450px] object-cover"
              onError={(e) => { e.target.src = '/members/KVS_3369-2048x1365.webp'; }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BANNER ──────────────── */}
      <section className="relative -mt-12 md:-mt-20 z-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            {...inView(0.2)} 
            className="bg-white rounded-3xl p-8 md:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between border border-gray-100 backdrop-blur-xl"
          >
            <div className="flex-1 text-center md:text-left md:pl-10 mb-8 md:mb-0 border-b md:border-b-0 border-gray-100 pb-8 md:pb-0">
              <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight">LVB Surat Platinum</h2>
              <p className="text-secondary uppercase tracking-[0.25em] text-[11px] font-black mt-2">Chapter Network</p>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-around w-full border-l md:border-t-0 border-gray-100 md:pl-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="flex flex-col items-center py-5 md:py-0 px-6 w-full group">
                <Users className="text-secondary mb-3 group-hover:-translate-y-1 transition-transform" strokeWidth={1.5} size={28}/>
                <span className="text-3xl font-black text-primary mb-1">50+</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Professionals</span>
              </div>
              <div className="flex flex-col items-center py-5 md:py-0 px-6 w-full group">
                <TrendingUp className="text-secondary mb-3 group-hover:-translate-y-1 transition-transform" strokeWidth={1.5} size={28}/>
                <span className="text-3xl font-black text-primary mb-1">₹500 Cr+</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Business Done</span>
              </div>
              <div className="flex flex-col items-center py-5 md:py-0 px-6 w-full group">
                <MessageSquare className="text-secondary mb-3 group-hover:-translate-y-1 transition-transform" strokeWidth={1.5} size={28}/>
                <span className="text-3xl font-black text-primary mb-1">12+</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Testimonials</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── GRID SECTION ──────────────── */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <motion.div {...inView(0)} className="text-center mb-20">
          <span className="inline-block text-secondary font-extrabold tracking-[0.3em] uppercase text-xs mb-4">Elite Network</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight leading-[1.1]">
            Meet our <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#4FA3D1]">Platinum Members</span>
          </h2>
          <div className="w-16 h-1.5 bg-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 min-h-[300px]">
          {loading && <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 font-bold tracking-[0.2em]">LOADING MEMBERS...</div>}
          {error && <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-500 font-bold tracking-[0.2em]">FAILED TO LOAD MEMBERS</div>}
          {!loading && !error && platinumMembers.length === 0 && <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 font-bold tracking-[0.2em]">NO MEMBERS AVAILABLE</div>}

          {platinumMembers.map((m, i) => (
            <motion.div
              key={m.id || i}
              {...inView((i % 9) * 0.05)}
              className="bg-white rounded-[30px] p-8 border border-gray-100 hover:border-secondary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-400 group flex flex-col hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Premium Top Line Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex justify-between items-start mb-8 relative z-10 w-full">
                <img loading="lazy" decoding="async" src={m.photoUrl} 
                  alt={m.name} 
                  className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-[24px] object-cover shadow-sm bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${m.name}&backgroundColor=09475f&textColor=fff`; }}
                />
                <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] rounded-[20px] bg-white border border-gray-100 shadow-sm p-3 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img loading="lazy" decoding="async" src={m.logoUrl} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col mt-auto pb-4 border-b border-gray-100">
                <h3 className="text-2xl font-black text-primary truncate leading-tight group-hover:text-secondary transition-colors duration-300">{m.name}</h3>
                
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-8 h-[2px] shrink-0 bg-secondary rounded-full"></div>
                  <span className="uppercase text-[11px] font-black tracking-[0.2em] text-secondary truncate">{m.businessName}</span>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between items-center">
                <span className="inline-block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] truncate mr-2">
                  {m.businessCategory}
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── VACANT CATEGORIES ──────────────── */}
      <section className="bg-gray-50 py-24 relative overflow-hidden border-t border-gray-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4FA3D1]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10 flex flex-col items-center">
          <motion.div {...inView(0)} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight leading-[1.1]">
              Top Vacant Categories
            </h2>
            <div className="w-16 h-1.5 bg-secondary mx-auto rounded-full"></div>
            <p className="text-slate-600 mt-8 max-w-lg mx-auto text-[15px] leading-relaxed font-medium">
              We exclusively allow one profession per category. Lock out your competition by filling one of our vacant seats today.
            </p>
          </motion.div>

          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl">
            {vacantCategories.map((v, i) => (
              <motion.div 
                key={i}
                {...inView(i * 0.1)}
                className={`flex flex-col items-center group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-400 ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <v.icon size={26} strokeWidth={1.5}/>
                </div>
                <h4 className="text-primary font-extrabold text-center text-[13px] md:text-[15px] leading-tight">
                  {v.title}
                </h4>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...inView(0.4)} className="mt-16">
            <Link to="/contact" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-10 py-5 font-bold uppercase tracking-[0.2em] text-[12px] text-white bg-primary transition-all duration-300 hover:bg-secondary hover:shadow-[0_15px_30px_rgba(18,59,93,0.3)] hover:-translate-y-1">
              <span className="relative z-10">Apply For A Seat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
