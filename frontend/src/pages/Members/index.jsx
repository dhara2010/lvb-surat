import React, { useEffect } from "react";
import { usePrimaryTextClass } from "../../hooks/useTheme";
import { motion } from "framer-motion";
import {Users, TrendingUp, MessageSquare, Diamond, Building2, Stethoscope, CalendarDays, Plane, ArrowRight, } from "lucide-react";
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
  viewport: {once: true,amount: 0.1,},
  transition: {duration: 0.7,delay,ease: [0.16, 1, 0.3, 1],},
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
          md:px-10

          max-w-7xl
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
            sm:grid-cols-2
            lg:grid-cols-3

            gap-8
            md:gap-10

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
              {...inView((i % 9) * 0.05)}
              className="
                bg-white

                rounded-xl

                p-6
                md:p-8

                border
                border-gray-100

                hover:border-secondary/20

                shadow-md

                hover:shadow-xl

                transition-all
                duration-500

                group

                flex
                flex-col

                hover:-translate-y-2

                relative

                overflow-hidden
              "
            >
              {/* Top Accent */}

              <div
                className="
                  absolute

                  top-0
                  left-0
                  right-0

                  h-1

                  bg-gradient-to-r

                  from-transparent
                  via-secondary
                  to-transparent

                  opacity-0

                  group-hover:opacity-100

                  transition-opacity
                  duration-500
                "
              />

              {/* =============================================
                  PHOTO + LOGO
              ============================================== */}

              <div
                className="
                  flex
                  justify-between
                  items-start

                  gap-5

                  mb-8

                  relative
                  z-10

                  w-full
                "
              >
                {/* MEMBER PHOTO */}

                <div
                  className="
                    relative

                    w-[125px]
                    h-[145px]

                    md:w-[145px]
                    md:h-[165px]

                    flex-shrink-0

                    rounded-lg

                    overflow-hidden

                    bg-gray-100

                    border
                    border-gray-100

                    shadow-sm
                  "
                >
                  <img
                    src={photoSrc}
                    alt={m.name || "LVB Member"}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/members/logo.png";
                    }}
                    className="
                      block
                      w-full
                      h-full
                      object-cover
                      object-top
                      opacity-100
                      filter-none
                      brightness-100
                      contrast-100
                      saturate-100
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.04]
                    "
                  />
                </div>

                {/* COMPANY LOGO */}

                <div
                  className="
                    w-[100px]
                    h-[100px]

                    md:w-[115px]
                    md:h-[115px]

                    rounded-lg

                    bg-white

                    border
                    border-gray-200

                    shadow-sm

                    p-3

                    flex
                    items-center
                    justify-center

                    overflow-hidden

                    flex-shrink-0
                  "
                >
                  <img
                    src={logoSrc}
                    alt={`${m.businessName || "Company"} Logo`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/members/logo.png";
                    }}
                    className="
                      block
                      w-full
                      h-full
                      object-contain
                      opacity-100
                      filter-none
                      brightness-100
                      contrast-100
                      saturate-100
                    "
                  />
                </div>
              </div>

              {/* =============================================
                  MEMBER INFORMATION
              ============================================== */}

              <div
                className="
                  flex
                  flex-col

                  mt-auto

                  pb-4

                  border-b
                  border-gray-100
                "
              >
                {/* Member Name */}

                <h3
                  className={`
                    text-2xl

                    font-black

                    ${primaryTextClass}

                    leading-tight

                    group-hover:text-secondary

                    transition-colors
                    duration-300
                  `}
                >
                  {m.name}
                </h3>

                {/* Business */}

                <div
                  className="
                    mt-3

                    flex
                    items-center

                    gap-2
                  "
                >
                  <div
                    className="
                      w-8
                      h-[2px]

                      shrink-0

                      bg-secondary

                      rounded-full
                    "
                  />

                  <span
                    className="
                      uppercase

                      text-[11px]

                      font-black

                      tracking-[0.15em]

                      line-clamp-2
                    "
                  >
                    {m.businessName}
                  </span>
                </div>
              </div>

              {/* =============================================
                  BUSINESS CATEGORY
              ============================================== */}

              <div
                className="
                  pt-4

                  flex

                  justify-between
                  items-center

                  gap-3
                "
              >
                <span
                  className="
                    inline-block

                    text-[10px]

                    font-bold

                    uppercase

                    tracking-[0.15em]

                    line-clamp-2

                    mr-2
                  "
                >
                  {m.businessCategory}
                </span>

                <div
                  className="
                    w-9
                    h-9

                    rounded-full

                    bg-gray-50

                    flex
                    items-center
                    justify-center

                    group-hover:bg-secondary
                    group-hover:text-white

                    transition-all
                    duration-300

                    flex-shrink-0
                  "
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          VACANT CATEGORIES
      ====================================================== */}

      <section
        className="
          bg-gray-50

          py-20
          md:py-24

          relative

          overflow-hidden

          border-t
          border-gray-100
        "
      >
        <div
          className="
            max-w-6xl

            mx-auto

            px-6
            md:px-10

            relative
            z-10

            flex
            flex-col
            items-center
          "
        >
          {/* Heading */}

          <motion.div {...inView(0)} className="text-center mb-16">
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
              Top Vacant Categories
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

            <p
              className="
                mt-8

                max-w-lg

                mx-auto

                text-[15px]

                leading-relaxed

                font-medium
              "
            >
              We exclusively allow one profession per category. Lock out your
              competition by filling one of our vacant seats today.
            </p>
          </motion.div>

          {/* Categories */}

          <div
            className="
              w-full

              grid

              grid-cols-2
              lg:grid-cols-5

              gap-4
              md:gap-6

              max-w-5xl
            "
          >
            {vacantCategories.map((v, i) => {
              const Icon = v.icon;

              return (
                <motion.div
                  key={v.title}
                  {...inView(i * 0.1)}
                  className={`
                    flex
                    flex-col
                    items-center

                    group

                    bg-white

                    rounded-3xl

                    p-6
                    md:p-8

                    border
                    border-gray-100

                    shadow-sm

                    hover:shadow-xl

                    hover:-translate-y-2

                    transition-all
                    duration-500

                    ${i === 4 ? "col-span-2 lg:col-span-1" : ""}
                  `}
                >
                  <div
                    className="
                      w-16
                      h-16

                      rounded-2xl

                      bg-gray-50

                      border
                      border-gray-100

                      flex
                      items-center
                      justify-center

                      mb-6

                      group-hover:bg-secondary
                      group-hover:text-white

                      transition-all
                      duration-300
                    "
                  >
                    <Icon size={26} strokeWidth={1.5} />
                  </div>

                  <h4
                    className={`
                      ${primaryTextClass}

                      font-extrabold

                      text-center

                      text-[13px]
                      md:text-[15px]

                      leading-tight
                    `}
                  >
                    {v.title}
                  </h4>
                </motion.div>
              );
            })}
          </div>

          {/* Apply Button */}

          <motion.div {...inView(0.4)} className="mt-16">
            <Link
              to="/contact"
              className="
                group

                relative

                inline-flex
                items-center

                gap-3

                overflow-hidden

                rounded-2xl

                px-10
                py-5

                font-bold

                uppercase

                tracking-[0.2em]

                text-[12px]

                bg-primary

                transition-all
                duration-300

                hover:bg-secondary

                hover:shadow-xl

                hover:-translate-y-1
              "
            >
              <span className="relative z-10">Apply For A Seat</span>

              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}