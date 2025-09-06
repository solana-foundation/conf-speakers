"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { formatVenueTime } from "@/lib/time/tz";
import { Speaker } from "@/lib/airtable/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getStageBadgeClass } from "@/lib/stage";

export interface SessionSheetProps {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  stage?: string;
  subscribeUrl?: string;
  speakers?: Speaker[];
  children: React.ReactNode;
}

export default function SessionSheet({
  name,
  description,
  startTime,
  endTime,
  stage,
  subscribeUrl,
  speakers,
  children,
}: SessionSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>{children}</div>
      </SheetTrigger>
      <SheetContent side="right" aria-describedby={undefined}>
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
            <Badge variant="default" className={getStageBadgeClass(stage as string)}>
              {stage}
            </Badge>
          </p>

          {speakers && (
            <div className="mt-4 text-sm">
              <div className="text-foreground/50 font-bold">Speakers:</div>
              {speakers.map((speaker) => (
                <div key={speaker.id} className="mt-1 flex items-center gap-2">
                  <Avatar className="size-4">
                    <AvatarImage src={speaker.imageUrl} alt={`${speaker.firstName} ${speaker.lastName}`} />
                    <AvatarFallback className="text-xs font-semibold">
                      {speaker.firstName?.charAt(0)}
                      {speaker.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {speaker.firstName} {speaker.lastName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <SheetFooter>
          {subscribeUrl && (
            <Button asChild>
              <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                Subscribe to session
              </a>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
