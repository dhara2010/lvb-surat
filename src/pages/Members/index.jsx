import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageSquare, Diamond, Building2, Stethoscope, CalendarDays, Plane } from 'lucide-react';
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
    <div className="w-full flex flex-col font-sans overflow-hidden bg-gray-50">
      
      <PageHeader 
        label="MEMBERS DIRECTORY"
        title={<>Relationships That <span className="text-secondary">Grow Business</span></>}
        description="Meet the elite 50+ professionals forming the core of the Surat Platinum Chapter."
      />

      {/* ─── HERO SECTION ──────────────── */}
      <section className="relative mt-8 md:mt-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center">

          
          <motion.div {...inView(0.1)} className="w-full rounded-[30px] overflow-hidden shadow-2xl relative">
            {/* Dark gradient overlay for extreme premium cinematic look */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent z-10"></div>
            <img loading="lazy" decoding="async" src="/gallery/1-1.webp" 
              alt="Group Meet" 
              className="w-full h-[300px] md:h-[500px] object-cover"
              onError={(e) => { e.target.src = '/members/KVS_3369-2048x1365.webp'; }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BANNER ──────────────── */}
      <section className="relative -mt-16 md:-mt-24 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div 
            {...inView(0.2)} 
            className="bg-primary rounded-2xl md:rounded-full p-8 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between text-white border border-white/10 backdrop-blur-xl"
            style={{ backgroundImage: 'linear-gradient(135deg, rgba(20,184,166,0.1), transparent)' }}
          >
            <div className="flex-1 text-center md:text-left md:pl-10 mb-6 md:mb-0 border-b md:border-b-0 border-white/10 pb-6 md:pb-0">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">LVB Surat Platinum</h2>
              <p className="text-secondary uppercase tracking-widest text-xs font-black mt-1">Chapter</p>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-around w-full border-l border-white/10 md:pl-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="flex flex-col items-center py-4 md:py-0 px-6 w-full group">
                <Users className="text-secondary mb-2 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-2xl font-black">50+</span>
                <span className="text-xs text-blue-200 tracking-wider">Professionals</span>
              </div>
              <div className="flex flex-col items-center py-4 md:py-0 px-6 w-full group">
                <TrendingUp className="text-secondary mb-2 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-2xl font-black">₹500 Cr+</span>
                <span className="text-xs text-blue-200 tracking-wider">Business Done</span>
              </div>
              <div className="flex flex-col items-center py-4 md:py-0 px-6 w-full group">
                <MessageSquare className="text-secondary mb-2 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-2xl font-black">12+</span>
                <span className="text-xs text-blue-200 tracking-wider">Testimonials</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── GRID SECTION ──────────────── */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <motion.div {...inView(0)} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-4 tracking-tight">
            Meet our Platinum Members
          </h2>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[300px]">
          {loading && <div className="col-span-full py-20 flex flex-col items-center justify-center text-primary/50 font-bold tracking-widest">LOADING MEMBERS...</div>}
          {error && <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-500 font-bold tracking-widest">FAILED TO LOAD MEMBERS</div>}
          {!loading && !error && platinumMembers.length === 0 && <div className="col-span-full py-20 flex flex-col items-center justify-center text-primary/50 font-bold tracking-widest">NO MEMBERS AVAILABLE</div>}

          {platinumMembers.map((m, i) => (
            <motion.div
              key={m.id || i}
              {...inView((i % 9) * 0.05)}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-secondary shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <img loading="lazy" decoding="async" src={m.photoUrl} 
                  alt={m.name} 
                  className="w-[120px] h-[120px] rounded-2xl object-cover shadow-sm bg-gray-100 group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${m.name}&backgroundColor=0B1F3A&textColor=fff`; }}
                />
                <div className="w-[120px] h-[120px] rounded-xl border border-gray-100 p-2 flex items-center justify-center bg-white shadow-sm overflow-hidden">
                  <img loading="lazy" decoding="async" src={m.logoUrl} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col mt-auto pb-2 border-b border-gray-100 group-hover:border-secondary/30 transition-colors">
                <h3 className="text-xl font-black text-primary truncate">{m.name}</h3>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-secondary"></span>
                  <span className="uppercase text-xs font-black tracking-widest text-secondary truncate">{m.businessName}</span>
                </div>
              </div>
              
              <div className="pt-3">
                <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
                  {m.businessCategory}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── VACANT CATEGORIES ──────────────── */}
      <section className="bg-primary py-20 mt-10 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 flex flex-col items-center">
          <motion.div {...inView(0)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Top Vacant Categories
            </h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
            <p className="text-blue-200 mt-6 max-w-lg mx-auto text-sm leading-relaxed">
              We exclusively allow one profession per category. Lock out your competition by filling one of our vacant seats today.
            </p>
          </motion.div>

          {/* Connectors style UI mirroring screenshot */}
          <div className="w-full flex flex-wrap justify-center gap-4 md:gap-0 md:justify-between items-stretch max-w-4xl relative">
            {vacantCategories.map((v, i) => (
              <motion.div 
                key={i}
                {...inView(i * 0.1)}
                className="flex flex-col items-center w-[45%] md:w-auto relative group md:px-6 py-4"
              >
                {/* Vertical Divider Line from SS (visible on desktop) */}
                {i !== vacantCategories.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-white/10"></div>
                )}
                
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-lg backdrop-blur-md group-hover:scale-110 group-hover:-translate-y-2">
                  <v.icon size={26} strokeWidth={2}/>
                </div>
                <h4 className="text-white font-semibold text-center text-sm md:text-base leading-tight max-w-[120px]">
                  {v.title}
                </h4>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...inView(0.4)} className="mt-16">
            <Link to="/contact" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-3.5 font-semibold text-primary bg-white shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(20,184,166,0.5)]">
              <span className="relative z-10">Apply For A Seat</span>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
