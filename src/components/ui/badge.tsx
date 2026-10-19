import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-0 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#aa67fb]/20 text-[#aa67fb]",
        secondary: "bg-white/10 text-white/60",
        destructive: "bg-red-500/20 text-red-400",
        outline: "bg-transparent border border-white/10 text-white/70 hover:bg-white/5",
        success: "bg-[#14f195]/20 text-[#14f195]",
        info: "bg-[#3c91ff]/20 text-[#3c91ff]",
        warning: "bg-[#c0e021]/20 text-[#c0e021]",
        cyan: "bg-[#3c91ff]/20 text-[#3c91ff]",
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
