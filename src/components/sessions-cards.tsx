"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatVenueTime } from "@/lib/time/tz";
import { Session, Speaker } from "@/lib/airtable/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge, { StageTitle } from "@/components/stage-badge";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";
import SessionSheet from "./session-sheet";
import { EyeIcon } from "lucide-react";

export interface SessionsCardsProps {
  items: (Session & { subscribeUrl?: string; speakers?: Speaker[] })[];
  allSessionsSubscribeUrl?: string;
  calendarUrl?: string;
}

export default function SessionsCards({ items, allSessionsSubscribeUrl, calendarUrl }: SessionsCardsProps) {
  // Determine session format based on speaker count and other factors
  const getSessionFormat = (session: Session & { speakers?: Speaker[] }) => {
    const speakerCount = session.speakers?.length || 0;
    if (speakerCount === 1) return "Keynote";
    if (speakerCount === 2) return "Panel";
    if (speakerCount > 2) return "Debate";
    return "Session";
  };

  // Check if time is TBD (within a window)
  const isTimeTBD = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return true;

    // Parse times and check if there's a significant gap (indicating TBD)
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = end.getTime() - start.getTime();

    // If duration is more than 3 hours, consider it TBD
    return duration > 3 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-6">
      {/* Sessions Cards */}
      <div className="space-y-4">
        {items.map((session) => (
          <Card key={session.id} className="border-border/50 bg-card/50 overflow-hidden border backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  {/* Format Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getSessionFormat(session)}
                    </Badge>
                  </div>
                  {/* Session Title */}
                  <h3 className="text-xl leading-tight font-bold">{session.name}</h3>
                </div>

                {/* View Details Button */}
                <SessionSheet
                  name={session.name}
                  description={session.description}
                  startTime={session.startTime}
                  endTime={session.endTime}
                  stage={session.stage}
                  subscribeUrl={session.subscribeUrl}
                  speakers={session.speakers}
                >
                  <Button variant="outline" size="sm" className="shrink-0">
                    <EyeIcon className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">View Details</span>
                  </Button>
                </SessionSheet>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
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

                <div className="flex items-center gap-1">
                  <StageBadge title={session.stage as StageTitle} />
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

              {/* Time TBD Warning */}
              {isTimeTBD(session.startTime, session.endTime) && (
                <div className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Time TBD (11:00-14:00 window)</span>
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
