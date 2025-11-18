"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatVenueTime } from "@/lib/time/tz";
import { Session, Speaker } from "@/lib/airtable/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge from "@/components/stage-badge";
import { Calendar, Clock, Users, AlertTriangle, Info, MessageCircle } from "lucide-react";
import { useCallback } from "react";

// TODO: check opening times for each day
const VENUE_OPENING_TIMES: Record<string, string> = {
  "Nov 16": "Doors open 9am",
  "Dec 11": "Doors open 9:30am",
  "Dec 12": "Doors open 10am",
  "Dec 13": "Doors open 10am",
};

const FORMAT_DESCRIPTIONS: Record<string, string> = {
  "Debate (20 min)":
    "A fast-paced, parliamentary-style debate between two teams of two. Expect sharp arguments, surprising alliances, and real conviction as experts challenge each other's assumptions onstage. The goal is to surface tension, test ideas in public, and leave the audience thinking differently about where the industry is headed.",
  "Debate (30 min)":
    "A fast-paced, parliamentary-style debate between two teams of two. Expect sharp arguments, surprising alliances, and real conviction as experts challenge each other's assumptions onstage. The goal is to surface tension, test ideas in public, and leave the audience thinking differently about where the industry is headed.",
  "Fireside (10 min)":
    "It is a casual, joint exploration of your topic. The goal is to give attendees an insider look into the practitioners' view – and share any news you are saving for Breakpoint.",
  "Fireside (15 min)":
    "It is a casual, joint exploration of your topic. The goal is to give attendees an insider look into the practitioners' view – and share any news you are saving for Breakpoint.",
  "Fireside (20 min)":
    "It is a casual, joint exploration of your topic. The goal is to give attendees an insider look into the practitioners' view – and share any news you are saving for Breakpoint.",
  "Keynote (10 min)":
    "For the Keynote format, we have prioritized speakers with lofty goals and ambitious undertakings. Breakpoint is an opportunity to set the stage for not just your own company, but the hundreds to come—use the chance to convey the problems to be overcome rather than just the problems you've already solved. Vision statements on the future of the crypto industry are welcome (and recommended).",
  "Keynote (15 min)":
    "For the Keynote format, we have prioritized speakers with lofty goals and ambitious undertakings. Breakpoint is an opportunity to set the stage for not just your own company, but the hundreds to come—use the chance to convey the problems to be overcome rather than just the problems you've already solved. Vision statements on the future of the crypto industry are welcome (and recommended).",
  "Product Keynote (5 min)":
    "For the Product Keynotes, we have prioritized teams that are launching new products. Our goal is to showcase the flourish of Solana's application layer or developer resources that helps build a thriving application layer. Accordingly, we ask that you keep your presentation product-centric. In other words, please show, don't tell. Product demos are preferable.",
  "Product Keynote (7 min)":
    "For the Product Keynotes, we have prioritized teams that are launching new products. Our goal is to showcase the flourish of Solana's application layer or developer resources that helps build a thriving application layer. Accordingly, we ask that you keep your presentation product-centric. In other words, please show, don't tell. Product demos are preferable.",
  "Reacts (20 min)":
    "A guided fireside chat built around live prompts – tweets, charts, and headlines projected on screen. The interviewer reacts to each visual in real time, using it to spark conversation and deeper reflection.",
};

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

  const getDoorsOpenTime = useCallback((session: Session & { startTime?: Session["startTime"] }) => {
    if (!session.startTime) {
      return null;
    }

    const dateKey = formatVenueTime(session.startTime, "MMM d");

    return VENUE_OPENING_TIMES[dateKey] ?? null;
  }, []);

  const getFormatDescription = useCallback((format?: string[] | null) => {
    if (!format || format.length === 0) {
      return null;
    }

    // Get the first format value and match it against the descriptions
    const formatValue = format[0];
    return FORMAT_DESCRIPTIONS[formatValue] ?? null;
  }, []);

  return (
    <>
      <h2 className="text-h5 uppercase">Your Schedule</h2>
      <div className="space-y-6">
        {/* Sessions Cards */}
        <div className="space-y-4">
          {items.map((session) => {
            const publishingStatusFlags = getPublishingStatusFlags(session);
            const sessionDuration = getSessionDuration(session);
            const doorsOpenTime = getDoorsOpenTime(session);
            const formatDescription = getFormatDescription(session.format);

            return (
              <Card
                key={session.id}
                className="border-stroke-secondary bg-card/40 overflow-hidden border backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Format Badge */}
                      {session.format && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {session.format}
                          </Badge>
                        </div>
                      )}
                      {/* Session Title */}
                      <h3 className="text-xl leading-tight font-bold">{session.name}</h3>
                      {/* Format Description */}
                      {formatDescription && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{formatDescription}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Greenlight Time Display */}
                  {!publishingStatusFlags?.hasTime && !session.greenlightTime && (
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
                  {publishingStatusFlags?.hasTime && (
                    <div className="border-mint bg-mint/10 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <AlertTriangle className="text-mint h-4 w-4" />
                      <span className="font-medium text-white">
                        Please arrive 45 minutes before your session starts
                      </span>
                    </div>
                  )}

                  {/* Logistics */}
                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    {publishingStatusFlags?.hasTime && (
                      <>
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
                              {formatVenueTime(session.startTime, "HH:mm")} -{" "}
                              {formatVenueTime(session.endTime, "HH:mm")}
                            </span>
                          </div>
                        )}

                        {sessionDuration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {sessionDuration}
                              {doorsOpenTime ? ` - ${doorsOpenTime}` : ""}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-1">
                      stage: <StageBadge title={session.stage} />
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
                  {publishingStatusFlags?.hasTime && (
                    <div className="flex flex-col gap-2 pt-2 sm:flex-row">
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

                      {/* Session Telegram Group */}
                      {session.portalTelegramGroup && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-azure text-azure hover:bg-azure/10 hover:text-azure w-full sm:w-auto"
                        >
                          <a href={session.portalTelegramGroup} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Join Speaker Telegram Group
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
