"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatVenueTime } from "@/lib/time/tz";
import { Session, Speaker, StageValues } from "@/lib/airtable/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge from "@/components/stage-badge";
import { Calendar, Clock, Users, AlertTriangle, Info } from "lucide-react";
import { useCallback } from "react";

export interface SessionsCardsProps {
  items: Array<
    Session & {
      subscribeUrl?: string;
      speakers?: Speaker[];
      format?: string[] | null;
      greenlightTime?: string | null;
      webPublishingStatus?: string[] | null;
    }
  >;
  calendarUrl?: string;
}

export default function SessionsCards({ items, calendarUrl }: SessionsCardsProps) {
  // Get duration from calculated times
  const getSessionDuration = (session: Session & { speakers?: Speaker[] }) => {
    if (session.startTime && session.endTime) {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const durationMs = end.getTime() - start.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      return `${durationMinutes} min`;
    }

    return null;
  };

  // Get publishing status display info
  const getPublishingStatusFlags = useCallback(
    (session: Session & { webPublishingStatus?: string[] }) => {
      if (!session.webPublishingStatus || session.webPublishingStatus.length === 0) {
        return null;
      }

      const flags = session.webPublishingStatus;
      const hasTime = flags.includes("Time");
      const hasTitle = flags.includes("Title");
      const hasDescription = flags.includes("Description");
      const hasSpeaker = flags.includes("Speaker");
      const hasDoNotPublish = flags.includes("Do not publish");

      return {
        hasTime,
        hasTitle,
        hasDescription,
        hasSpeaker,
        hasDoNotPublish,
      };
    },
    [items],
  );

  return (
    <>
      <h2 className="text-h5 uppercase">Your Schedule</h2>
      <div className="space-y-6">
        {/* Sessions Cards */}
        <div className="space-y-4">
          {items.map((session) => (
            <Card
              key={session.id}
              className="border-stroke-secondary bg-card/40 overflow-hidden border backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Format Badge */}
                    {getPublishingStatusFlags(session)?.hasTime && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {session.format}
                        </Badge>
                      </div>
                    )}
                    {/* Session Title */}
                    <h3 className="text-xl leading-tight font-bold">{session.name}</h3>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Greenlight Time Display */}
                {!getPublishingStatusFlags(session)?.hasTime && !session.greenlightTime && (
                  <div className="border-azure bg-azure/10 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Info className="text-azure h-4 w-4" />
                    <span className="font-medium text-white">Scheduling in progress</span>
                  </div>
                )}

                {/* Greenlight Time Display */}
                {session.greenlightTime && (
                  <div className="border-lime bg-lime/10 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <AlertTriangle className="text-lime h-4 w-4" />
                    <span className="font-medium text-white">{session.greenlightTime}</span>
                  </div>
                )}

                {/* Arrival Time Alert */}
                {getPublishingStatusFlags(session)?.hasTime && (
                  <div className="border-mint bg-mint/10 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <AlertTriangle className="text-mint h-4 w-4" />
                    <span className="font-medium text-white">
                      Please arrive {session.stage === StageValues.Main ? "45 minutes" : "30 minutes"} before your
                      session starts
                    </span>
                  </div>
                )}

                {/* Logistics */}
                {getPublishingStatusFlags(session)?.hasTime && (
                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    {session.startTime && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatVenueTime(session.startTime, "MMM d")}</span>
                      </div>
                    )}

                    {session.startTime && session.endTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatVenueTime(session.startTime, "HH:mm")} - {formatVenueTime(session.endTime, "HH:mm")}
                        </span>
                      </div>
                    )}

                    {getSessionDuration(session) && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getSessionDuration(session)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <StageBadge title={session.stage} />
                    </div>
                  </div>
                )}

                {/* Participants */}
                {session.speakers && session.speakers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4" />
                      <span>Participants</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {session.speakers.map((speaker) => (
                        <div key={speaker.id} className="bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={speaker.imageUrl} alt={`${speaker.firstName} ${speaker.lastName}`} />
                            <AvatarFallback className="text-xs font-semibold">
                              {speaker.firstName?.charAt(0)}
                              {speaker.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {speaker.firstName} {speaker.lastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calendar Buttons */}
                {getPublishingStatusFlags(session)?.hasTime && (
                  <div className="flex gap-2 pt-2">
                    {/* Primary CTA Button - Add My Sessions to Calendar */}
                    {calendarUrl && (
                      <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                        <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                          <Calendar className="mr-2 h-4 w-4" />+ Add My Sessions to Calendar
                        </a>
                      </Button>
                    )}

                    {/* Keep existing subscribe button as secondary option */}
                    {session.subscribeUrl && (
                      <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                        <a href={session.subscribeUrl} target="_blank" rel="noopener noreferrer">
                          <Calendar className="mr-2 h-4 w-4" />+ Add All BP25 Sessions to Calendar
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
