import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-0 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#9945ff]/20 text-[#9945ff]",
        secondary: "bg-white/10 text-white/60",
        destructive: "bg-red-500/20 text-red-400",
        outline: "bg-transparent border border-white/10 text-white/70 hover:bg-white/5",
        success: "bg-[#19fb9b]/20 text-[#19fb9b]",
        info: "bg-[#2a88de]/20 text-[#2a88de]",
        warning: "bg-[#c9ff7c]/20 text-[#c9ff7c]",
        cyan: "bg-[#00d4ff]/20 text-[#00d4ff]",
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
