"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGlobalState } from "@/lib/state";
import { Copy, Check } from "lucide-react";

interface ScheduleSubscribeButtonProps {
  href: string;
}

export default function ScheduleSubscribeButton({ href }: ScheduleSubscribeButtonProps) {
  const { selectedSessions } = useGlobalState();
  const [copied, setCopied] = useState(false);

  const currentHref = selectedSessions.length === 0 ? href : href + "&sessions=" + selectedSessions.join(",");
  const buttonText = selectedSessions.length === 0 ? "Subscribe to all sessions" : "Subscribe to selected sessions";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentHref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="mint" asChild>
        <a href={currentHref} target="_blank" rel="noopener noreferrer">
          {buttonText}
        </a>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="mint" size="icon" onClick={handleCopy} aria-label="Copy link">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
