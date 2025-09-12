"use client";

import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/lib/state";

interface ScheduleSubscribeButtonProps {
  href: string;
}

export default function ScheduleSubscribeButton({ href }: ScheduleSubscribeButtonProps) {
  const { selectedSessions } = useGlobalState();

  if (selectedSessions.length === 0) {
    return (
      <Button variant="mint" asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          Subscribe to all sessions
        </a>
      </Button>
    );
  }

  return (
    <Button variant="mint" asChild>
      <a href={href + "&sessions=" + selectedSessions.join(",")} target="_blank" rel="noopener noreferrer">
        Subscribe to selected sessions
      </a>
    </Button>
  );
}
