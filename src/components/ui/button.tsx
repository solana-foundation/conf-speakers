import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-space-grotesk font-semibold uppercase tracking-[0.05em] transition-all disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#9945ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  {
    variants: {
      variant: {
        default: "bg-[#9945ff] text-white shadow-xs hover:bg-[#9945ff]/90",
        destructive:
          "bg-red-500 text-white shadow-xs hover:bg-red-500/90",
        outline:
          "border border-white/10 bg-transparent shadow-xs hover:bg-white/5 hover:text-white",
        secondary: "bg-white/10 text-white shadow-xs hover:bg-white/15",
        ghost: "hover:bg-white/5 hover:text-white",
        link: "text-[#9945ff] underline-offset-4 hover:underline",
        mint: "bg-[#19fb9b] text-black shadow-xs hover:bg-[#19fb9b]/90",
        azure: "bg-[#2a88de] text-white shadow-xs hover:bg-[#2a88de]/90",
        lime: "bg-[#c9ff7c] text-black shadow-xs hover:bg-[#c9ff7c]/90",
        gradient:
          "text-black shadow-xs hover:opacity-90 bg-gradient-to-r from-[#9945ff] to-[#19fb9b]",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-7 has-[>svg]:px-5",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
