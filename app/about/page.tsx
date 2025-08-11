"use client";

import Stars from "@/app/(components)/Stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sourceCodePro } from "@/styles/fonts";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  Code2,
  CreditCard,
  Database,
  FileCode,
  FolderOpen,
  GitBranch,
  Play,
  Rocket,
  Server,
  Shield,
  Smartphone,
  TestTube,
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const techStack = [
    {
      name: "Next.js",
      icon: <Code2 className="w-6 h-6" />,
      category: "Full-Stack Framework",
      description:
        "The most popular full-stack React framework, with powerful yet intuitive structure and configuration. Provides server-side rendering, API routes, and optimal performance.",
    },
    {
      name: "Supabase",
      icon: <Server className="w-6 h-6" />,
      category: "Database & Backend",
      description:
        "Open-source database service built on PostgreSQL with real-time updates and file storage. Can be replaced with another Postgres DB if real-time updates aren't required.",
    },
    {
      name: "Prisma",
      icon: <Database className="w-6 h-6" />,
      category: "Database ORM",
      description:
        "Provides Object Relational Mapping, making database interactions type-safe and intuitive. Features for managing migrations and DB schema greatly improve developer experience.",
    },
    {
      name: "Better-Auth",
      icon: <Shield className="w-6 h-6" />,
      category: "Authentication",
      description:
        "Streamlines authentication management with type-safe client for auth events and Stripe integration. Alternative to Supabase auth with more configuration options.",
    },
    {
      name: "Shadcn",
      icon: <FileCode className="w-6 h-6" />,
      category: "UI Framework",
      description:
        "The best UI framework available - generates customizable components with Tailwind classes and theming. Built with Radix UI primitives for robustness and minimal, modern design.",
    },
  ];

  const developmentProcess = [
    {
      phase: "Planning",
      icon: <ClipboardList className="w-8 h-8" />,
      description:
        "Fixed price contract with detailed task breakdown, timelines, and deliverables",
      color: "text-blue-400",
      details: [
        "Title and detailed description",
        "Start, target, and due dates",
        "Individual task pricing",
        "Progress tracking setup",
      ],
    },
    {
      phase: "Development",
      icon: <Code2 className="w-8 h-8" />,
      description:
        "Task-based progress with granular visibility and pay-per-completion model",
      color: "text-green-400",
      details: [
        "Measurable task deliverables",
        "Real-time status updates",
        "Quality code standards",
        "1-3 progress updates per week",
      ],
    },
    {
      phase: "Testing",
      icon: <TestTube className="w-8 h-8" />,
      description: "Comprehensive testing with transparent milestone tracking",
      color: "text-yellow-400",
      details: [
        "Quality assurance checks",
        "Client feedback integration",
        "Performance optimization",
        "Mobile responsiveness testing",
      ],
    },
    {
      phase: "Deployment",
      icon: <Rocket className="w-8 h-8" />,
      description:
        "Production deployment with user and admin approval workflow",
      color: "text-purple-400",
      details: [
        "Production environment setup",
        "Final client approval",
        "Documentation delivery",
        "Ongoing support handoff",
      ],
    },
  ];

  const progressSteps = [
    {
      status: "not_started",
      label: "Not Started",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-gray-100 text-gray-800",
    },
    {
      status: "in_progress",
      label: "In Progress",
      icon: <Play className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      status: "completed",
      label: "Completed",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-green-100 text-green-800",
    },
  ];

  const services = [
    {
      title: "Full Stack Development",
      description:
        "End-to-end web application development with modern technologies",
      icon: <Code2 className="w-6 h-6" />,
    },
    {
      title: "Authentication Systems",
      description:
        "Secure user authentication and authorization implementation",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Payment Integration",
      description: "Stripe payment processing and subscription management",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      title: "Database Design",
      description: "PostgreSQL with Row Level Security and optimized queries",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "Responsive Design",
      description:
        "Mobile-first approach ensuring perfect performance on all devices",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      title: "File Management",
      description: "Secure file upload, storage, and management systems",
      icon: <FolderOpen className="w-6 h-6" />,
    },
  ];

  const externalCosts = [
    {
      service: "Supabase",
      cost: "$25-100/month",
      description: "Database, authentication, and storage",
    },
    {
      service: "Vercel",
      cost: "$20-100/month",
      description: "Hosting and deployment",
    },
    {
      service: "Stripe",
      cost: "2.9% + 30¢",
      description: "Payment processing fees",
    },
    {
      service: "Resend",
      cost: "$20-100/month",
      description: "Transactional email service",
    },
    {
      service: "Domain",
      cost: "$10-15/year",
      description: "Custom domain registration",
    },
  ];

  return (
    <div
      className={clsx(
        sourceCodePro.className,
        "min-h-screen bg-black text-gray-100 relative"
      )}
    >
      <Stars />
      {/* Hero Section */}
      <motion.section
        className="py-20 px-6 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-[40px] tracking-[1.1rem] text-center mb-6 leading-[3rem] font-bold">
          AARON GAZZOLA
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-300 mb-8 font-medium">
          Full Stack Developer
        </h2>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Building modern web apps with quality, security, and client ownership.
        </p>
      </motion.section>

      {/* Professional Background */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          Professional Background
        </h2>
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Education & Career Transition
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                First Class Honours degree in Science
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                5 years experience working as a scientist
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                Self-taught full stack development over 2 years while working
                part-time
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                4 years full-time freelance development on Upwork
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Services */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto bg-gray-900/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          Services & Expertise
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl border border-gray-500/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-blue-400">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-200">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Fixed Price Contract & Task Approach */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          Development Process
        </h2>

        {/* Comprehensive Development Process Flow */}
        <div className="space-y-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developmentProcess.map((phase, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50 text-center space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`${phase.color} bg-gray-800/50 p-4 rounded-full border border-gray-700/50 mx-auto w-fit`}
                >
                  {phase.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-200">
                  {phase.phase}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {phase.description}
                </p>
                <div className="space-y-2 pt-2">
                  {phase.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="text-xs text-gray-500 flex items-start gap-2"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Task Status Legend */}
          <motion.div
            className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">
              Task Progress Tracking
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {progressSteps.map((step, index) => (
                <Badge key={index} className={step.color}>
                  {step.icon}
                  <span className="ml-2">{step.label}</span>
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-center mt-4">
              Transparent milestone tracking with 1-3 progress updates per week
              and pay-per-completion model
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Progress Tracking */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto bg-gray-900/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          Progress Tracking & Updates
        </h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">
              Communication Standards
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                1-3 progress updates per week
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                Transparent milestone tracking
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                Detailed cost and timeline breakdowns
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                Clear technical explanations
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                Regular feedback incorporation
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">
              Quality Standards
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <FileCode className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                High-quality, consistent, safely typed code
              </li>
              <li className="flex items-start gap-3">
                <FileCode className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                Comprehensive developer documentation
              </li>
              <li className="flex items-start gap-3">
                <FileCode className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                Expanded README files with development notes
              </li>
              <li className="flex items-start gap-3">
                <FileCode className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                Iterative feedback integration
              </li>
              <li className="flex items-start gap-3">
                <FileCode className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                Mobile performance optimization
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-400">{tech.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-200">{tech.name}</h3>
                  <p className="text-sm text-gray-500">{tech.category}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 bg-gray-800/30 p-6 rounded-lg border border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-center text-gray-200 mb-4">
            Industry Leading Best Practices
          </h3>
          <p className="text-gray-400 text-center leading-relaxed">
            The tech stack of Next.js, Supabase, Prisma, Better-Auth and Shadcn
            is the industry leader for best practices in modern web development.
            This combination provides unmatched developer experience, type
            safety, performance, and scalability.
          </p>
        </motion.div>
        <div className="mt-12 bg-gray-800/30 p-6 rounded-lg border border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">
            Security & Infrastructure
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Row Level Security (RLS) database policies</li>
              <li>• Built-in data encryption (Supabase)</li>
              <li>• Automatic database backups</li>
              <li>• User privilege-based data access control</li>
            </ul>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• AWS S3 storage (99.999999999% durability)</li>
              <li>• Automatic redundancy across multiple facilities</li>
              <li>• Modern authentication with email verification</li>
              <li>• Secure payment processing with Stripe</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* External Service Costs */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto bg-gray-900/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          External Service Costs
        </h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          All external service costs are paid directly by the client. No hidden
          fees or markup on third-party services.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalCosts.map((cost, index) => (
            <div
              key={index}
              className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-200">{cost.service}</h3>
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-400/30"
                >
                  {cost.cost}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{cost.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Live Streaming & Transparency */}
      <motion.section
        className="py-16 px-6 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-wide">
          Development Transparency
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          Experience complete transparency in the development process through
          live workflow demonstrations and AI-integrated development practices.
          See exactly how your project comes to life with modern, efficient
          development techniques.
        </p>
        <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">
            AI Integration & Live Workflow
          </h3>
          <p className="text-gray-400 mb-6">
            Strongly integrated AI workflow with live demonstrations available
            for direct insight into the developer's process. Modern development
            practices ensure efficient problem-solving and high-quality
            deliverables.
          </p>
          <Button
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            View Development Process
          </Button>
        </div>
      </motion.section>

      {/* Client Ownership */}
      <motion.section
        className="py-16 px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-wide">
          Complete Client Ownership
        </h2>
        <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700/50">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                Client Owns:
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm font-mono">
                <li>├── Source code & repository</li>
                <li>├── Domain registration</li>
                <li>├── Web hosting account</li>
                <li>├── Database instance</li>
                <li>└── Payment processor account</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Developer Access:
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm font-mono">
                <li>├── Repository maintainer role</li>
                <li>├── Deployment management</li>
                <li>├── Database interface access</li>
                <li>└── Development environment setup</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-20 px-6 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-wide">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          Let's discuss your project and create a custom solution that meets
          your needs. Fixed pricing, transparent process, and complete
          ownership.
        </p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
            Start a Consultation
          </Button>
        </Link>
      </motion.section>
    </div>
  );
};

export default AboutPage;
