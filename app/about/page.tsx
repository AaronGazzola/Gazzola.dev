"use client";
import Stars from "@/app/(components)/Stars";
import { sourceCodePro } from "@/styles/fonts";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, BookOpen, Briefcase, GraduationCap, Microscope } from "lucide-react";
import Image from "next/image";

const careerSteps = [
  {
    title: "Education",
    description: "First Class Honours degree in Science",
    icon: GraduationCap,
    duration: "University",
  },
  {
    title: "Science Career",
    description: "5 years experience working as a scientist",
    icon: Microscope,
    duration: "5 years",
  },
  {
    title: "Learning Development",
    description:
      "Self-taught full stack web development over 2 years while working part-time",
    icon: BookOpen,
    duration: "2 years",
  },
  {
    title: "Freelance Career",
    description: "4 years full-time freelance development on Upwork",
    icon: Briefcase,
    duration: "4 years",
  },
];

const page = () => {
  return (
    <>
      <div className={clsx(sourceCodePro.className, "min-h-screen relative")}>
        <Stars />
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center py-20 px-5 sm:px-10"
        >
          <h1 className="text-[40px] tracking-[1.1rem] text-center my-4 leading-[3rem]">
            AARON GAZZOLA
          </h1>
          <h2 className="text-lg font-medium mb-8">Full Stack Vibe Lead</h2>

          {/* Profile Image with Radial Gradient Fade */}
          <div className="relative w-96 h-96 mx-auto ">
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="px-5 sm:px-10"
        >
          <h3 className="text-2xl font-bold text-center mb-16">
            Education & Career Transition
          </h3>

          <div className="max-w-6xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center relative">
              {careerSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                    className="flex flex-col items-center relative z-10 bg-black"
                  >
                    {/* Circle with Icon */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 p-0.5 mb-4">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <step.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center max-w-[250px]">
                      <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Arrow pointing right (except for last item) */}
                  {index < careerSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.0 + index * 0.2 }}
                      className="mx-8 flex items-center"
                    >
                      <ArrowRight className="w-8 h-8 text-gradient-to-r from-blue-500 via-purple-500 to-green-500" style={{ 
                        filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))'
                      }} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {careerSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                    className="flex items-center space-x-4 w-full mb-4"
                  >
                    {/* Circle with Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 p-1 flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-300 mb-1">
                        {step.description}
                      </p>
                      <span className="text-xs text-blue-400 font-medium">
                        {step.duration}
                      </span>
                    </div>
                  </motion.div>

                  {/* Arrow pointing down (except for last item) */}
                  {index < careerSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.0 + index * 0.2 }}
                      className="mb-4 flex justify-center"
                    >
                      <ArrowDown className="w-6 h-6 text-purple-400" style={{ 
                        filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.5))'
                      }} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default page;
