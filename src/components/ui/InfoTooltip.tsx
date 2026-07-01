// src/components/ui/InfoTooltip.tsx
"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: React.ReactNode;
  button?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

function useIsTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
}

export function InfoTooltip({
  content,
  side = "right",
  className,
  button,
}: InfoTooltipProps) {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);

  if (isTouch) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {button ?? (
            <button
              type="button"
              aria-label="More information"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="size-4" />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          side={side}
          className={`max-w-xs p-3 text-xs ${className}`}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button ?? (
            <button
              type="button"
              aria-label="More information"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="size-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className={`max-w-xs p-3 ${className}`}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
