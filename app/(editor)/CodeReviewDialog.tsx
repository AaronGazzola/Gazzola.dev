"use client";

import { useSubdomainStore } from "@/app/layout.subdomain.store";
import { getBrowserAPI } from "@/lib/env.utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSubmitCodeReview } from "./Footer.hooks";
import { CodeReviewFormData, FooterDataAttributes } from "./Footer.types";

interface CodeReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean | null) => void;
}

export const CodeReviewDialog = ({
  open,
  onOpenChange,
}: CodeReviewDialogProps) => {
  const { isAzVariant, brand } = useSubdomainStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CodeReviewFormData>({
    name: "",
    email: "",
    message: "",
    brand,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [blurCount, setBlurCount] = useState({
    name: 0,
    email: 0,
    message: 0,
  });

  const [tooltipVisible, setTooltipVisible] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [tooltipHovered, setTooltipHovered] = useState({
    name: false,
    email: false,
    message: false,
  });

  const { mutate: submitReview, isPending: isSubmitting } = useSubmitCodeReview(
    () => {
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        message: "",
        brand,
      });
      setTouched({
        name: false,
        email: false,
        message: false,
      });
      setBlurCount({
        name: 0,
        email: 0,
        message: 0,
      });
      setTooltipVisible({
        name: false,
        email: false,
        message: false,
      });
      setTooltipHovered({
        name: false,
        email: false,
        message: false,
      });
    }
  );

  const nameRegex = /^[\p{L}\s'-]{2,100}$/u;
  const isNameValid = nameRegex.test(formData.name.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  const isMessageValid = formData.message.trim().length > 0;

  const isFormValid = isNameValid && isEmailValid && isMessageValid;

  useEffect(() => {
    if (blurCount.name > 0 && !isNameValid) {
      setTooltipVisible((prev) => ({ ...prev, name: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, name: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [blurCount.name, isNameValid]);

  useEffect(() => {
    if (blurCount.email > 0 && !isEmailValid) {
      setTooltipVisible((prev) => ({ ...prev, email: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, email: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [blurCount.email, isEmailValid]);

  useEffect(() => {
    if (blurCount.message > 0 && !isMessageValid) {
      setTooltipVisible((prev) => ({ ...prev, message: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, message: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [blurCount.message, isMessageValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      submitReview(formData);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => onOpenChange(open ? true : null)}
    >
      <DialogContent
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        data-cy={FooterDataAttributes.CODE_REVIEW_DIALOG}
      >
        {mounted && isAzVariant ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center mb-4">
                Quality Assurance for AI&#8209;Generated Web Apps
              </DialogTitle>
              <div className="text-base text-foreground space-y-2">
                <div className="flex justify-center mb-4">
                  <ul className="list-disc text-left">
                    <li>Code Analysis and Refactoring</li>
                    <li>Security Auditing and Remediation</li>
                    <li>End-to-End Automated Testing</li>
                    <li>Complex Feature Implementation</li>
                  </ul>
                </div>
                <p>
                  Lift the veil on the inner workings of your AI-generated web
                  app with in-depth analysis and detailed progress reports.
                </p>
                <p>
                  Launch your web app with confidence, backed by expert
                  refactoring and rigorous testing.
                </p>
              </div>
            </DialogHeader>
            <div className="space-y-6 py-6 flex flex-col items-center">
              <Button
                variant="highlight"
                size="lg"
                className="px-6 py-5 flex items-center gap-3"
                onClick={() =>
                  getBrowserAPI(() => window)?.open(
                    "https://www.upwork.com/freelancers/~017424c1cc6bed64e2",
                    "_blank"
                  )
                }
              >
                <Image
                  src="https://www.vectorlogo.zone/logos/upwork/upwork-ar21.svg"
                  alt="Upwork"
                  width={240}
                  height={100}
                  className="h-12 w-auto brightness-0 invert"
                />
                <ExternalLink className="w-5 h-5 text-white" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                Quality Assurance for AI&#8209;Generated Web Apps
              </DialogTitle>
              <div className="text-base text-foreground space-y-2">
                <ul className="list-disc list-inside">
                  <li>Code Analysis and Refactoring</li>
                  <li>Security Auditing and Remediation</li>
                  <li>End-to-End Automated Testing</li>
                  <li>Complex Feature Implementation</li>
                </ul>
                <p>
                  Lift the veil on the inner workings of your AI-generated web
                  app with in-depth analysis and detailed progress reports.
                </p>
                <p>
                  Launch your web app with confidence, backed by expert
                  refactoring and rigorous testing.
                </p>
              </div>
            </DialogHeader>

        <div className="space-y-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TooltipProvider>
              <div className="space-y-2">
                <Tooltip
                  open={
                    touched.name && !isNameValid
                      ? tooltipVisible.name || tooltipHovered.name
                      : undefined
                  }
                >
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="name"
                      onMouseEnter={() =>
                        setTooltipHovered((prev) => ({ ...prev, name: true }))
                      }
                      onMouseLeave={() =>
                        setTooltipHovered((prev) => ({ ...prev, name: false }))
                      }
                    >
                      Name *
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-destructive">
                    Please enter your name
                  </TooltipContent>
                </Tooltip>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, name: true }));
                    setBlurCount((prev) => ({ ...prev, name: prev.name + 1 }));
                  }}
                  className={cn(
                    touched.name && !isNameValid && "border-destructive"
                  )}
                  data-cy={FooterDataAttributes.CODE_REVIEW_NAME_INPUT}
                />
              </div>

              <div className="space-y-2">
                <Tooltip
                  open={
                    touched.email && !isEmailValid
                      ? tooltipVisible.email || tooltipHovered.email
                      : undefined
                  }
                >
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="email"
                      onMouseEnter={() =>
                        setTooltipHovered((prev) => ({ ...prev, email: true }))
                      }
                      onMouseLeave={() =>
                        setTooltipHovered((prev) => ({ ...prev, email: false }))
                      }
                    >
                      Email *
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-destructive">
                    Please enter a valid email address
                  </TooltipContent>
                </Tooltip>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }));
                    setBlurCount((prev) => ({
                      ...prev,
                      email: prev.email + 1,
                    }));
                  }}
                  className={cn(
                    touched.email && !isEmailValid && "border-destructive"
                  )}
                  data-cy={FooterDataAttributes.CODE_REVIEW_EMAIL_INPUT}
                />
              </div>

              <div className="space-y-2">
                <Tooltip
                  open={
                    touched.message && !isMessageValid
                      ? tooltipVisible.message || tooltipHovered.message
                      : undefined
                  }
                >
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="message"
                      onMouseEnter={() =>
                        setTooltipHovered((prev) => ({
                          ...prev,
                          message: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setTooltipHovered((prev) => ({
                          ...prev,
                          message: false,
                        }))
                      }
                    >
                      Message *
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-destructive">
                    Please tell me about your project
                  </TooltipContent>
                </Tooltip>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, message: true }));
                    setBlurCount((prev) => ({
                      ...prev,
                      message: prev.message + 1,
                    }));
                  }}
                  className={cn(
                    touched.message && !isMessageValid && "border-destructive"
                  )}
                  data-cy={FooterDataAttributes.CODE_REVIEW_MESSAGE_INPUT}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  data-cy={FooterDataAttributes.CODE_REVIEW_CANCEL_BUTTON}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="highlight"
                  disabled={!isFormValid || isSubmitting}
                  data-cy={FooterDataAttributes.CODE_REVIEW_SUBMIT_BUTTON}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </TooltipProvider>
          </form>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
