import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-none border border-[#353535] bg-black px-3 py-1 text-base text-white transition-colors outline-none selection:bg-[#aa67fb]/30 selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-[#858585] focus:border-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-white focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white",
        "aria-invalid:border-red-500 aria-invalid:outline-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
