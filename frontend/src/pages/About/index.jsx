import React from 'react';
import Container from '../../components/layout/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { Link } from "react-router-dom";
import ScrollReveal3D from '../../components/animations/ScrollReveal3D';
import { aboutHero, coreValues, founders, founderMessage } from '../../data/about';
import { Quote } from 'lucide-react';
import VerticalRiverStraps from '../../components/effects/VerticalRiverStraps';
import FoldingImage from '../../components/effects/FoldingImage';
import TiltCard from '../../components/animations/TiltCard';

import TypingHeading from '../../components/animations/TypingHeading';


export default function About() {
  return (
    <div className="bg-transparent relative min-h-screen pb-16 md:pb-24 overflow-x-hidden">
      <VerticalRiverStraps className="absolute inset-y-0 w-full h-[150%] opacity-20 pointer-events-none" />

      <PageHeader
        label="ABOUT US"
        title={
          <>
            <TypingHeading el="span" className="text-section font-bold">
              {aboutHero.title}
            </TypingHeading>
          </>
        }
        description={
          <>
            <span className="text-2xl text-secondary font-semibold">
              {aboutHero.highlight}
            </span>
            <br />
            {aboutHero.description}
          </>
        }
      />
      <div className="relative z-10 w-full mb-16 md:mb-24 mt-10">
        <ScrollReveal3D delay={0.3}>
          <TiltCard tiltMax={8} scaleMax={1.03}>
            <div className="relative w-full max-w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden transition-all duration-500">
              <FoldingImage
                src="/about/KVS_3369-2048x1365.webp"
                alt="LVB Surat Community"
                className="w-full h-full object-cover rounded-xl overflow-hidden"
              />
            </div>
          </TiltCard>
        </ScrollReveal3D>
      </div>

      <Container className="mb-24 md:mb-32 relative">

        <div className="grid md:grid-cols-3 gap-8">
          {coreValues.map((item, i) => (
            <ScrollReveal3D delay={i * 0.15} key={i}>
              <Card hover={true} className="h-full flex flex-col items-start border-t-4 border-t-secondary">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center  mb-8">
                  <item.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold  mb-4">
                  {item.title}
                </h3>
                <p className="leading-relaxed font-medium">
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
              <ScrollReveal3D delay={0.2 + (i * 0.2)} key={i} className="h-full">
                <div className="group relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  {founder?.img && (
                    <div className="aspect-[4/5] w-full overflow-hidden bg-gray-200 relative">
                      <FoldingImage
                        src={founder.img}
                        alt={founder.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-16 z-20">
                        <h4 className="text-2xl font-extrabold text-white drop-shadow-md">{founder.name}</h4>
                        <p className="font-bold text-sm tracking-widest uppercase mt-1 text-white drop-shadow-sm">{founder.role}</p>
                      </div>
                    </div>
                  )}
                  
                  {!founder?.img && (
                    <div className="p-10 flex-1 flex flex-col items-center justify-center text-center">
                      <h4 className="text-2xl font-extrabold text-gray-900 drop-shadow-sm">{founder.name}</h4>
                      <p className="font-bold text-sm tracking-widest uppercase mt-2 text-primary drop-shadow-sm">{founder.role}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal3D>
            ))}
          </div>

          <ScrollReveal3D delay={0.4} className="max-w-4xl mx-auto text-center">
            <div className="relative p-10 md:p-14 bg-white shadow-2xl rounded-2xl shadow-2xl overflow-hidden">
              <Quote className="w-16 h-16  absolute top-8 left-8 -scale-x-100" />
              <Quote className="w-16 h-16  absolute bottom-8 right-8" />
              <p className="relative p-10 z-10 text-lg md:text-xl/relaxed  italic font-light">
                {founderMessage}
              </p>
              <div className="mt-10 relative z-10">
                <Link to="/members">
                  <div className="inline-flex items-center justify-center rounded-md font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] shadow-sm hover:shadow-md hover:scale-105 xl:py-3.5 xl:px-10 py-3 px-8">
                    View All Members
                  </div>
                </Link>
              </div>
            </div>
          </ScrollReveal3D>
        </Container>
      </div>
    </div>
  );
}
