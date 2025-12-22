"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const [formData, setFormData] = useState<CodeReviewFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState({
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
      });
      setTouched({
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
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            AI-Generated Web App Quality Assurance
          </DialogTitle>
          <div className="text-base text-foreground space-y-2">
            <p>Comprehensive Quality Assurance services:</p>
            <ul className="list-disc list-inside">
              <li>Code Review</li>
              <li>Automated Testing</li>
              <li>Migration Validation</li>
              <li>Seed Script Generation</li>
              <li>Functional Verification</li>
            </ul>
            <p>With detailed progress reports at every stage.</p>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                className={cn(touched.name && !isNameValid && "border-red-500")}
                data-cy={FooterDataAttributes.CODE_REVIEW_NAME_INPUT}
              />
              {touched.name && !isNameValid && (
                <p className="text-sm text-red-500">Please enter your name</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                className={cn(
                  touched.email && !isEmailValid && "border-red-500"
                )}
                data-cy={FooterDataAttributes.CODE_REVIEW_EMAIL_INPUT}
              />
              {touched.email && !isEmailValid && (
                <p className="text-sm text-red-500">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell me about your project..."
                rows={4}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, message: true }))
                }
                className={cn(
                  touched.message && !isMessageValid && "border-red-500"
                )}
                data-cy={FooterDataAttributes.CODE_REVIEW_MESSAGE_INPUT}
              />
              {touched.message && !isMessageValid && (
                <p className="text-sm text-red-500">
                  Please tell me about your project
                </p>
              )}
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
