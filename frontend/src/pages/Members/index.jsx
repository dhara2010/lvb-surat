import React, { useEffect } from "react";
import { usePrimaryTextClass } from "../../hooks/useTheme";
import { motion } from "framer-motion";
import { Users, TrendingUp, MessageSquare, Diamond, Building2, Stethoscope, CalendarDays, Plane, ArrowRight, Phone, Mail, MapPin, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { getMembers } from "../../api/membersApi";
import PageHeader from "../../components/ui/PageHeader";
import TypingHeading from '../../components/animations/TypingHeading';
import { resolveImageUrl } from "../../utils/imageUrl";
import FoldingImage from '../../components/effects/FoldingImage';
import TiltCard from '../../components/animations/TiltCard';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, },
  viewport: { once: true, amount: 0.1, },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1], },
});

const vacantCategories = [
  {
    icon: Diamond,
    title: "Diamond Merchant",
  },
  {
    icon: Building2,
    title: "Real Estate Builder",
  },
  {
    icon: Stethoscope,
    title: "General Physician",
  },
  {
    icon: CalendarDays,
    title: "Event Management",
  },
  {
    icon: Plane,
    title: "Travel Agency",
  },
];

export default function MembersDirectory() {
  const primaryTextClass = usePrimaryTextClass();
  const { data: membersData, loading, error } = useFetch(getMembers);
  const platinumMembers = membersData || [];

  useEffect(() => {
    console.log("Member API response", membersData);
  }, [membersData]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans overflow-x-hidden pb-0">
      <PageHeader
        label="MEMBERS DIRECTORY"
        title={
          <TypingHeading el="span" className="text-section font-bold">
            Relationships That Grow Business
          </TypingHeading>
        }
        description="Meet the elite 50+ professionals forming the core of the Surat Platinum Chapter."
      />

      <section className="relative mt-8 md:mt-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <motion.div
            {...inView(0.1)}
            className="w-full"
          >
            <TiltCard tiltMax={8} scaleMax={1.03}>
              <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 transition-all duration-500">
                <FoldingImage
                  src="/gallery/1-1.webp"
                  alt="LVB Surat Platinum Group Meet"
                  className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover rounded-xl overflow-hidden"
                />
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          STATS BANNER
      ====================================================== */}

      <section className="relative -mt-10 md:-mt-20 z-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...inView(0.2)}
            className="
              bg-white
              rounded-3xl
              p-8
              md:p-6

              shadow-xl

              flex
              flex-col
              md:flex-row

              items-center
              justify-between

              border
              border-gray-100

              backdrop-blur-xl
            "
          >
            {/* Chapter Name */}

            <div
              className="
                flex-1
                text-center
                md:text-left
                md:pl-10

                mb-8
                md:mb-0

                border-b
                md:border-b-0
                border-gray-100

                pb-8
                md:pb-0
              "
            >
              <h2
                className={`
                  text-2xl
                  md:text-3xl
                  font-black
                  ${primaryTextClass}
                  tracking-tight
                `}
              >
                LVB Surat Platinum
              </h2>

              <p
                className="
                  uppercase
                  tracking-[0.25em]
                  text-[11px]
                  font-black
                  mt-2
                "
              >
                Chapter Network
              </p>
            </div>

            {/* Stats */}

            <div
              className="
                flex-1
                flex
                flex-col
                md:flex-row

                items-center
                justify-around

                w-full

                md:border-l
                border-gray-100

                md:pl-6

                divide-y
                md:divide-y-0
                md:divide-x
                divide-gray-100
              "
            >
              {/* Professionals */}

              <div
                className="
                  flex
                  flex-col
                  items-center

                  py-5
                  md:py-0

                  px-6

                  w-full

                  group
                "
              >
                <Users
                  className="
                    mb-3
                    group-hover:-translate-y-1
                    transition-transform
                  "
                  strokeWidth={1.5}
                  size={28}
                />

                <span
                  className={`
                    text-3xl
                    font-black
                    ${primaryTextClass}
                    mb-1
                  `}
                >
                  50+
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-widest
                  "
                >
                  Professionals
                </span>
              </div>

              {/* Business Done */}

              <div
                className="
                  flex
                  flex-col
                  items-center

                  py-5
                  md:py-0

                  px-6

                  w-full

                  group
                "
              >
                <TrendingUp
                  className="
                    mb-3
                    group-hover:-translate-y-1
                    transition-transform
                  "
                  strokeWidth={1.5}
                  size={28}
                />

                <span
                  className={`
                    text-3xl
                    font-black
                    ${primaryTextClass}
                    mb-1
                  `}
                >
                  ₹500 Cr+
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-widest
                  "
                >
                  Business Done
                </span>
              </div>

              {/* Testimonials */}

              <div
                className="
                  flex
                  flex-col
                  items-center

                  py-5
                  md:py-0

                  px-6

                  w-full

                  group
                "
              >
                <MessageSquare
                  className="
                    mb-3
                    group-hover:-translate-y-1
                    transition-transform
                  "
                  strokeWidth={1.5}
                  size={28}
                />

                <span
                  className={`
                    text-3xl
                    font-black
                    ${primaryTextClass}
                    mb-1
                  `}
                >
                  12+
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-widest
                  "
                >
                  Testimonials
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          MEMBERS GRID SECTION
      ====================================================== */}

      <section
        className="
          py-20
          md:py-24

          px-5
          md:px-8
          xl:px-12

          max-w-[1600px]
          mx-auto

          w-full
        "
      >
        {/* Heading */}

        <motion.div {...inView(0)} className="text-center mb-14 md:mb-20">
          <span
            className="
              inline-block
              font-extrabold
              tracking-[0.3em]
              uppercase
              text-xs
              mb-4
            "
          >
            Elite Network
          </span>

          <h2
            className={`
              text-4xl
              md:text-5xl

              font-black

              ${primaryTextClass}

              mb-6

              tracking-tight

              leading-[1.1]
            `}
          >
            Meet our{" "}
            <span
              className="
                bg-clip-text
                text-transparent
                bg-gradient-to-r
                from-secondary
                to-[#4FA3D1]
              "
            >
              Platinum Members
            </span>
          </h2>

          <div
            className="
              w-16
              h-1.5
              bg-secondary
              mx-auto
              rounded-full
            "
          />
        </motion.div>

        {/* Members Grid */}

        <div
          className="
            grid
            grid-cols-1
            2xl:grid-cols-2

            gap-10
            md:gap-14
            xl:gap-16

            min-h-[300px]
          "
        >
          {/* Loading */}

          {loading && (
            <div
              className="
                col-span-full
                py-20

                flex
                items-center
                justify-center

                font-bold
                tracking-[0.2em]
              "
            >
              LOADING MEMBERS...
            </div>
          )}

          {/* Error */}

          {error && (
            <div
              className="
                col-span-full
                py-20

                flex
                items-center
                justify-center

                font-bold
                tracking-[0.2em]
              "
            >
              FAILED TO LOAD MEMBERS
            </div>
          )}

          {/* Empty */}

          {!loading && !error && platinumMembers.length === 0 && (
            <div
              className="
                  col-span-full
                  py-20
                  flex
                  items-center
                  justify-center
                  font-bold
                  tracking-[0.2em]
                "
            >
              NO MEMBERS AVAILABLE
            </div>
          )}

          {/* =================================================
              MEMBER CARDS
          ================================================== */}

          {platinumMembers.map((m, i) => {
            const photoSrc =
              m.photoUrl && m.photoUrl.trim() !== ""
                ? resolveImageUrl(m.photoUrl)
                : "/members/logo.png";
            const logoSrc =
              m.logoUrl && m.logoUrl.trim() !== ""
                ? resolveImageUrl(m.logoUrl)
                : "/members/logo.png";
            console.log(`Final image URL for ${m.name}:`, { photoSrc, logoSrc });
            return (
              <motion.div
                key={m.id || m._id || i}
                {...inView((i % 2) * 0.1)}
                className="relative group bg-white/80 backdrop-blur-3xl rounded-[28px] p-6 lg:p-7 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(4,71,101,0.08),0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-[400ms] ease-out flex flex-col gap-6 sm:gap-8 items-center"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#044765]/5 to-[#4FA3D1]/5 rounded-[28px] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-[400ms] -z-10 pointer-events-none" />
                
                {/* Simulated Gradient Border */}
                <div className="absolute inset-0 rounded-[28px] border-[1.5px] border-transparent bg-gradient-to-br from-[#044765]/40 to-[#4FA3D1]/40 [mask-image:linear-gradient(white,white),linear-gradient(white,white)] [mask-clip:padding-box,border-box] [mask-composite:exclude] opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] pointer-events-none" />

                {/* Top Side: Member Image + Logo Side-by-Side */}
                <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                  
                  {/* Member Image Wrapper */}
                  <div className="flex-1 w-full max-w-[500px] aspect-square rounded-[24px] overflow-hidden bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.08)] group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] transition-shadow duration-[400ms] relative z-10 isolate">
                    <img
                      src={photoSrc}
                      alt={m.name || "Member"}
                      width="500"
                      height="500"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/members/logo.png"; }}
                      className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.04] bg-white relative z-10"
                    />
                    {/* Skeleton pattern for loading */}
                    <div className="absolute inset-0 bg-gray-200 -z-10 animate-pulse pointer-events-none" />
                  </div>

                  {/* Company Logo Wrapper */}
                  <div className="flex-1 w-full max-w-[500px] aspect-square bg-white backdrop-blur-2xl rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center p-4 z-20 group-hover:rotate-[3deg] transition-all duration-[400ms] group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.16)]">
                    <img
                      src={logoSrc}
                      alt={`${m.businessName} Logo`}
                      width="500"
                      height="500"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/members/logo.png"; }}
                      className="w-full h-full object-contain filter group-hover:brightness-105 transition-all duration-[400ms]"
                    />
                  </div>
                </div>

                {/* Bottom Side: Details */}
                <div className="flex flex-col flex-grow items-center text-center w-full transition-transform duration-[400ms] group-hover:-translate-y-1 z-10">
                  
                  {/* Name and Position */}
                  <div className="mb-4">
                    <h3 className="text-[28px] sm:text-[34px] font-black text-gray-900 leading-[1.1] tracking-tight mb-2 flex items-center gap-3">
                      {m.name}
                    </h3>
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      {m.position || "Member"}
                    </p>
                  </div>

                  {/* Business Name */}
                  <div className="mb-6">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">
                      {m.businessName}
                    </h4>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">

                    <span className="inline-flex items-center px-3.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-bold uppercase tracking-[0.1em] rounded-full shadow-sm">
                      {m.businessCategory}
                    </span>
                  </div>

                  <div className="flex-grow" />

                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className=" bg-gray-50 py-20 md:py-24 relative overflow-hidden border-t border-gray-100 " >
        <div className=" max-w-6xl mx-auto px-6 md:px-10 relative z-10 flex flex-col items-center " >
          <motion.div {...inView(0)} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black ${primaryTextClass} mb-6 tracking-tight leading-[1.1] `} > Top Vacant Categories </h2>
            <div className="w-16 h-1.5 bg-secondary mx-auto rounded-full " />
            <p className="mt-8 max-w-lg mx-auto text-[15px] leading-relaxed font-medium " > We exclusively allow one profession per category. Lock out your competition by filling one of our vacant seats today. </p>
          </motion.div>
          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl ">
            {vacantCategories.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} {...inView(i * 0.1)} className={`flex flex-col items-center group bg-white  rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
                  <div className=" w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>
                  <h4 className={` ${primaryTextClass} font-extrabold text-center text-[13px] md:text-[15px] leading-tight`}>
                    {v.title}
                  </h4>
                </motion.div>
              );
            })}
          </div>
          <motion.div {...inView(0.4)} className="mt-16">
            <Link to="/contact">
              <div className="inline-flex items-center justify-center rounded-md font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] shadow-sm hover:shadow-md hover:scale-105 xl:py-3.5 xl:px-10 py-3 px-8">
                Apply for a seat
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}