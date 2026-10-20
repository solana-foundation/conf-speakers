import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border border-[#353535] bg-black px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.07em] w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-white",
        secondary: "text-[#a2a2a2]",
        destructive: "text-red-400",
        outline: "text-[#c0c0c0] hover:bg-[#1e1e1e]",
        success: "text-[#14f195]",
        info: "text-[#3c91ff]",
        warning: "text-[#c0e021]",
        cyan: "text-[#3c91ff]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
