import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Members', href: '/members' },
  { label: 'Contact', href: '/contact' },
];

const contactInfo = [
  'Every Wednesday · 7:30 AM – 9:30 AM IST',
  'Grand Ballroom, 5-Star Hotel, Surat',
  'info@lvbsuratplatinum.com',
];

export default function Footer() {
  return (
    <div className="relative z-10 w-full pt-10">
      <footer
        role="contentinfo"
        className="w-full rounded-t-[40px] overflow-hidden shadow-2xl relative"
        style={{ borderTop: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'rgba(216, 222, 230, 0.75)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-6 py-10 md:px-12 md:py-12 lg:px-20 lg:py-16 relative overflow-hidden">
          {/* Subtle Background Glows inside the frozen glass */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/40 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-start relative z-10">
            {/* Left large brand area */}
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl lg:text-[3.5rem] font-black text-[#0B1F3A] leading-[1.1] tracking-tight">
                Empowering <br />
                Business <span className="text-[#14B8A6]">Growth.</span>
              </h2>
              <p className="max-w-md text-[#0B1F3A]/70 text-lg font-medium leading-relaxed">
                Surat's invite-only elite networking chapter for top
                entrepreneurs, manufacturers, and trade leaders.
              </p>

              <Link to="/contact" className="mt-3 group w-auto md:w-50 relative inline-flex items-center gap-3 overflow-hidden rounded-full px-4 py-2 font-semibold text-white bg-white/50 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-transparent">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#14b8a6] via-[#0B1F3A] to-[#14b8a6] transition-transform duration-700 group-hover:translate-x-0"></span>
                <span className="relative z-10">Let's connect</span>
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0B1F3A]">
                  <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </span>
              </Link>
            </div>

            {/* Right Side Links & details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pl-12 w-full pt-2">
              <div className="flex flex-col gap-4">
                <p className="font-extrabold text-[#0B1F3A] uppercase tracking-[0.2em] text-xs">Quick Links</p>
                <div className="flex flex-col gap-3">
                  {footerLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group text-base font-semibold text-[#0B1F3A]/70 transition-all duration-300 hover:text-[#14B8A6] hover:translate-x-2 w-max flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] scale-0 group-hover:scale-100 transition-transform"></span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="font-extrabold text-[#0B1F3A] uppercase tracking-[0.2em] text-xs">Contact</p>
                <div className="flex flex-col gap-4">
                  {contactInfo.map((item, i) => (
                    <p key={i} className="text-sm font-semibold text-[#0B1F3A]/80 leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
                <img
                  src="/LVB_Platinum.png"
                  alt="LVB Surat Platinum"
                  className="h-12 w-auto mt-6"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>

          {/* Footer Copyright and Developer Credit */}
          <div className="mt-12 pt-6 border-t border-[#0B1F3A]/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <p className="text-sm font-bold text-[#0B1F3A]/60">
              © {new Date().getFullYear()} LVB Surat Platinum. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="text-[#0B1F3A]/60">Developed by</span>
              <a href="#" className="text-[#14B8A6] hover:text-[#0B1F3A] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#14B8A6] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right hover:after:origin-left">
                KP Global Bussiness
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
