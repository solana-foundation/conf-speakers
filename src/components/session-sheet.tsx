"use client";

import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { formatVenueTime } from "@/lib/time/tz";
import { Speaker, StageTitle } from "@/lib/airtable/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge from "@/components/stage-badge";
import { Calendar, Clock } from "lucide-react";

export interface SessionSheetProps {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  stage?: StageTitle;
  subscribeUrl?: string;
  speakers?: Speaker[];
  children: React.ReactNode;
  format?: string;
  webPublishingStatus?: string;
}

export default function SessionSheet({
  name,
  description,
  startTime,
  endTime,
  duration,
  stage,
  subscribeUrl,
  speakers,
  children,
  format,
  webPublishingStatus,
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

          {/* Session Metadata */}
          <div className="mb-4 space-y-2">
            {/* Format */}
            {format && (
              <div className="mt-2">
                <span className="bg-primary rounded px-2 py-1 text-xs">{format}</span>
              </div>
            )}
            {startTime && (
              <p className="flex items-center gap-2 text-sm font-bold">
                <Calendar className="size-4" />
                <span className="text-foreground/50">{formatVenueTime(startTime, "MMM d")}</span>
                {endTime && (
                  <>
                    <Clock className="size-4" />
                    <span>
                      {formatVenueTime(startTime, "HH:mm")} - {formatVenueTime(endTime, "HH:mm")}
                    </span>
                  </>
                )}
              </p>
            )}
            {duration && (
              <p className="flex items-center gap-2 text-sm font-bold">
                <Clock className="size-4" />
                <span>{duration}</span>
              </p>
            )}
            <p className="mt-2">
              <StageBadge title={stage} />
            </p>

            {/* Web Publishing Status */}
            {webPublishingStatus && (
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Publishing Status:</span> {webPublishingStatus}
                </p>
              </div>
            )}
          </div>

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
        <SheetFooter className="flex flex-col gap-2">
          <div className="flex gap-2">
            {subscribeUrl && (
              <Button variant="mint" asChild>
                <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                  Subscribe to session
                </a>
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
