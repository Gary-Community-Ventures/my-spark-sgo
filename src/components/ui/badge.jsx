import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F2D5E] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0F2D5E] text-white hover:bg-[#0F2D5E]/80",
        secondary:
          "border-transparent bg-[#F5A623] text-white hover:bg-[#F5A623]/80",
        success:
          "border-transparent bg-[#2E7D32] text-white hover:bg-[#2E7D32]/80",
        outline: "text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
