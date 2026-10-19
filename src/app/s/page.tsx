import { Metadata } from "next/types";
import { generateKey, isKeyValid, getTokenPayload } from "@/lib/sign.server";
import { notFound, redirect } from "next/navigation";
import { fetchSession, getCachedFormats, getCachedSpeaker, fetchSpeakers } from "@/lib/airtable/fetch";
import { parseFormatRecord, parseSessionRecord, parseSpeakerRecord } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsCards from "@/components/sessions-cards";
import { Speaker, StageTitle } from "@/lib/airtable/types";
import { getSessionCalendarHttpUrl, getSessionsCalendarUrl, getSpeakerCalendarUrl } from "@/lib/ics/utils";
// import { Gallery } from "@/components/gallery";
import LogisticsDialogButton from "@/components/speaker-portal/LogisticsDialogButton";
import ActionsChecklist from "@/components/speaker-portal/ActionsChecklist";
import SpeakerResourceLinks from "@/components/speaker-portal/SpeakerResourceLinks";
import { getSpeakerSessionIds, normalizeDeckStatus } from "@/lib/airtable/utils";
import { EVENT_DESCRIPTION, EVENT_NAME } from "@/lib/site";
import { EVENT_DATES_LABEL, EVENT_LOCATION } from "@/lib/site";
import Image from "next/image";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}): Promise<Metadata> => {
  const { key } = await searchParams;
  const payload = key ? getTokenPayload(key) : null;
  const speakerId = payload?.speakerId ?? "Unknown";

  return {
    title: `${EVENT_NAME} Speaker Portal`,
    description: `${EVENT_DESCRIPTION} Speaker reference: ${speakerId}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
};

export const revalidate = 600; // 10 minutes

const getSessionRole = (session: { moderatorIds?: string[]; speakerIds?: string[] }, speakerId: string) => {
  if (session.moderatorIds?.includes(speakerId)) {
    return "Moderator" as const;
  }

  if (session.speakerIds?.includes(speakerId)) {
    return "Speaker" as const;
  }

  return null;
};

export default async function SpeakerPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;

  if (!isKeyValid(key ?? null)) {
    redirect("email-link/?expired=1");
  }

  const payload = key ? getTokenPayload(key) : null;
  const speakerId = (payload?.speakerId as string | undefined) ?? null;

  if (!speakerId) {
    notFound();
  }

  const calendarKey = generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), "ics", speakerId);
  const speakerCalendarUrl = getSpeakerCalendarUrl(speakerId, calendarKey);

  // Generate all-sessions calendar URL (no speakerId filter)
  const allSessionsCalendarKey = generateKey(
    Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0),
    "ics",
    speakerId,
  );
  const allSessionsCalendarUrl = getSessionsCalendarUrl(allSessionsCalendarKey);

  // Fetch main speaker directly (cacheable - small payload)
  const speaker = await getCachedSpeaker(speakerId);
  const speakerData = parseSpeakerRecord(speaker);
  const speakerSessionIds = getSpeakerSessionIds(speaker);

  if (!speakerData) {
    notFound();
  }

  // Fetch all speakers for session mapping (uncached - payload exceeds 2MB cache limit)
  const speakers = await fetchSpeakers();
  const speakersData = speakers.map(parseSpeakerRecord);

  const sessions = await Promise.all(speakerSessionIds.map((sessionId) => fetchSession(sessionId)));
  const formats = await getCachedFormats();
  const formatLabels = new Map(
    formats.map((record) => {
      const parsed = parseFormatRecord(record);
      return [parsed.id, parsed.label];
    }),
  );
  const allSessionsData = sessions
    .map((session) => {
      const sessionData = parseSessionRecord(session);
      const participantIds = Array.from(
        new Set([...(sessionData.moderatorIds ?? []), ...(sessionData.speakerIds ?? [])]),
      );

      return {
        ...sessionData,
        subscribeUrl: getSessionCalendarHttpUrl(session.id, calendarKey),
        speakers: participantIds
          .map((id) => {
            const speaker = speakersData.find((item) => item.id === id);
            if (!speaker) {
              return null;
            }

            return {
              ...speaker,
              sessionRole: getSessionRole(sessionData, id),
            };
          })
          .filter(Boolean) as Array<Speaker & { sessionRole?: "Moderator" | "Speaker" }>,
        currentSpeakerRole: getSessionRole(sessionData, speakerId),
        format: sessionData.format?.map((formatId) => formatLabels.get(formatId)).filter(Boolean) as string[],
      };
    })
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

  // Prepare sessions data for ActionsChecklist
  const sessionsForChecklist = allSessionsData.map((session) => {
    return {
      id: session.id,
      name: session.name,
      actionsDeckReceived: normalizeDeckStatus(session.actionsDeckReceived ?? speakerData.actionsDeckReceived),
      greenlightTime: session.greenlightTime ?? speakerData.greenlightTime ?? null,
      webPublishingStatus: session.webPublishingStatus,
    };
  });

  return (
    <div className="min-h-screen bg-black font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 pb-20 sm:px-6 sm:pt-8">
        <section
          className="relative isolate overflow-hidden border border-white/20 bg-[#1e1e1e]"
          aria-labelledby="portal-heading"
        >
          <Image
            src="/breakpoint/speakers-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/25" />
          <div className="relative flex min-h-72 flex-col justify-between p-6 sm:min-h-80 sm:p-10">
            <span className="breakpoint-eyebrow text-[#14f195]">{EVENT_NAME} / Speaker access</span>
            <div>
              <h1
                id="portal-heading"
                className="breakpoint-display max-w-3xl text-4xl leading-[1.08] text-white sm:text-6xl"
              >
                Speaker briefing
              </h1>
              <div className="breakpoint-eyebrow mt-5 flex flex-wrap gap-x-6 gap-y-2 text-white/70">
                {EVENT_DATES_LABEL && <span>{EVENT_DATES_LABEL}</span>}
                {EVENT_LOCATION && <span>{EVENT_LOCATION}</span>}
              </div>
            </div>
          </div>
        </section>
        <SpeakerCard
          {...speakerData}
          sessions={sessionsForChecklist}
          dietaryStatus={speakerData.dietary}
          speakerCardUrl={speakerData.speakerCardUrl}
        />

        <div className="section-divider" />

        <SessionsCards
          items={allSessionsData}
          calendarUrl={speakerCalendarUrl}
          allSessionsCalendarUrl={allSessionsCalendarUrl}
        />

        <div className="flex gap-3">
          <LogisticsDialogButton
            stage={allSessionsData[0]?.stage}
            stages={Array.from(new Set(allSessionsData.map((s) => s.stage).filter(Boolean))) as StageTitle[]}
          />
        </div>

        <div className="section-divider" />

        <ActionsChecklist
          sessions={sessionsForChecklist}
          dietaryStatus={speakerData.dietary}
          slideDeckFile={speakerData.slideDeckFile}
          speakerTicketLink={speakerData.lumaTicketSpeaker}
          plusOneTicketLink={speakerData.lumaTicketPlusOne}
          invitationCode={speakerData.invitationCode}
          discountCode={speakerData.discountCode}
          mcInfo={speakerData.mcInfo}
          parkingTicketUrl={speakerData.parkingTicket}
          youtubeVideoUrl={speakerData.youtubeVideoUrl}
          speakerPhotoLink={speakerData.speakerPhotoLink}
        />

        <div className="section-divider" />

        <SpeakerResourceLinks />

        {/* <Separator />
        <PostEventSection /> */}
      </main>
    </div>
  );
}
