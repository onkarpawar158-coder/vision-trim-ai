import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const gradientButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-brand text-primary-foreground shadow-glow hover:brightness-110 active:brightness-95",
        outline:
          "border border-border bg-surface/60 text-foreground hover:border-brand-cyan/50 hover:bg-surface-2",
        ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        danger: "bg-destructive/15 text-destructive hover:bg-destructive/25",
      },
      size: {
        sm: "h-9 px-3.5 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-13 px-7 text-base [&_svg]:size-5",
        icon: "h-10 w-10 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof gradientButtonVariants>;

export function GradientButton({ className, variant, size, ...props }: GradientButtonProps) {
  return <button className={cn(gradientButtonVariants({ variant, size }), className)} {...props} />;
}
