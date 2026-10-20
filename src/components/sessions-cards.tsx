"use client";

import { Button } from "./ui/button";
import { formatVenueTime } from "@/lib/time/tz";
import { Session, Speaker } from "@/lib/airtable/types";
import { getWebPublishingStatus } from "@/lib/airtable/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StageBadge from "@/components/stage-badge";
import { Calendar, MessageCircle } from "@/components/ui/icons";
import { SectionHeading } from "@/components/section-heading";
import { useCallback } from "react";
import type * as React from "react";

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
      speakers?: Array<Speaker & { sessionRole?: "Moderator" | "Speaker" }>;
      currentSpeakerRole?: "Moderator" | "Speaker" | null;
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

  const getFormatDescription = useCallback((format?: string[] | null) => {
    if (!format || format.length === 0) {
      return null;
    }

    // Get the first format value and match it against the descriptions
    const formatValue = format[0];
    return FORMAT_DESCRIPTIONS[formatValue] ?? null;
  }, []);

  return (
    <section className="space-y-10" aria-labelledby="schedule-title">
      <SectionHeading eyebrow="Sessions" title="Your schedule" id="schedule-title" />
      {items.length === 0 && (
        <div className="border border-[#353535] bg-[#1e1e1e] p-6 text-[#a2a2a2]">
          Your sessions will appear here when the speaker team assigns them.
        </div>
      )}
      <div className="space-y-6">
        {items.map((session) => {
          const publishingStatusFlags = getPublishingStatusFlags(session);
          const sessionDuration = getSessionDuration(session);
          const formatDescription = getFormatDescription(session.format);
          const hasTime = Boolean(publishingStatusFlags?.hasTime);

          const facts: Array<{ label: string; value: React.ReactNode }> = [];
          if (hasTime && session.startTime)
            facts.push({ label: "Date", value: formatVenueTime(session.startTime, "MMM d") });
          if (hasTime && session.startTime && session.endTime) {
            facts.push({
              label: "Time",
              value: `${formatVenueTime(session.startTime, "HH:mm")} - ${formatVenueTime(session.endTime, "HH:mm")}`,
            });
          }
          if (hasTime && sessionDuration) facts.push({ label: "Duration", value: sessionDuration });
          facts.push({ label: "Stage", value: <StageBadge title={session.stage} /> });
          if (session.currentSpeakerRole) facts.push({ label: "Your role", value: session.currentSpeakerRole });

          return (
            <article key={session.id} className="border border-[#353535] bg-[#1e1e1e]">
              <div className="space-y-4 p-5 sm:p-8">
                {session.format && <p className="breakpoint-eyebrow text-[#a2a2a2]">{session.format}</p>}
                <h3 className="text-3xl leading-[1.1] tracking-[-0.05rem] text-white sm:text-4xl lg:text-[2.5rem]">
                  {session.name}
                </h3>
                {formatDescription && (
                  <p className="max-w-[48rem] text-base leading-[1.45] text-[#a2a2a2]">{formatDescription}</p>
                )}
              </div>

              <dl className="grid grid-cols-2 border-t border-[#353535] sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="space-y-2 border-r border-b border-[#353535] p-4 first:pl-5 last:border-r-0 sm:p-5 sm:first:pl-8"
                  >
                    <dt className="breakpoint-eyebrow text-xs text-[#a2a2a2]">{fact.label}</dt>
                    <dd className="text-base text-white">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="space-y-6 p-5 sm:p-8">
                {!hasTime && !session.greenlightTime && (
                  <StatusNote marker="bg-[#3c91ff]" label="Scheduling in progress" />
                )}
                {session.greenlightTime && !hasTime && (
                  <StatusNote marker="bg-[#aa67fb]" label="Planned window" text={session.greenlightTime} />
                )}
                {hasTime && (
                  <StatusNote
                    marker="bg-[#14f195]"
                    label="Check-in"
                    text="The speaker team will confirm your check-in time and location."
                  />
                )}

                {session.speakers && session.speakers.length > 0 && (
                  <div className="space-y-3">
                    <p className="breakpoint-eyebrow text-xs text-[#a2a2a2]">Participants</p>
                    <ul className="unstyled-list flex flex-wrap gap-2">
                      {session.speakers.map((speaker) => (
                        <li
                          key={speaker.id}
                          className="flex items-center gap-3 border border-[#353535] bg-black py-1.5 pr-3 pl-1.5"
                        >
                          <Avatar className="size-7 rounded-none">
                            <AvatarImage
                              src={speaker.imageUrl}
                              alt={`${speaker.firstName} ${speaker.lastName}`}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-none bg-[#353535] text-xs text-white">
                              {speaker.firstName?.charAt(0)}
                              {speaker.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-white">
                            {speaker.firstName} {speaker.lastName}
                          </span>
                          {speaker.sessionRole && (
                            <span className="breakpoint-eyebrow text-xs text-[#a2a2a2]">{speaker.sessionRole}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(hasTime || session.portalTelegramGroup) && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {hasTime && calendarUrl && (
                      <Button size="lg" asChild className="w-full sm:w-auto">
                        <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                          <Calendar aria-hidden="true" />
                          Add my sessions to calendar
                        </a>
                      </Button>
                    )}
                    {hasTime && allSessionsCalendarUrl && (
                      <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                        <a href={allSessionsCalendarUrl} target="_blank" rel="noopener noreferrer">
                          <Calendar aria-hidden="true" />
                          Add all sessions to calendar
                        </a>
                      </Button>
                    )}
                    {session.portalTelegramGroup && (
                      <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                        <a href={session.portalTelegramGroup} target="_blank" rel="noopener noreferrer">
                          <MessageCircle aria-hidden="true" />
                          Join speaker Telegram group
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StatusNote({ marker, label, text }: { marker: string; label: string; text?: string }) {
  return (
    <div className="flex items-start gap-3 border border-[#353535] bg-black p-4">
      <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 ${marker}`} />
      <p className="text-base leading-[1.4] text-white">
        <span className="breakpoint-eyebrow mr-3 text-xs text-[#a2a2a2]">{label}</span>
        {text}
      </p>
    </div>
  );
}
