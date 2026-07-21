import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import ScrollReveal3D from '../../../components/animations/ScrollReveal3D';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import TextReveal from '../../../components/animations/TextReveal';
import TypingHeading from '../../../components/animations/TypingHeading';
import AnimatedLine from '../../../components/animations/AnimatedLine';
import MotionWrapper from '../../../components/animations/MotionWrapper';
import MagneticButton from '../../../components/animations/MagneticButton';
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function HeroSequence() {
  const containerRef = useRef(null);
  const heroSlotRef = useRef(null);
  const landingSlotRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);

  // Mouse Parallax for ambient glow
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    x.set((e.clientX / innerWidth - 0.5) * 50);
    y.set((e.clientY / innerHeight - 0.5) * 50);
  };

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
          borderRadius: "24px",
          transformOrigin: "center center"
        });

        // Create the Pinned Sequence Timeline with Scroll Scrubbing
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%", // Snappy, clean transition
            scrub: 0.8,    // Buttery smooth physics interpolated
            pin: true,     // Locks layout in place during story
            anticipatePin: 1
          }
        });

        // 1. Text fades out & moves up with blur
        tl.to(textSection, {
          opacity: 0,
          y: -150,
          filter: "blur(15px)",
          duration: 0.5,
          ease: "power2.inOut"
        }, 0);

        // 2. Coordinate Flight to Second Section Landing Slot
        tl.to(video, {
          ...landingState,
          duration: 0.8,
          ease: "power3.inOut"
        }, 0.1);

        // Overlay A: Liftoff banking, scaling up (closer to viewer), heavy shadow and depth
        tl.to(video, {
          rotateX: 20,
          rotateY: -12,
          rotateZ: -5,
          scale: 1.12,
          boxShadow: "0 40px 80px rgba(0, 47, 108, 0.4)",
          duration: 0.4,
          ease: "power2.in"
        }, 0.1);

        // Overlay B: Settle towards landing slot, shedding rotation 
        tl.to(video, {
          rotateX: 4,
          rotateY: -2,
          rotateZ: -1,
          scale: 1.05,
          boxShadow: "0 15px 40px rgba(0, 47, 108, 0.2)",
          duration: 0.4,
          ease: "power2.out"
        }, 0.5);

        // 3. Expand fully into the Video Section
        tl.to(video, {
          ...fullscreenState,
          duration: 0.8,
          ease: "power4.inOut"
        }, 1.0);
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative bg-[#F8FAFC]" onMouseMove={handleMouseMove}>

      {/* Ambient Animated Glows (Parallaxed) */}
      <motion.div style={{ x: mouseX, y: mouseY }} className="absolute z-0 inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[15%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,transparent_70%)] rounded-full blur-[60px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(4,71,101,0.08)_0%,transparent_70%)] rounded-full blur-[80px]" />
      </motion.div>

      {/* Subtle Grid Pattern overlay for premium depth */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.3] bg-[linear-gradient(rgba(4,71,101,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(4,71,101,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]"></div>

      {/* Unified Viewport: Fixed 100dvh that pins */}
      <div className="w-full h-[100dvh] overflow-hidden relative z-10">

        {/* ================================================== */}
        {/* SECTION 1: HERO */}
        {/* ================================================== */}
        <section className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center px-6 sm:px-12 md:px-16 lg:px-24 pt-20 lg:pt-0 z-10 pointer-events-auto max-w-[1920px] mx-auto">

          {/* HERO TEXT (Left) */}
          <div ref={textRef} className="w-full lg:w-[60%] flex flex-col justify-center mt-10 md:mt-16 lg:mt-0 z-20">
            <ScrollReveal3D delay={0.1}>
              <span className="inline-flex items-center gap-4 font-bold tracking-[0.25em] uppercase  text-sm">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-[2px] bg-secondary"
                ></motion.div>
                Premium Business Network
              </span>
            </ScrollReveal3D>


            <TypingHeading
              text="Transform Your Business with Elite Connections."
              el="h1"
              className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-black text-[#1E293B] tracking-[-0.03em] leading-[1.05] mb-6 md:mb-8 font-sans drop-shadow-sm max-w-4xl"
              delay={0.2}
            />

            <TextReveal
              text="Join Surat's most exclusive referral chapter driving millions in real business annually."
              el="p"
              className="text-lg sm:text-xl lg:text-[22px] text-[#64748B] font-medium max-w-2xl text-left mb-10 md:mb-12 leading-[1.6]"
              splitBy="word"
              delay={0.6}
            />

            <MotionWrapper variant="fadeUp" delay={1.2}>
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-start flex-wrap">
                <MagneticButton className="relative group overflow-hidden inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-[#044765] to-[#0a5e85] px-8 py-4 sm:px-10 sm:py-[18px] text-sm sm:text-base font-bold text-white shadow-[0_4px_15px_rgba(4,71,101,0.2)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(4,71,101,0.3)] hover:scale-[1.02]">
                  <span className="absolute inset-0 w-full h-full bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_100%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></span>
                  <Link to='/about' className="relative z-10 flex items-center gap-2">
                    About us
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>

                <MagneticButton className="relative group inline-flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md px-8 py-4 sm:px-10 sm:py-[18px] text-sm sm:text-base font-bold text-[#044765] border border-[rgba(4,71,101,0.12)] shadow-sm transition-all duration-300 hover:bg-white hover:border-[#0EA5E9]/50 hover:shadow-[0_4px_25px_rgba(14,165,233,0.15)]">
                  <Link to='/members' className="relative z-10 flex items-center gap-2">
                    Explore Members
                  </Link>
                </MagneticButton>
              </div>
            </MotionWrapper>
          </div>

          {/* HERO VIDEO PLACEHOLDER (Right) */}
          <div className="w-full lg:w-[40%] h-[35vh] sm:h-[40vh] lg:h-[70vh] flex justify-center lg:justify-end items-center mt-12 lg:mt-0 p-2 sm:p-6 lg:p-8 z-10">
            {/* 
              This empty div reserves the exact visual space the video should start at.
              The video never actually lives here in the DOM. 
            */}
            <div ref={heroSlotRef} className="w-full h-full max-w-[550px] pointer-events-none opacity-0"></div>
          </div>

          {/* Scoll Indicator (Absolute Bottom Left) */}
          <MotionWrapper variant="fadeUp" delay={1.8} className="absolute bottom-8 left-6 md:left-16 lg:left-24 z-20 hidden md:flex flex-col items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#044765] rotate-[-90deg] origin-left translate-y-10 opacity-70">Scroll</span>
            <div className="w-[2px] h-16 bg-[rgba(4,71,101,0.1)] overflow-hidden relative rounded-full">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-[#0EA5E9] rounded-full animate-[scrollLine_2s_ease-in-out_infinite]" style={{ animationFillMode: 'both' }}></div>
            </div>
          </MotionWrapper>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes scrollLine {
              0% { transform: translateY(-100%); }
              50% { transform: translateY(100%); }
              100% { transform: translateY(200%); }
            }
          `}} />

        </section>


        {/* ================================================== */}
        {/* SECTION 2: DEDICATED VIDEO SECTION OVERLAY */}
        {/* ================================================== */}
        <section className="absolute inset-0 w-full h-full pointer-events-none z-20 flex flex-col items-center justify-end pb-[10vh]">

          {/* LANDING SLOT PLACEHOLDER (Center Bottom) */}
          {/* Defines where the video touches down BEFORE it expands */}
          <div ref={landingSlotRef} className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[35vh] md:h-[45vh] lg:h-[55vh] opacity-0 pointer-events-none"></div>

          {/* THE ACTUAL VIDEO ELEMENT WITH ANIMATED BACKGROUND GLOW */}
          <div
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full will-change-transform z-20"
          >
            {/* Embedded masked container ensuring the video stays rounded properly */}
            <div className="relative w-full h-full overflow-hidden rounded-[inherit] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]" style={{ transform: 'translateZ(0)' }}>

              {/* Optional Glass reflection effect on the video border to give it a physical feel during flip */}
              <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none z-20 mix-blend-overlay"></div>

              <video
                className="w-full h-full object-cover scale-[1.01]"
                src="/hero_video.mp4"
                autoPlay loop muted playsInline
                style={{ objectPosition: 'center center' }}
              />
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
