"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Construction, MailIcon } from "lucide-react";
import {
  CloudflareLogo,
  MilestoneIcon,
  PlaywrightPlusVitestLogo,
  StripeLogo,
  SupabaseIcon,
} from "./ExtensionsComponent.utils";

interface Extension {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export const ExtensionsComponent = () => {
  const extensions: Extension[] = [
    {
      id: "resend",
      title: "Custom email delivery with Resend",
      icon: MailIcon,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              This extension provides comprehensive documentation and setup
              guides for implementing custom email delivery using Resend as your
              SMTP provider. Includes configuration for Supabase Auth emails,
              custom email templates, and a preview system for testing your
              templates.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "subdomains",
      title: "Custom subdomains",
      icon: MilestoneIcon,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Step-by-step guide with Claude prompts to configure custom
              subdomains for your application. Includes middleware setup, DNS
              configuration, and routing patterns for user-specific or
              feature-specific subdomains (e.g., user.yourapp.com,
              blog.yourapp.com).
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "stripe-direct",
      title: "Stripe direct payments",
      icon: StripeLogo,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Complete implementation guide for one-time payments using Stripe
              Checkout. Includes webhook handling, payment confirmation flows,
              order tracking, and security best practices for handling customer
              payments.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "stripe-subscription",
      title: "Stripe subscription payments",
      icon: StripeLogo,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Documentation for implementing recurring subscription payments
              with Stripe. Covers multiple pricing tiers, billing cycles,
              customer portal integration, trial periods, and subscription
              lifecycle management.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "stripe-p2p",
      title: "Stripe payments between users",
      icon: StripeLogo,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Comprehensive guide for peer-to-peer payments using Stripe
              Connect. Includes seller onboarding, platform fee configuration,
              payout management, and compliance requirements for marketplace
              applications.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },

    {
      id: "realtime",
      title: "Realtime updates with Supabase broadcasting",
      icon: SupabaseIcon,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Documentation for implementing real-time features using Supabase
              Realtime. Covers database change listeners, presence tracking,
              custom event broadcasting, and example implementations for chat
              and live notifications.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "supabase-images",
      title: "Image upload and download with Supabase",
      icon: SupabaseIcon,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Complete guide for implementing image storage with Supabase
              Storage. Includes upload components, image optimization,
              public/private bucket configuration, signed URLs, and CDN delivery
              setup.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "cloudflare-videos",
      title: "Video upload and download with Cloudflare",
      icon: CloudflareLogo,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Implementation guide for video streaming using Cloudflare Stream.
              Covers direct uploads, adaptive bitrate streaming, video player
              integration, analytics, and best practices for video content
              delivery.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "testing",
      title: "Testing and reporting with Playwright and Vitest",
      icon: PlaywrightPlusVitestLogo,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground">
              Comprehensive testing setup documentation for both end-to-end
              tests (Playwright) and unit tests (Vitest). Includes
              configuration, test patterns, coverage reporting, CI/CD
              integration, and example test suites.
            </p>
          </div>
          <div className="flex items-center justify-center theme-p-8">
            <Badge variant="secondary" className="theme-gap-2 px-4 py-2 text-base">
              <Construction className="h-5 w-5" />
              Coming Soon
            </Badge>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-2 mb-4">
        <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
          Available Extensions
        </h2>
        <p className="theme-text-foreground">
          Extend your application with these powerful integrations and features.
          Download the documentation and copy the prompts to implementat these
          features in your project.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {extensions.map((extension) => {
          const Icon = extension.icon;

          return (
            <AccordionItem
              key={extension.id}
              value={extension.id}
              className="theme-border-border"
            >
              <AccordionTrigger className="hover:theme-text-primary group">
                <div className="flex items-center">
                  <div className="scale-100 lg:scale-125 origin-left mr-3 lg:mr-5">
                    <Icon />
                  </div>
                  <span className="font-semibold text-base lg:text-lg group-hover:underline">
                    {extension.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col theme-gap-4 pt-4">
                  {extension.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
