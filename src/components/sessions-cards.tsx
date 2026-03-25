"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatVenueTime } from "@/lib/time/tz";
import { Session, Speaker } from "@/lib/airtable/types";
import { getWebPublishingStatus } from "@/lib/airtable/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge from "@/components/stage-badge";
import { Calendar, Clock, Users, AlertTriangle, Info, MessageCircle } from "lucide-react";
import { useCallback } from "react";

// TODO: check opening times for each day
const VENUE_OPENING_TIMES: Record<string, string> = {
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
    "It is a casual, joint exploration of your topic. The goal is to give attendees an insider look into the practitioners' view and share any news you are saving for the event.",
  "Fireside (15 min)":
    "It is a casual, joint exploration of your topic. The goal is to give attendees an insider look into the practitioners' view and share any news you are saving for the event.",
  "Fireside (20 min)":
    "It is a casual, joint exploration of your topic. The goal is to give attendees an insider look into the practitioners' view and share any news you are saving for the event.",
  "Keynote (10 min)":
    "For the keynote format, we prioritize speakers with ambitious goals and substantial undertakings. Use the opportunity to frame the problems still worth solving, not only the ones already solved. Vision statements about where the industry is headed are welcome.",
  "Keynote (15 min)":
    "For the keynote format, we prioritize speakers with ambitious goals and substantial undertakings. Use the opportunity to frame the problems still worth solving, not only the ones already solved. Vision statements about where the industry is headed are welcome.",
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
  allSessionsCalendarUrl?: string;
}

export default function SessionsCards({ items, calendarUrl, allSessionsCalendarUrl }: SessionsCardsProps) {
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
    (session: Session & { webPublishingStatus?: string[] }) => getWebPublishingStatus(session.webPublishingStatus),
    [],
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
      <h2 className="font-space-grotesk text-sm font-semibold uppercase tracking-[0.15em] text-white/60">Your Schedule</h2>
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
                className="overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-sm"
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
                      <h3 className="font-space-grotesk text-xl leading-tight font-light text-white">{session.name}</h3>
                      {/* Format Description */}
                      {formatDescription && (
                        <p className="text-sm leading-relaxed text-white/50">{formatDescription}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Greenlight Time Display */}
                  {!publishingStatusFlags?.hasTime && !session.greenlightTime && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#2a88de]/30 bg-[#2a88de]/10 px-3 py-2 text-sm">
                      <Info className="h-4 w-4 text-[#2a88de]" />
                      <span className="font-medium text-white">Scheduling in progress</span>
                    </div>
                  )}

                  {/* Greenlight Time Display */}
                  {session.greenlightTime && publishingStatusFlags?.hasDoNotPublish && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#c9ff7c]/30 bg-[#c9ff7c]/10 px-3 py-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-[#c9ff7c]" />
                      <span className="font-medium text-white">{session.greenlightTime}</span>
                    </div>
                  )}

                  {/* Arrival Time Alert */}
                  {publishingStatusFlags?.hasTime && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#19fb9b]/30 bg-[#19fb9b]/10 px-3 py-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-[#19fb9b]" />
                      <span className="font-medium text-white">
                        Please arrive 45 minutes before your session starts
                      </span>
                    </div>
                  )}

                  {/* Logistics */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
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
                      <div className="flex items-center gap-2 text-sm font-medium text-white/50">
                        <Users className="h-4 w-4" />
                        <span>Participants</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {session.speakers.map((speaker) => (
                          <div key={speaker.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={speaker.imageUrl} alt={`${speaker.firstName} ${speaker.lastName}`} />
                              <AvatarFallback className="bg-white/10 text-xs font-semibold text-white">
                                {speaker.firstName?.charAt(0)}
                                {speaker.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-white/80">
                              {speaker.firstName} {speaker.lastName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calendar Buttons */}
                  {(publishingStatusFlags?.hasTime || session.portalTelegramGroup) && (
                    <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                      {publishingStatusFlags?.hasTime && calendarUrl && (
                        <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                          <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                            <Calendar className="mr-2 h-4 w-4" />+ Add My Sessions to Calendar
                          </a>
                        </Button>
                      )}

                      {publishingStatusFlags?.hasTime && allSessionsCalendarUrl && (
                        <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                          <a href={allSessionsCalendarUrl} target="_blank" rel="noopener noreferrer">
                            <Calendar className="mr-2 h-4 w-4" />+ Add All Sessions to Calendar
                          </a>
                        </Button>
                      )}

                      {session.portalTelegramGroup && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-[#2a88de]/30 text-[#2a88de] hover:bg-[#2a88de]/10 w-full sm:w-auto"
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
