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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSubmitFeedback } from "./Sidebar.hooks";
import { FeedbackFormData, SidebarDataAttributes } from "./Sidebar.types";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDialog = ({
  open,
  onOpenChange,
}: FeedbackDialogProps) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    message: "",
  });

  const [touched, setTouched] = useState({
    message: false,
  });

  const [blurCount, setBlurCount] = useState({
    message: 0,
  });

  const [tooltipVisible, setTooltipVisible] = useState({
    message: false,
  });

  const [tooltipHovered, setTooltipHovered] = useState({
    message: false,
  });

  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(
    () => {
      onOpenChange(false);
      setFormData({
        message: "",
      });
      setTouched({
        message: false,
      });
      setBlurCount({
        message: 0,
      });
      setTooltipVisible({
        message: false,
      });
      setTooltipHovered({
        message: false,
      });
    }
  );

  const isMessageValid = formData.message.trim().length > 0;

  const isFormValid = isMessageValid;

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
      submitFeedback(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        data-cy={SidebarDataAttributes.FEEDBACK_DIALOG}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Feedback & Bug Reports
          </DialogTitle>
          <div className="text-base text-foreground space-y-2">
            <p>
              Found a bug or have suggestions for improvement? I&apos;d love to hear from you!
            </p>
            <p>
              Your feedback helps make this app better for everyone.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TooltipProvider>
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
                      Message
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-destructive">
                    Please describe your feedback or bug report
                  </TooltipContent>
                </Tooltip>
                <Textarea
                  id="message"
                  placeholder="Describe your feedback or bug report..."
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
                  data-cy={SidebarDataAttributes.FEEDBACK_MESSAGE_INPUT}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  data-cy={SidebarDataAttributes.FEEDBACK_CANCEL_BUTTON}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="highlight"
                  disabled={!isFormValid || isSubmitting}
                  data-cy={SidebarDataAttributes.FEEDBACK_SUBMIT_BUTTON}
                >
                  {isSubmitting ? "Sending..." : "Send Feedback"}
                </Button>
              </div>
            </TooltipProvider>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
