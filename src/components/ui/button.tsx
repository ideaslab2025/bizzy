
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useHapticFeedback } from "@/utils/hapticFeedback"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 active:scale-95 transition-transform",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 active:scale-95 transition-transform",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 active:scale-95 transition-transform",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 active:scale-95 transition-transform",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white active:scale-95 transition-transform",
        link: "text-primary underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-11 px-5 py-3 min-h-[44px]", // Increased for better touch targets
        sm: "h-10 rounded-md px-4 min-h-[40px]", // Increased minimum height
        lg: "h-12 rounded-md px-8 min-h-[48px]", // Larger for mobile
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]", // Better touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  hapticFeedback?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, hapticFeedback = true, onClick, ...props }, ref) => {
    const { trigger } = useHapticFeedback();
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hapticFeedback) {
        if (variant === 'destructive') {
          trigger('warning');
        } else {
          trigger('light');
        }
      }
      onClick?.(e);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
