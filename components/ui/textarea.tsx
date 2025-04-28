import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-4 py-3 shadow-xs transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        isFocused ? "min-h-[120px]" : "min-h-[40px]",
        className
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
}

export { Textarea };
