import React from "react";
import { cn } from "../../lib/utils"; // Using relative path

const ShimmerButton = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "animate-shimmer inline-flex h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };