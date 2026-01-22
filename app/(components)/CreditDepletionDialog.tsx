"use client";

import { useThemeStore } from "@/app/layout.stores";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BotOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useSendCreditDepletionNotification } from "./CreditDepletionDialog.hooks";
import {
  CreditDepletionDataAttributes,
  CreditDepletionDialogProps,
} from "./CreditDepletionDialog.types";

export const CreditDepletionDialog = ({
  open,
  onOpenChange,
}: CreditDepletionDialogProps) => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const [emailSent, setEmailSent] = useState(false);

  const { mutate: sendNotification } = useSendCreditDepletionNotification(
    () => {
      setEmailSent(true);
    }
  );

  useEffect(() => {
    if (open && !emailSent) {
      sendNotification({ timestamp: new Date().toISOString() });
    }
  }, [open, emailSent, sendNotification]);

  const getIconStyle = () => {
    if (gradientEnabled) {
      return {
        background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    }
    return {
      color: singleColor,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        data-cy={CreditDepletionDataAttributes.DIALOG}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <BotOff className="h-16 w-16" style={getIconStyle()} />
          </div>
          <DialogTitle className="text-2xl text-center">
            Service Temporarily Unavailable
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 text-center">
          <p className="text-base text-gray-300">
            Gazzola.dev has become so popular that we&apos;ve temporarily run
            out of AI generation credits!
          </p>
          <p className="text-base text-gray-300">
            The good news: Az has been automatically notified and will refill
            the credits as soon as possible.
          </p>
          <p className="text-base text-gray-300">
            Thank you for your patience and for making this site so successful!
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            variant="highlight"
            onClick={() => onOpenChange(false)}
            className="w-full"
            data-cy={CreditDepletionDataAttributes.CLOSE_BUTTON}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
