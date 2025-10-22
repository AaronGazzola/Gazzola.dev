"use client";

import { getBackgroundStyle, useThemeStore } from "@/app/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { useState } from "react";
import { CodeReviewDialog } from "./CodeReviewDialog";
import { FooterDataAttributes } from "./Footer.types";

const Footer = () => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  const backgroundStyle = getBackgroundStyle(
    gradientColors,
    singleColor,
    gradientEnabled
  );

  return (
    <>
      <footer
        className={cn(
          "w-full h-6 flex items-center justify-center cursor-pointertransition-opacity flex-schrink-0 relative group hover:cursor-pointer"
        )}
        onClick={() => setDialogOpen(true)}
        data-cy={FooterDataAttributes.FOOTER}
      >
        <div
          className="absolute group-hover:opacity-60 opacity-20 inset-0 z-0"
          style={backgroundStyle}
        />

        <p
          className="text-sm italic font-bold text-primary-foreground relative z-10  "
          data-cy={FooterDataAttributes.FOOTER_TRIGGER}
        >
          Need a code review?
        </p>
      </footer>
      <CodeReviewDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default Footer;
