import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/(0.08) bg-[#0a101f]/(0.7) text-zinc-100 backdrop-blur-md",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "hover:border-white/(0.15) hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-0.5",
        "will-change-transform",
        className
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex flex-col space-y-2 p-6 sm:p-8 pb-4", className)} 
      {...props} 
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-lg font-bold tracking-tight text-white/95 antialiased sm:text-xl",
        className
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-xs font-medium leading-relaxed text-zinc-400 sm:text-sm", className)} 
      {...props} 
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("p-6 sm:p-8 pt-0 text-zinc-300/90", className)} 
      {...props} 
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex items-center justify-between p-6 sm:p-8 pt-0 border-t border-white/[0.04] mt-4", className)} 
      {...props} 
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };