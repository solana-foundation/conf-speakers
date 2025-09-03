"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { formatVenueTime } from "@/lib/time/tz";

export interface SessionSheetProps {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  stage?: string;
  subscribeUrl?: string;
  children: React.ReactNode;
}

export default function SessionSheet({
  name,
  description,
  startTime,
  endTime,
  stage,
  subscribeUrl,
  children,
}: SessionSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>{children}</div>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <p className="mb-4">{description}</p>
          {startTime && <p className="text-foreground/50 text-sm font-bold">{formatVenueTime(startTime, "MMM d")}</p>}
          {startTime && endTime && (
            <p className="text-sm font-bold">
              {formatVenueTime(startTime, "HH:mm")} - {formatVenueTime(endTime, "HH:mm")}
            </p>
          )}
          <p className="mt-2">
            <Badge variant="default">{stage}</Badge>
          </p>
        </div>
        <SheetFooter>
          {subscribeUrl && (
            <Button asChild>
              <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                Subscribe on session
              </a>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
