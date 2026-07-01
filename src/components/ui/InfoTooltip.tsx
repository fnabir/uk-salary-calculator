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

function useIsTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
}

function useIsSmallScreen() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function InfoTooltip({
  content,
  side = "right",
  className,
  button,
}: InfoTooltipProps) {
  const isTouch = useIsTouch();
  const isSmallScreen = useIsSmallScreen();
  const [open, setOpen] = useState(false);
  const resolvedSide = isTouch || isSmallScreen ? "bottom" : side;

  const trigger = button ?? (
    <button
      type="button"
      aria-label="More information"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <Info className="size-4" />
    </button>
  );

  if (isTouch) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={resolvedSide}
          align="start"
          alignOffset={-8}
          avoidCollisions
          sticky="partial"
          collisionPadding={12}
          className={`w-[min(260px,calc(100vw-32px))] p-3 text-xs ${className}`}
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
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent
          side={resolvedSide}
          align="start"
          alignOffset={-8}
          avoidCollisions
          sticky="partial"
          collisionPadding={12}
          className={`w-[min(280px,calc(100vw-48px))] p-3 ${className}`}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
