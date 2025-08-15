"use client";
import Stars from "@/app/(components)/Stars";
import { Button } from "@/components/ui/button";
import configuration from "@/configuration";
import { sourceCodePro } from "@/styles/fonts";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BrainCog,
  Briefcase,
  GraduationCap,
  Plus,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  SiCypress,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiSupabase,
  SiTailwindcss,
} from "react-icons/si";

// Custom SVG Icons
const BetterAuthIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="69" y="121" width="86.9879" height="259" fill="white" />
    <rect x="337.575" y="121" width="92.4247" height="259" fill="white" />
    <rect
      x="427.282"
      y="121"
      width="83.4555"
      height="174.52"
      transform="rotate(90 427.282 121)"
      fill="white"
    />
    <rect
      x="430"
      y="296.544"
      width="83.4555"
      height="177.238"
      transform="rotate(90 430 296.544)"
      fill="white"
    />
    <rect
      x="252.762"
      y="204.455"
      width="92.0888"
      height="96.7741"
      transform="rotate(90 252.762 204.455)"
      fill="white"
    />
  </svg>
);

const careerSteps = [
  {
    title: "Education",
    description: "First Class Honours degree in Biology and Physiology",
    icon: GraduationCap,
    duration: "4 Years",
  },
  {
    title: "Science Career",
    description: "4 years experience working as a scientist",
    icon: Activity,
    duration: "4 years",
  },
  {
    title: "Learning Development",
    description: "Self-taught full stack web development over 2 years",
    icon: BrainCog,
    duration: "2 years",
  },
  {
    title: "Freelance Career",
    description: "4 years full-time freelance development on Upwork",
    icon: Briefcase,
    duration: "4 years",
  },
];

const techStack = [
  {
    title: "Next.js",
    description: "React framework for production web applications",
    icons: [SiNextdotjs],
  },
  {
    title: "Shadcn + TailwindCSS",
    description: "Modern UI components and utility-first styling",
    icons: [SiTailwindcss],
  },
  {
    title: "Prisma ORM",
    description: "Type-safe database client and query builder",
    icons: [SiPrisma],
  },
  {
    title: "Better-Auth",
    description: "Authentication and authorization system",
    icons: [BetterAuthIcon],
  },
  {
    title: "PostgreSQL/Supabase",
    description: "Database and backend services platform",
    icons: [SiPostgresql, SiSupabase],
  },
  {
    title: "Cypress/Playwright",
    description: "End-to-end testing frameworks for reliability",
    icons: [SiCypress],
  },
];

const page = () => {
  return (
    <>
      <div className={clsx(sourceCodePro.className, "min-h-screen relative")}>
        <Stars smStars={75} mdStars={100} lgStars={175} />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-6 left-6 z-30"
        >
          <Link href={configuration.paths.home}>
            <Button
              variant="outline"
              className="border border-transparent  bg-transparent text-gray-300 hover:bg-gray-800 rounded font-semibold flex items-center gap-2 hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </motion.div>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center py-10 sm:py-20 px-5 sm:px-10"
        >
          <h1 className="text-[36px] sm:text-[48px] tracking-[1.1rem] text-center my-4 leading-[3rem] sm:leading-[3.5rem] font-light">
            AARON GAZZOLA
          </h1>
          <h1 className="text-2xl sm:text-3xl mb-8">Full Stack Vibe Lead</h1>

          {/* Profile Image with Radial Gradient Fade */}
          <div className="relative w-64 h-64 sm:w-96 sm:h-96  mx-auto">
            <Image
              src="/Astronaut on laptop.png"
              alt="Aaron Gazzola - Astronaut on laptop"
              width={192}
              height={192}
              className="rounded-full object-cover w-full h-full"
              style={{
                maskImage:
                  "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 85%)",
                WebkitMaskImage:
                  "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 85%)",
              }}
              priority
            />
          </div>
        </motion.div>

        {/* Career Transition Section */}
        <motion.div className="px-5 sm:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-medium text-center mb-16"
          >
            Education & Career Transition
          </motion.h2>

          <div className="max-w-6xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-start justify-center relative">
              {careerSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center relative z-10 bg-black"
                  >
                    {/* Icon with Gradient */}
                    <div className="mb-4 relative">
                      <svg
                        className="w-20 h-20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-desktop-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        <step.icon
                          className="w-20 h-20 stroke-1"
                          stroke={`url(#gradient-desktop-${index})`}
                          fill="none"
                        />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="text-center max-w-[250px]">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-base font-semibold mb-2">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Arrow pointing right (except for last item) */}
                  {index < careerSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="mx-8 h-20 flex items-center"
                    >
                      <ArrowRight
                        className="w-8 h-8 text-gradient-to-r from-blue-500 via-purple-500 to-green-500"
                        style={{
                          filter:
                            "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {careerSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 w-full mb-4 justify-start"
                  >
                    {/* Icon with Gradient */}
                    <div className="flex-shrink-0 relative">
                      <svg
                        className="w-12 h-12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-mobile-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        <step.icon
                          className="w-12 h-12"
                          stroke={`url(#gradient-mobile-${index})`}
                          strokeWidth={2}
                        />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <p className="text-base font-semibold mb-1">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Arrow pointing down (except for last item) */}
                  {index < careerSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="mb-4 flex justify-center w-12"
                    >
                      <ArrowDown
                        className="w-6 h-6 text-white"
                        style={{
                          filter:
                            "drop-shadow(0 0 6px rgba(147, 51, 234, 0.5))",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div className="px-5 sm:px-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl mb-4">
              Full stack{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent font-black">
                Typescript
              </span>{" "}
              +{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent font-black">
                SQL
              </span>{" "}
              development
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {/* Large screens - 3x2 grid */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-8">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-6 rounded-lg bg-black bg-opacity-50"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {tech.icons.map((Icon, iconIndex) => (
                      <div key={iconIndex} className="flex items-center">
                        <Icon className="w-12 h-12 text-white" />
                        {iconIndex < tech.icons.length - 1 && (
                          <Plus className="w-4 h-4 text-gray-400 mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                  <p className="text-base font-semibold text-white">
                    {tech.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Medium screens - 2x3 grid */}
            <div className="hidden md:grid md:grid-cols-2 md:grid-rows-3 lg:hidden gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-5 rounded-lg bg-white bg-opacity-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {tech.icons.map((Icon, iconIndex) => (
                      <div key={iconIndex} className="flex items-center">
                        <Icon className="w-10 h-10 text-white" />
                        {iconIndex < tech.icons.length - 1 && (
                          <Plus className="w-3 h-3 text-gray-400 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{tech.title}</h3>
                  <p className="text-base font-semibold text-white">
                    {tech.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Small screens - 1x6 grid */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-white bg-opacity-5"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {tech.icons.map((Icon, iconIndex) => (
                      <div key={iconIndex} className="flex items-center">
                        <Icon className="w-8 h-8 text-white" />
                        {iconIndex < tech.icons.length - 1 && (
                          <Plus className="w-3 h-3 text-gray-400 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{tech.title}</h3>
                  <p className="text-base font-semibold text-white">
                    {tech.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* What now? Section */}
        <motion.div className="px-5 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl mb-4">Ok... What now?</h2>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-black bg-opacity-50"
              >
                <div className="mb-6 relative">
                  <span className="text-[56px] sm:text-[72px] font-light bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 block">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Sign up for free to chat with me!
                </h3>
                <p className="text-base font-semibold text-white">
                  I&apos;m interested to learn about your project and provide
                  free advice and guidance
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-black bg-opacity-50"
              >
                <div className="mb-6 relative">
                  <span className="text-[56px] sm:text-[72px] font-light bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent mb-4 block">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Propose a fixed price contract
                </h3>
                <p className="text-base font-semibold text-white">
                  Tasks can include: Code review, repo refactoring, general
                  consultation or complete web app construction.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-black bg-opacity-50"
              >
                <div className="mb-6 relative">
                  <span className="text-[56px] sm:text-[72px] font-light bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4 block">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Follow along with my process
                </h3>
                <p className="text-base font-semibold text-white">
                  Track the process as tasks are completed and receive frequent
                  updates on my progress
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Get Started CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center py-20 px-5 sm:px-10"
        >
          <Link href={configuration.paths.home}>
            <div className="rounded group bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-[1px]">
              <Button
                variant="outline"
                className="border border-transparent bg-transparent text-gray-300 bg-black rounded font-semibold flex items-center gap-4 group-hover:border-transparent text-2xl px-10 py-8"
              >
                Get Started
                <Rocket className="!w-7 !h-7" />
              </Button>
            </div>
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default page;
