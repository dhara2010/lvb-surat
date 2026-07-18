import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

import TextReveal from '../../../components/animations/TextReveal';
import TypingHeading from '../../../components/animations/TypingHeading';
import AnimatedLine from '../../../components/animations/AnimatedLine';
import MotionWrapper from '../../../components/animations/MotionWrapper';
import MagneticButton from '../../../components/animations/MagneticButton';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Flip);

export default function HeroSequence() {
  const containerRef = useRef(null);
  const heroSlotRef = useRef(null);
  const landingSlotRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      const mm = gsap.matchMedia();

      mm.add("(min-width: 0px)", () => {
        // Elements
        const video = videoRef.current;
        const heroSlot = heroSlotRef.current;
        const landingSlot = landingSlotRef.current;
        const textSection = textRef.current;

        if (!video || !heroSlot || !landingSlot || !textSection) return;

        // Reset any previous GSAP styles to calculate accurate bounds
        gsap.set(video, { clearProps: "all" });

        // Phase 1: Fit video perfectly to the Hero placeholder initially using Flip
        const heroState = Flip.fit(video, heroSlot, { getVars: true });
        
        // Phase 2: Calculate flight coordinates to the Landing Section placeholder
        const landingState = Flip.fit(video, landingSlot, { getVars: true });

        // Phase 3: The natural fullscreen CSS attributes (fullscreen expanding)
        const fullscreenState = {
          width: "100%",
          height: "100%",
          x: 0,
          y: 0,
          scale: 1,
          borderRadius: "0px",
          boxShadow: "0px 0px 0px rgba(0,0,0,0)",
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0
        };

        // Instantly force video structurally to start at the Hero slot visual metrics
        gsap.set(video, {
          ...heroState,
          borderRadius: "32px",
          transformOrigin: "center center"
        });

        // Create the Pinned Sequence Timeline with Scroll Scrubbing
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=180%", // Drastically reduced scroll distance (was 350%)
            scrub: 0.5,    // Reduced smoothing for snappier, more responsive physics
            pin: true,     // Locks layout in place during story
            anticipatePin: 1
          }
        });

        // 1. Text fades out & moves up
        tl.to(textSection, {
          opacity: 0,
          y: -100,
          filter: "blur(10px)",
          duration: 0.4, // Faster text fade
          ease: "power2.inOut"
        }, 0);

        // 2. Coordinate Flight to Second Section Landing Slot
        tl.to(video, {
          ...landingState,
          duration: 0.8, 
          ease: "power3.inOut"
        }, 0.1); // Starts earlier 

        // Overlay A: Liftoff banking, scaling up (closer to viewer), heavy shadow and blur
        tl.to(video, {
          rotateX: 25,
          rotateY: -15,
          rotateZ: -8,
          scale: 1.15, 
          duration: 0.4,
          ease: "power2.in"
        }, 0.1); 

        // Overlay B: Settle towards landing slot, shedding rotation and blur
        tl.to(video, {
          rotateX: 5,
          rotateY: -2,
          rotateZ: -1,
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out"
        }, 0.5);

        // 3. Expand fully into the Video Section
        tl.to(video, {
          ...fullscreenState,
          duration: 0.8, 
          ease: "back.out(1.2)" // Provides the cinematic 2-3% overshoot bounce
        }, 1.0); // Fires immediately after flight lands
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative bg-white">
      
      {/* 
        Unified Viewport: Fixed 100vh that pins. 
        Everything overlaps and animates within this viewport.
      */}
      <div className="w-full h-screen overflow-hidden relative">

        {/* ================================================== */}
        {/* SECTION 1: HERO */}
        {/* ================================================== */}
        <section className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center px-6 md:px-16 lg:px-24 z-10 pointer-events-auto">
          
          {/* HERO TEXT (Left) */}
          <div ref={textRef} className="w-full md:w-1/2 flex flex-col justify-center mt-20 md:mt-0">
            <MotionWrapper variant="fadeUp" delay={0.1}>
              <div className="flex flex-col items-start gap-4 mb-6 md:mb-8">
                <span className="inline-block font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm">
                  Premium Business Network
                </span>
                <AnimatedLine className="w-12 mx-0" color="var(--color-primary)" thickness={3} delay={0.4} />
              </div>
            </MotionWrapper>

            <TypingHeading 
              text="Transform Your Business with Elite Connections."
              el="h1"
              className="h-display max-w-4xl text-left mb-6 md:mb-8"
              delay={0.2}
            />
            
            <TextReveal 
              text="Join Surat's most exclusive referral chapter driving millions in real business annually."
              el="p"
              className="text-base md:text-xl max-w-xl text-left mb-8 md:mb-12 leading-relaxed"
              splitBy="word"
              delay={0.6}
            />

            <MotionWrapper variant="fadeUp" delay={1.2}>
              <div className="flex gap-4 md:gap-6 items-center justify-start flex-wrap">
                <MagneticButton className="px-8 md:px-10 py-3 md:py-4 text-sm md:text-base font-bold rounded-full text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all shadow-[0_10px_30px_rgba(0,47,108,0.2)]">
                  Apply Now
                </MagneticButton>
                <MagneticButton className="group px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold rounded-full border border-gray-300 hover:border-transparent hover:bg-white/50 text-[#090E14] backdrop-blur-sm transition-all duration-300 bg-transparent flex items-center justify-center relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">View Members <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                </MagneticButton>
              </div>
            </MotionWrapper>
          </div>

          {/* HERO VIDEO PLACEHOLDER (Right) */}
          <div className="w-full md:w-1/2 h-[35vh] md:h-[60vh] flex justify-end items-center mt-10 md:mt-0 p-4 md:p-8">
            {/* 
              This empty div reserves the exact visual space the video should start at.
              The video never actually lives here in the DOM. 
            */}
            <div ref={heroSlotRef} className="w-full h-full max-w-[500px] pointer-events-none opacity-0"></div>
          </div>

        </section>


        {/* ================================================== */}
        {/* SECTION 2: DEDICATED VIDEO SECTION OVERLAY */}
        {/* ================================================== */}
        <section className="absolute inset-0 w-full h-full pointer-events-none z-20 flex flex-col items-center justify-end pb-[10vh]">
          
          {/* LANDING SLOT PLACEHOLDER (Center Bottom) */}
          {/* Defines where the video touches down BEFORE it expands */}
          <div ref={landingSlotRef} className="w-[85vw] md:w-[60vw] h-[35vh] md:h-[50vh] opacity-0 pointer-events-none"></div>

          {/* THE ACTUAL VIDEO ELEMENT WITH ANIMATED BACKGROUND GLOW */}
          <div 
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full will-change-transform z-20"
          >
            {/* Embedded masked container ensuring the video stays rounded properly */}
            <div className="relative w-full h-full overflow-hidden rounded-[inherit] z-10" style={{ transform:'translateZ(0)' }}>
              <video 
                className="w-full h-full object-cover scale-[1.01]"
                src="/hero_video.mp4" 
                autoPlay loop muted playsInline 
              />
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
