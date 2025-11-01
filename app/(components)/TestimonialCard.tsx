"use client";
import { useThemeStore } from "@/app/layout.stores";
import { Star } from "lucide-react";
import { Testimonial } from "./Header.types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { singleColor, gradientColors, gradientEnabled } = useThemeStore();

  const accentColor = gradientEnabled ? gradientColors[0] : singleColor;

  const truncateQuote = (quote: string, maxLength = 100) => {
    if (quote.length <= maxLength) return quote;
    return quote.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex-shrink-0 bg-black p-3 rounded-lg shadow shadow-gray-500 w-[320px] min-w-[320px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          <span className="font-bold" style={{ color: accentColor }}>
            {testimonial.rating}
          </span>
          <span className="text-gray-400 text-xs ml-2 truncate">
            {testimonial.dateRange}
          </span>
        </div>

        <div className="text-sm font-semibold line-clamp-2">
          {testimonial.title}
        </div>

        <div className="text-sm text-gray-400 line-clamp-3">
          {testimonial.quote}
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold" style={{ color: accentColor }}>
            {testimonial.amount}
            <sub className="text-xs text-gray-400">USD</sub>
          </span>
          <span className="text-xs text-gray-500 truncate">
            {testimonial.contractType}
            {testimonial.hourlyRate &&
              ` · ${testimonial.hourlyRate}/hr · ${testimonial.hours}h`}
          </span>
        </div>
      </div>
    </div>
  );
};
