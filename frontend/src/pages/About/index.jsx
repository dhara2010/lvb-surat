import React from 'react';
import { motion } from 'framer-motion';
import Container from '../../components/layout/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ScrollReveal3D from '../../components/animations/ScrollReveal3D';
import { aboutHero, coreValues, founders, founderMessage } from '../../data/about';
import { Quote } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen pb-16 md:pb-24 overflow-x-hidden">
      
      <PageHeader
        label="ABOUT US"
        title={
          <>
           <span className="text-cyan-900">
              {aboutHero.title}
            </span>
             <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-400">
              {aboutHero.highlight}
            </span>
          </>
        }
        description={aboutHero.description}
      />

      <Container className="relative z-10 mb-16 md:mb-24 mt-10">
        <ScrollReveal3D delay={0.3}>
          <div className="relative w-full max-w-full aspect-[16/9] md:aspect-[21/9] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white">
             <img src="/about/KVS_3369-2048x1365.webp"
              alt="LVB Surat Community"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent mix-blend-overlay"></div>
          </div>
        </ScrollReveal3D>
      </Container>

      <Container className="mb-24 md:mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-secondary/30 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="grid md:grid-cols-3 gap-8">
          {coreValues.map((item, i) => (
            <ScrollReveal3D delay={i * 0.15} key={i}>
              <Card hover={true} className="h-full flex flex-col items-start border-t-4 border-t-secondary">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-black mb-8">
                  <item.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </Card>
            </ScrollReveal3D>
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
              <ScrollReveal3D delay={0.2 + (i * 0.2)} key={i}>
                <div className="group relative rounded-[30px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-gray-200">
                    <img src={founder.img}
                      alt={founder.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${founder.name}&backgroundColor=09475f&textColor=fff`; }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-white/90 pt-10">
                    <h4 className="text-2xl font-extrabold text-primary">{founder.name}</h4>
                    <p className="text-secondary font-bold text-sm tracking-widest uppercase mt-1">{founder.role}</p>
                  </div>
                </div>
              </ScrollReveal3D>
            ))}
          </div>

          <ScrollReveal3D delay={0.4} className="max-w-4xl mx-auto text-center">
            <div className="relative p-10 md:p-14 bg-gradient-to-br from-primary to-dark rounded-[40px] text-black shadow-2xl overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>

              <Quote className="w-16 h-16 text-secondary/30 absolute top-8 left-8 -scale-x-100" />
              <Quote className="w-16 h-16 text-secondary/30 absolute bottom-8 right-8" />

              <p className="relative z-10 text-lg md:text-xl/relaxed text-blue-50 italic font-light">
                {founderMessage}
              </p>

              <div className="mt-10 relative z-10">
                <Button variant="secondary" size="lg" className="mx-auto" onClick={() => window.location.href = '/members'}>
                  View all members
                </Button>
              </div>
            </div>
          </ScrollReveal3D>
        </Container>
      </div>

    </div>
  );
}
