"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all duration-1000 ease-out transform ${
        isIntersecting
          ? "opacity-100 blur-0 translate-y-0"
          : "opacity-0 blur-md translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
