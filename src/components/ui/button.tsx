import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-none font-mono text-sm font-bold uppercase tracking-[0.07em] transition-colors disabled:cursor-not-allowed disabled:bg-[#4e4e4e] disabled:text-[#dfdfdf] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-[#c0c0c0]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-white bg-transparent text-white hover:bg-[#353535]",
        secondary: "border border-[#353535] bg-[#1e1e1e] text-white hover:bg-[#353535]",
        ghost: "text-white hover:bg-[#353535]",
        link: "text-white underline-offset-4 hover:text-[#c0c0c0] hover:underline",
        mint: "bg-white text-black hover:bg-[#c0c0c0]",
        azure: "bg-white text-black hover:bg-[#c0c0c0]",
        lime: "bg-white text-black hover:bg-[#c0c0c0]",
        gradient: "bg-white text-black hover:bg-[#c0c0c0]",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 px-7 has-[>svg]:px-5",
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
