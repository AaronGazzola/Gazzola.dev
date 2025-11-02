"use client";
import { Star } from "lucide-react";
import { Testimonial } from "./Header.types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="flex-shrink-0 bg-black p-4 rounded-lg shadow shadow-gray-500 w-[320px] min-w-[320px] relative max-h-[calc(100vh-250px)] overflow-y-auto">
      <div className="flex flex-col gap-3 relative">
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 stroke-white fill-none" />
          ))}
        </div>

        <div className="text-sm text-white pb-6">{testimonial.quote}</div>

        <div className="absolute -bottom-2 right-4">
          <span className="text-sm text-white font-semibold">
            {testimonial.amount}
            <sub className="text-xs">USD</sub>
          </span>
        </div>
      </div>
    </div>
  );
};
