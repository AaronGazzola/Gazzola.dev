"use client";
import Stars from "@/app/(components)/Stars";
import ThemeControlPanel from "@/app/(components)/ThemeControlPanel";
import { useThemeStore } from "@/app/layout.stores";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import configuration from "@/configuration";
import { sourceCodePro } from "@/styles/fonts";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCog,
  Briefcase,
  GraduationCap,
  ListTodo,
  Palette,
  Plus,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  SiNextdotjs,
  SiPostgresql,
  SiSupabase,
  SiTailwindcss,
} from "react-icons/si";

// Custom SVG Icons
const ViteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 410 404"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z"
      fill="white"
    />
    <path
      d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.746 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855181 292.965 1.5744Z"
      fill="black"
    />
  </svg>
);

const ShadcnIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="256" height="256" fill="none" />
    <line
      x1="208"
      y1="128"
      x2="128"
      y2="208"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <line
      x1="192"
      y1="40"
      x2="40"
      y2="192"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
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
    title: "Online Learning",
    description: "Self-taught full stack web development over 2 years",
    icon: BrainCog,
    duration: "2 years",
  },
  {
    title: "Freelance Career",
    description:
      "5 years of five-star full-stack freelance web app development",
    icon: Briefcase,
    duration: "5 years",
  },
];

const nextSteps = [
  {
    title: "Design",
    description: "Configure your web app and download your starter kit",
    icon: ListTodo,
  },
  {
    title: "Build",
    description: "Use your starter kit to generate your web app",
    icon: Bot,
  },
  {
    title: "Review",
    description: "Apply for AI-Generated Web App Quality Assurance",
    icon: Rocket,
  },
];

const techStack = [
  {
    title: "Next.js + Vite",
    description: "React framework for production web applications",
    icons: [SiNextdotjs, ViteIcon],
  },
  {
    title: "Shadcn + TailwindCSS",
    description: "Modern UI components and utility-first styling",
    icons: [ShadcnIcon, SiTailwindcss],
  },
  {
    title: "PostgreSQL/Supabase",
    description: "Database and backend services platform",
    icons: [SiPostgresql, SiSupabase],
  },
];

const Page = () => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();

  const getGradientStyle = () => {
    if (gradientEnabled) {
      return `linear-gradient(to right, ${gradientColors.join(", ")})`;
    }
    return singleColor;
  };

  const getTextGradientClasses = () => {
    if (gradientEnabled) {
      return "bg-gradient-to-r bg-clip-text text-transparent font-black";
    }
    return "font-black";
  };

  const getTextGradientStyle = () => {
    if (gradientEnabled) {
      return {
        backgroundImage: `linear-gradient(to right, ${gradientColors.join(", ")})`,
      };
    }
    return {
      color: singleColor,
    };
  };

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
              className="border border-transparent   text-gray-300 hover:bg-gray-800 font-semibold flex items-center gap-2 hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-6 right-6 z-30"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300">
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0">
              <ThemeControlPanel />
            </PopoverContent>
          </Popover>
        </motion.div>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center py-10 sm:py-20 px-5 sm:px-10"
        >
          <h1 className="text-[36px] sm:text-[48px] tracking-[1.1rem] text-center my-4 leading-[3rem] sm:leading-[3.5rem] font-light">
            AZ GAZZOLA
          </h1>
          <h1 className="font-normal text-xl sm:text-3xl mb-8">
            Artificial Intelligence <br />
            Quality Assurance
          </h1>

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
                            {gradientEnabled ? (
                              gradientColors.map((color, colorIndex) => (
                                <stop
                                  key={colorIndex}
                                  offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                  stopColor={color}
                                />
                              ))
                            ) : (
                              <stop offset="0%" stopColor={singleColor} />
                            )}
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
            <div className="md:hidden flex flex-col items-center mt-8 gap-6">
              {careerSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center w-full max-w-md"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <div className="flex-shrink-0 relative">
                      <svg
                        className="w-16 h-16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-career-mobile-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            {gradientEnabled ? (
                              gradientColors.map((color, colorIndex) => (
                                <stop
                                  key={colorIndex}
                                  offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                  stopColor={color}
                                />
                              ))
                            ) : (
                              <stop offset="0%" stopColor={singleColor} />
                            )}
                          </linearGradient>
                        </defs>
                        <step.icon
                          className="w-16 h-16"
                          stroke={`url(#gradient-career-mobile-${index})`}
                          strokeWidth={2}
                        />
                      </svg>
                    </div>

                    <div className="flex-1 text-center">
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <p className="text-base font-semibold">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {index < careerSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="my-2"
                    >
                      <ArrowDown
                        className="w-6 h-6"
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
            className="text-center mb-24"
          >
            <h2 className="text-2xl sm:text-3xl mb-4">
              Full stack{" "}
              <span
                className={getTextGradientClasses()}
                style={getTextGradientStyle()}
              >
                Typescript
              </span>{" "}
              +{" "}
              <span
                className={getTextGradientClasses()}
                style={getTextGradientStyle()}
              >
                SQL
              </span>{" "}
              web development
            </h2>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 relative">
              {techStack.map((tech, index) => {
                const totalItems = techStack.length;
                const isLastItemOverall = index === totalItems - 1;
                const mdHideClass = isLastItemOverall
                  ? "md:hidden lg:flex"
                  : "";
                const combinedClassName =
                  `tech-stack-item-${index} relative flex flex-col items-center ${mdHideClass}`.trim();

                return (
                  <div key={index} className={combinedClassName}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center relative z-10 bg-black w-full max-w-[250px]"
                    >
                      <div className="mb-4 relative">
                        <div className="flex items-center gap-0">
                          {tech.icons.map((Icon, iconIndex) => (
                            <div key={iconIndex} className="flex items-center">
                              <Icon className="w-12 h-12 text-white" />
                              {iconIndex < tech.icons.length - 1 && (
                                <Plus className="w-4 h-4 text-white mx-1" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                        <p className="text-base font-semibold mb-2">
                          {tech.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:flex lg:hidden justify-center mt-16">
              {(() => {
                const lastTech = techStack[techStack.length - 1];
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center relative z-10 bg-black w-full max-w-[250px]"
                  >
                    <div className="mb-4 relative">
                      <div className="flex items-center gap-0">
                        {lastTech.icons.map((Icon, iconIndex) => (
                          <div key={iconIndex} className="flex items-center">
                            <Icon className="w-12 h-12 text-white" />
                            {iconIndex < lastTech.icons.length - 1 && (
                              <Plus className="w-4 h-4 text-white mx-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">
                        {lastTech.title}
                      </h3>
                      <p className="text-base font-semibold mb-2">
                        {lastTech.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            <div className="md:hidden flex flex-col items-center mt-8 gap-6">
              {techStack.map((tech, index) => (
                <div
                  key={`mobile-${index}`}
                  className="flex flex-col items-center w-full max-w-md"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <div className="flex-shrink-0 relative">
                      <div className="flex items-center gap-0">
                        {tech.icons.map((Icon, iconIndex) => (
                          <div key={iconIndex} className="flex items-center">
                            <Icon className="w-10 h-10 text-white" />
                            {iconIndex < tech.icons.length - 1 && (
                              <Plus className="w-3 h-3 text-white mx-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      <h3 className="text-xl font-bold mb-1">{tech.title}</h3>
                      <p className="text-base font-semibold">
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* What now? Section */}
        <motion.div className="px-5 sm:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-medium text-center mb-16"
          >
            Starter Kit
          </motion.h2>

          <div className="max-w-7xl mx-auto">
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 relative">
              {nextSteps.map((step, index) => {
                const totalItems = nextSteps.length;
                const isLastItemOverall = index === totalItems - 1;
                const mdLastInGrid = totalItems - 1;
                const lgLastInGrid = totalItems - 1;

                const showInMdGrid = index < mdLastInGrid;
                const showInLgGrid = true;

                const getLgColsInfo = () => {
                  const col = index % 3;
                  const row = Math.floor(index / 3);
                  const isEvenRow = row % 2 === 0;
                  return { col, row, isEvenRow, totalCols: 3 };
                };

                const getMdColsInfo = () => {
                  const col = index % 2;
                  const row = Math.floor(index / 2);
                  const isEvenRow = row % 2 === 0;
                  return { col, row, isEvenRow, totalCols: 2 };
                };

                const lgInfo = getLgColsInfo();
                const mdInfo = getMdColsInfo();

                const isLastItemInMdGrid = index === mdLastInGrid - 1;
                const isLastItemInLgGrid = index === lgLastInGrid - 1;

                const getLgArrowDirection = () => {
                  if (isLastItemOverall) return null;

                  const visualCol = lgInfo.isEvenRow
                    ? lgInfo.col
                    : 2 - lgInfo.col;

                  if (visualCol === 0 && lgInfo.row === 1 && totalItems === 7) {
                    return "down-right";
                  }

                  const nextCol = (index + 1) % 3;
                  const nextRow = Math.floor((index + 1) / 3);
                  if (nextRow > lgInfo.row) {
                    return "down";
                  }
                  return lgInfo.isEvenRow ? "right" : "left";
                };

                const getMdArrowDirection = () => {
                  if (isLastItemOverall) return null;

                  const visualCol = mdInfo.isEvenRow
                    ? mdInfo.col
                    : 1 - mdInfo.col;

                  if (mdInfo.isEvenRow) {
                    return visualCol === 0 ? "right" : "down-left";
                  } else {
                    return visualCol === 1 ? "left" : "down";
                  }
                };

                const lgArrowDirection = getLgArrowDirection();
                const mdArrowDirection = getMdArrowDirection();

                const lgOrder = lgInfo.isEvenRow
                  ? index
                  : lgInfo.row * 3 + (3 - 1 - lgInfo.col);
                const mdOrder = mdInfo.isEvenRow
                  ? index
                  : mdInfo.row * 2 + (2 - 1 - mdInfo.col);

                const mdColStartClass = "";
                const lgColStartClass =
                  lgInfo.row === 2 && lgInfo.col === 0 ? "lg:col-start-2" : "";
                const mdHideClass = isLastItemOverall
                  ? "md:hidden lg:flex"
                  : "";
                const combinedClassName =
                  `next-step-item-${index} relative flex flex-col items-center ${mdColStartClass} ${lgColStartClass} ${mdHideClass}`.trim();

                return (
                  <div key={index} className={combinedClassName}>
                    <style>{`
                      .next-step-item-${index} {
                        order: ${mdOrder};
                      }
                      @media (min-width: 976px) {
                        .next-step-item-${index} {
                          order: ${lgOrder};
                        }
                      }
                    `}</style>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center relative z-10 bg-black w-full max-w-[250px]"
                    >
                      <div className="mb-4 relative">
                        <div className="relative w-20 h-20">
                          <step.icon
                            className="w-20 h-20 stroke-1 absolute inset-0 z-0"
                            style={{
                              color:
                                gradientColors[index % gradientColors.length],
                            }}
                            fill="none"
                          />
                          <svg
                            className="w-20 h-20 relative z-10"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <defs>
                              <linearGradient
                                id={`gradient-next-${index}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                              >
                                {gradientEnabled ? (
                                  gradientColors.map((color, colorIndex) => (
                                    <stop
                                      key={colorIndex}
                                      offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                      stopColor={color}
                                    />
                                  ))
                                ) : (
                                  <stop offset="0%" stopColor={singleColor} />
                                )}
                              </linearGradient>
                            </defs>
                            <step.icon
                              className="w-20 h-20 stroke-1"
                              stroke={`url(#gradient-next-${index})`}
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-base font-semibold mb-2">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>

                    {lgArrowDirection && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        viewport={{ once: true }}
                        className={`absolute z-20 hidden lg:block ${
                          lgArrowDirection === "right"
                            ? "-right-4 top-1/3 -translate-y-1/2"
                            : lgArrowDirection === "left"
                              ? "-left-4 top-1/3 -translate-y-1/2"
                              : lgArrowDirection === "down-right"
                                ? "-bottom-4 right-4"
                                : "-bottom-8 left-[calc(50%-1rem)] -translate-x-1/2"
                        }`}
                      >
                        {lgArrowDirection === "right" && (
                          <ArrowRight
                            className="w-8 h-8"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                        {lgArrowDirection === "left" && (
                          <ArrowLeft
                            className="w-8 h-8"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                        {lgArrowDirection === "down" && (
                          <ArrowDown
                            className="w-8 h-8"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                        {lgArrowDirection === "down-right" && (
                          <ArrowDown
                            className="w-8 h-8 rotate-[-30deg]"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                      </motion.div>
                    )}

                    {mdArrowDirection && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        viewport={{ once: true }}
                        className={`absolute z-20 lg:hidden ${
                          mdArrowDirection === "right"
                            ? "-right-4 top-1/3 -translate-y-1/2"
                            : mdArrowDirection === "left"
                              ? "-left-4 top-1/3 -translate-y-1/2"
                              : mdArrowDirection === "down-left"
                                ? "-bottom-8 left-8"
                                : "-bottom-8 left-[calc(50%-1rem)] -translate-x-1/2"
                        }`}
                      >
                        {mdArrowDirection === "right" && (
                          <ArrowRight
                            className="w-8 h-8"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                        {mdArrowDirection === "left" && (
                          <ArrowLeft
                            className="w-8 h-8"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                        {mdArrowDirection === "down" && (
                          <ArrowDown
                            className="w-8 h-8"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                        {mdArrowDirection === "down-left" && (
                          <ArrowDown
                            className="w-8 h-8 rotate-[30deg]"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden md:flex lg:hidden justify-center mt-16">
              {(() => {
                const lastStep = nextSteps[nextSteps.length - 1];
                const LastIcon = lastStep.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center relative z-10 bg-black w-full max-w-[250px]"
                  >
                    <div className="mb-4 relative">
                      <div className="relative w-20 h-20">
                        <LastIcon
                          className="w-20 h-20 stroke-1 absolute inset-0 z-0"
                          style={{
                            color: gradientColors[2 % gradientColors.length],
                          }}
                          fill="none"
                        />
                        <svg
                          className="w-20 h-20 relative z-10"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <defs>
                            <linearGradient
                              id={`gradient-next-last`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              {gradientEnabled ? (
                                gradientColors.map((color, colorIndex) => (
                                  <stop
                                    key={colorIndex}
                                    offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                    stopColor={color}
                                  />
                                ))
                              ) : (
                                <stop offset="0%" stopColor={singleColor} />
                              )}
                            </linearGradient>
                          </defs>
                          <LastIcon
                            className="w-20 h-20 stroke-1"
                            stroke={`url(#gradient-next-last)`}
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">
                        {lastStep.title}
                      </h3>
                      <p className="text-base font-semibold mb-2">
                        {lastStep.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            <div className="md:hidden flex flex-col items-center mt-8 gap-6">
              {nextSteps.map((step, index) => (
                <div
                  key={`mobile-${index}`}
                  className="flex flex-col items-center w-full max-w-md"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <div className="flex-shrink-0 relative">
                      <div className="relative w-16 h-16">
                        <step.icon
                          className="w-16 h-16 stroke-1 absolute inset-0 z-0"
                          style={{
                            color:
                              gradientColors[index % gradientColors.length],
                          }}
                          fill="none"
                        />
                        <svg
                          className="w-16 h-16 relative z-10"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <defs>
                            <linearGradient
                              id={`gradient-next-mobile-${index}`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              {gradientEnabled ? (
                                gradientColors.map((color, colorIndex) => (
                                  <stop
                                    key={colorIndex}
                                    offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                    stopColor={color}
                                  />
                                ))
                              ) : (
                                <stop offset="0%" stopColor={singleColor} />
                              )}
                            </linearGradient>
                          </defs>
                          <step.icon
                            className="w-16 h-16 stroke-1"
                            stroke={`url(#gradient-next-mobile-${index})`}
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <p className="text-base font-semibold">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {index < nextSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="my-2"
                    >
                      <ArrowDown
                        className="w-6 h-6"
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

        {/* Get Started CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center py-20 px-5 sm:px-10"
        >
          <Link href={configuration.paths.home}>
            <Button
              variant="highlight"
              className="border border-transparent  text-gray-300  font-semibold flex items-center gap-4 group-hover:border-transparent text-2xl px-10 py-8"
            >
              Get Started
              <Rocket className="!w-7 !h-7" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default Page;
