"use client";

import { useThemeStore } from "@/app/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { useState } from "react";
import { CodeReviewDialog } from "./CodeReviewDialog";
import { FooterDataAttributes } from "./Footer.types";

const Footer = () => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  const getBorderStyle = () => {
    if (gradientEnabled) {
      return {
        borderImage: `linear-gradient(to right, ${gradientColors.join(", ")}) 1`,
      };
    }
    return {
      borderColor: singleColor,
    };
  };

  return (
    <>
      <footer
        className={cn(
          "w-full h-10 border-t flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        )}
        style={getBorderStyle()}
        onClick={() => setDialogOpen(true)}
        data-cy={FooterDataAttributes.FOOTER}
      >
        <p
          className="text-sm text-muted-foreground"
          data-cy={FooterDataAttributes.FOOTER_TRIGGER}
        >
          Apply for a free code review and test results
        </p>
      </footer>
      <CodeReviewDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default Footer;
