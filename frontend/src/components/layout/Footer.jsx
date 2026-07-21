import React,{useState} from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Members', href: '/members' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  {
    icon: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    href: 'https://www.linkedin.com/in/lvb-surat-platinum-9b7367419/'
  },
  {
    icon: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    href: 'https://instagram.com'
  },
  {
    icon: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
    href: '#'
  },
];

export default function Footer() {
  const location = useLocation();
 const [logoError, setLogoError] = useState(false);
  return (
    <footer className="relative z-10 w-full overflow-hidden bg-[#F8FAFC] text-[#1E293B] border-t border-[rgba(4,71,101,.06)]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08)_0%,transparent_70%)] opacity-80"></div>

        {/* Floating circles */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-20 w-64 h-64 bg-[#044765]/[0.03] rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -right-20 w-72 h-72 bg-[#0EA5E9]/[0.04] rounded-full blur-[80px]"
        />
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="max-w-7xl px-6 py-12 md:px-10 lg:py-20 relative z-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 w-full">

          {/* LEFT: BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start text-center md:text-left gap-6"
          >
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group cursor-pointer"
              aria-label="LVB Surat Platinum — Homepage"
            >
              {logoError ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-extrabold tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    LVB
                  </div>
                  <div className="flex flex-col leading-none">
                    <span
                      className="font-bold tracking-wider text-xs md:text-sm"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      LVB SURAT
                    </span>
                    <span
                      className="text-[8px] md:text-[9px] tracking-[0.1em] md:tracking-[0.18em] uppercase mt-0.5"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Platinum Chapter
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src="/LVB_Platinum.svg"
                  alt="LVB Surat Platinum"
                  className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  onError={() => setLogoError(true)}
                />
              )}
            </Link>
                        <p className="text-sm md:text-base leading-relaxed text-[#64748B] max-w-sm">
              Surat's invite-only elite networking chapter for top entrepreneurs, manufacturers, and trade leaders.
            </p>

            <div className="flex flex-col items-center md:items-start gap-2.5 mt-2">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#044765] bg-[#044765]/5 px-3.5 py-1.5 rounded-full border border-[rgba(4,71,101,.12)] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse"></span>
                Trusted Business Network
              </span>
              <span className="text-sm font-bold text-[#1E293B]">100+ Premium Members</span>
              <span className="text-sm font-medium text-[#64748B]">Established 2024</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-white border border-[rgba(4,71,101,.12)] shadow-[0_4px_10px_rgb(0,0,0,0.03)] flex items-center justify-center text-[#64748B] hover:text-[#044765] hover:border-[#0EA5E9]/30 transition-colors"
                  >
                    <Icon width={18} height={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* CENTER: NAVIGATION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h3 className="text-sm font-black text-[#044765] tracking-[0.2em] uppercase mb-8">Navigation</h3>
            <div className="flex flex-col gap-2 w-full max-w-[220px]">
              {footerLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={i}
                    to={link.href}
                    className={`group relative flex items-center justify-between w-full py-2.5 border-b transition-colors ${isActive ? 'border-[rgba(4,71,101,.2)] text-[#044765]' : 'border-[rgba(4,71,101,.06)] text-[#64748B] hover:border-[rgba(4,71,101,.2)] overflow-hidden'}`}
                  >
                    {/* Hover indicator line */}
                    <span className="absolute bg-[#0EA5E9] w-0 h-0.5 bottom-[-1px] left-0 transition-all duration-300 group-hover:w-full"></span>

                    <span className={`text-sm font-bold transition-all duration-300 group-hover:text-[#044765] group-hover:translate-x-2 ${isActive ? 'translate-x-2 text-[#044765]' : ''}`}>
                      {link.label}
                    </span>

                    {/* Active/Hover Arrow */}
                    <ArrowRight size={14} className={`transition-all duration-300 ${isActive ? 'text-[#0EA5E9] translate-x-0 opacity-100' : 'text-[#044765] -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: CTA CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-center w-full"
          >
            <div className="relative overflow-hidden w-full rounded-[2rem] bg-white/60 backdrop-blur-xl border border-[rgba(4,71,101,.10)] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 md:p-10 group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_12px_40px_rgb(4,71,101,0.08)]">
              {/* Card Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,transparent_70%)] rounded-full blur-[20px] transition-all duration-500 group-hover:scale-150 group-hover:bg-[radial-gradient(circle,rgba(14,165,233,0.2)_0%,transparent_70%)] pointer-events-none"></div>

              <h4 className="text-xl md:text-2xl font-black text-[#044765] tracking-tight mb-3 relative z-10">Join LVB Surat</h4>
              <p className="text-sm font-medium text-[#64748B] leading-relaxed mb-8 relative z-10">
                Build valuable business relationships with Surat's leading entrepreneurs and professionals.
              </p>

              <Link to="/contact" className="relative group/btn inline-flex items-center justify-center w-full overflow-hidden rounded-full bg-gradient-to-r from-[#044765] to-[#0a5e85] px-6 py-4 md:py-4 text-sm md:text-base font-bold text-white shadow-[0_4px_15px_rgba(4,71,101,0.2)] transition-all hover:shadow-[0_6px_25px_rgba(4,71,101,0.35)] hover:scale-[1.02]">
                {/* Sine Shine Animation */}
                <span className="absolute inset-0 z-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_100%] translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-out"></span>
                <span className="relative z-10 flex items-center gap-2">
                  Become a Member
                  <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </span>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full mt-16 md:mt-24 pt-8 border-t border-[rgba(4,71,101,.10)] flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Left */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[11px] md:text-xs font-black text-[#1E293B] tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} LVB Surat Platinum
            </p>
            <p className="text-[11px] md:text-xs font-bold text-[#64748B]">Made with ❤️ in Surat</p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-[#64748B] tracking-[0.15em] uppercase">
            <span>Developed by</span>
            <a href="#" className="font-black text-[#044765] hover:text-[#0EA5E9] transition-colors relative group">
              KP Global Business
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#0EA5E9] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
