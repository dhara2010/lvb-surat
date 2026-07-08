import React from 'react';
import { motion } from 'framer-motion';
import Container from '../../components/layout/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SlideUp, FadeIn } from '../../components/animations/SlideUp';
import { aboutHero, coreValues, founders, founderMessage } from '../../data/about';
import { Quote } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 overflow-hidden">
      
      <Container className="relative z-10 mb-24 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl">
            <SlideUp>
               <span className="inline-block text-[#14B8A6] font-bold tracking-[0.2em] uppercase text-xs mb-6 bg-teal-50 px-3 py-1 rounded-full">
                 About Us
               </span>
            </SlideUp>
            <SlideUp delay={0.1}>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B1F3A] leading-[1.1] mb-6">
                 {aboutHero.title} <br className="hidden md:block"/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-teal-400">
                   {aboutHero.highlight}
                 </span>
               </h1>
            </SlideUp>
            <SlideUp delay={0.2}>
               <p className="text-gray-500 text-lg md:text-xl leading-relaxed text-justify mb-8">
                 {aboutHero.description}
               </p>
            </SlideUp>
          </div>
          
          <FadeIn delay={0.3}>
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[40px] overflow-hidden shadow-2xl border border-white">
               <img 
                 src="/about/KVS_3369-2048x1365.jpg" 
                 alt="LVB Surat Community" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'; }} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/40 to-transparent mix-blend-overlay"></div>
            </div>
          </FadeIn>
        </div>
      </Container>

      <Container className="mb-24 md:mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-teal-100/30 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {coreValues.map((item, i) => (
            <SlideUp delay={i * 0.15} key={i}>
              <Card hover={true} className="h-full flex flex-col items-start border-t-4 border-t-[#14B8A6]">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-[#14B8A6] mb-8">
                  <item.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </Card>
            </SlideUp>
          ))}
        </div>
      </Container>

      <div className="bg-white py-24 border-y border-gray-100">
        <Container>
          <SectionHeading 
            label="Leadership" 
            title="Meet Our Founders" 
            subtitle="Empowering Entrepreneurs for Collective Progress: A Visionary Perspective" 
          />

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto mb-20">
            {founders.map((founder, i) => (
              <SlideUp delay={0.2 + (i * 0.2)} key={i}>
                <div className="group relative rounded-[30px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-gray-200">
                     <img 
                       src={founder.img} 
                       alt={founder.name}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                       onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${founder.name}&backgroundColor=0B1F3A&textColor=fff`; }}
                     />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-white/90 pt-10">
                    <h4 className="text-2xl font-extrabold text-[#0B1F3A]">{founder.name}</h4>
                    <p className="text-[#14B8A6] font-bold text-sm tracking-widest uppercase mt-1">{founder.role}</p>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>

          <SlideUp delay={0.4} className="max-w-4xl mx-auto text-center">
            <div className="relative p-10 md:p-14 bg-gradient-to-br from-[#0B1F3A] to-[#0A1729] rounded-[40px] text-white shadow-2xl overflow-hidden">
               {/* Pattern overlay */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
               
               <Quote className="w-16 h-16 text-teal-400/30 absolute top-8 left-8 -scale-x-100" />
               <Quote className="w-16 h-16 text-teal-400/30 absolute bottom-8 right-8" />
               
               <p className="relative z-10 text-lg md:text-xl/relaxed text-blue-50 italic font-light">
                 {founderMessage}
               </p>
               
               <div className="mt-10 relative z-10">
                 <Button variant="secondary" size="lg" className="mx-auto" onClick={() => window.location.href='/members'}>
                    View all members
                 </Button>
               </div>
            </div>
          </SlideUp>
        </Container>
      </div>

    </div>
  );
}
