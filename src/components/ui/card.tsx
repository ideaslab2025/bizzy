
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    glass?: boolean;
    professional?: boolean;
  }
>(({ className, glass = false, professional = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-lg transition-all duration-300 touch-manipulation",
      glass && "card-glass-hover",
      professional && "card-professional-hover",
      !professional && "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    professional?: boolean;
  }
>(({ className, professional = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3",
      professional ? "p-6 md:p-8" : "p-5 md:p-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    professional?: boolean;
  }
>(({ className, professional = true, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      professional 
        ? "text-xl md:text-2xl font-bold leading-tight tracking-tight text-black"
        : "text-lg md:text-xl lg:text-2xl font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    professional?: boolean;
  }
>(({ className, professional = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      professional 
        ? "text-base leading-relaxed text-gray-600"
        : "text-base text-muted-foreground leading-relaxed",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    professional?: boolean;
  }
>(({ className, professional = true, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      professional ? "p-6 md:p-8 pt-0" : "p-5 md:p-6 pt-0",
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    professional?: boolean;
  }
>(({ className, professional = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-4",
      professional ? "p-6 md:p-8 pt-0" : "p-5 md:p-6 pt-0 gap-3",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
