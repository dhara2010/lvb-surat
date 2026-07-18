import React from'react';
import { ArrowRight, MapPin, Calendar, Mail, ChevronRight } from'lucide-react';
import { Link } from'react-router-dom';

const footerLinks = [
  { label:'Home', href:'/' },
  { label:'About Us', href:'/about' },
  { label:'Events', href:'/events' },
  { label:'Gallery', href:'/gallery' },
  { label:'Members', href:'/members' },
  { label:'Contact', href:'/contact' },
];

const contactDetails = [
  { icon: Calendar, text:'Every Wednesday · 7:30 AM – 9:30 AM' },
  { icon: MapPin, text:'Grand Ballroom, 5-Star Hotel, Surat' },
  { icon: Mail, text:'info@lvbsuratplatinum.com' },
];

import { ThemeButton } from'../ui/ThemeButton';

export default function Footer() {
  return (
    <div className="relative z-10 w-full mt-0">
      <footer className="w-full bg-white text-primary-text relative overflow-hidden border-t border-[#E5E7EB]">
        
        <div className="max-w-7xl px-6 py-10 md:px-10 md:py-16 relative z-10 mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 w-full">

            {/* Brand Column */}
            <div className="col-span-1 lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 lg:pr-10">
              <img loading="lazy" decoding="async" src="/LVB_Platinum.png"
                alt="LVB Surat Platinum"
                className="w-40 md:w-48 object-contain"
                onError={(e) => { e.currentTarget.style.display ='none'; }}
              />
              <p className="text-sm md:text-base leading-relaxed max-w-sm mt-1">
                Surat's invite-only elite networking chapter for top entrepreneurs, manufacturers, and trade leaders. Empowering business growth through powerful connections.
              </p>

             <Link to="/contact">
                <div className="inline-flex items-center justify-center rounded-[12px] font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] shadow-sm hover:shadow-md hover:scale-105 xl:py-3.5 xl:px-10 py-3 px-8">
                  Let's Connect
                </div>
              </Link>
            </div>

            {/* Quick Links Column */}
            <div className="col-span-1 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6">

              <h3 className="text-base md:text-lg font-bold text-primary-text tracking-widest uppercase">
                Quick Links
              </h3>

              <div className="flex flex-col items-center md:items-start gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="group flex items-center gap-2 text-sm md:text-base font-medium  hover:text-secondary transition-colors duration-300"
                  >
                    <ChevronRight
                      size={14}
                      className="hidden md:block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                    <span className="group-hover:text-primary transition-colors duration-300">{link.label}</span>
                  </Link>
                ))}
              </div>

            </div>

            {/* Contact Info Column */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 mt-4 md:mt-0">
              <h3 className="text-base md:text-lg font-bold text-primary-text tracking-widest uppercase">Meeting Details</h3>
              <div className="flex flex-col items-center md:items-start gap-4 md:gap-5 w-full">
                {contactDetails.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 group">
                      <div className="w-10 h-10 rounded-[12px] bg-gray-50 flex items-center justify-center  shrink-0 border border-[#E5E7EB] group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium leading-relaxed md:pt-2 group-hover:text-primary transition-colors duration-300 max-w-[250px] md:max-w-none">
                        {item.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          <div className="w-full h-px bg-[#E5E7EB] my-8 flex items-center justify-center"></div>

          {/* Copyright & Credit area */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left w-full">
            <p className="text-xs font-semibold  tracking-wider uppercase">
              © {new Date().getFullYear()} LVB SURAT PLATINUM. ALL RIGHTS RESERVED.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-1.5 text-xs font-semibold tracking-wider  uppercase">
              <span>DEVELOPED BY</span>
              <a href="#" className="hover:text-secondary transition-colors font-bold relative pb-0.5">
                KP GLOBAL BUSINESS
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

