"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatVenueTime } from "@/lib/time/tz";
import { Session, Speaker } from "@/lib/airtable/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge from "@/components/stage-badge";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";

export interface SessionsCardsProps {
  items: (Session & { subscribeUrl?: string; speakers?: Speaker[]; format?: string[]; greenlightTime?: string })[];
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

  return (
    <div className="space-y-6">
      {/* Sessions Cards */}
      <div className="space-y-4">
        {items.map((session) => (
          <Card key={session.id} className="border-stroke-secondary bg-card/40 overflow-hidden border backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  {/* Format Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {session.format}
                    </Badge>
                  </div>
                  {/* Session Title */}
                  <h3 className="text-xl leading-tight font-bold">{session.name}</h3>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Greenlight Time Display */}
              {session.greenlightTime && (
                <div className="border-lime bg-lime/10 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <AlertTriangle className="text-lime h-4 w-4" />
                  <span className="font-medium text-white">{session.greenlightTime}</span>
                </div>
              )}

              {/* Logistics */}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
