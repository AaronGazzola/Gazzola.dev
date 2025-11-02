"use client";

import { getBackgroundStyle, useThemeStore } from "@/app/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { useQueryState } from "nuqs";
import { FooterDataAttributes } from "./Footer.types";

const Footer = () => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const [, setDialogOpen] = useQueryState("codeReview");

  const backgroundStyle = getBackgroundStyle(
    gradientColors,
    singleColor,
    gradientEnabled
  );

  return (
    <footer
      className={cn(
        "w-full h-6 flex items-center justify-center cursor-pointertransition-opacity flex-schrink-0 relative group hover:cursor-pointer"
      )}
      onClick={() => setDialogOpen("yesPlease")}
      data-cy={FooterDataAttributes.FOOTER}
    >
      <div className="absolute inset-0 z-0" style={backgroundStyle} />
      <div className="bg-black opacity-80 absolute inset-0 top-[1px] group-hover:opacity-40"></div>

      <p
        className="text-sm italic font-bold text-gray-200 relative z-10 group-hover:text-white "
        data-cy={FooterDataAttributes.FOOTER_TRIGGER}
      >
        Apply for a free code review
      </p>
    </footer>
  );
};

export default Footer;
