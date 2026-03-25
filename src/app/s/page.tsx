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
import { getSpeakerSessionIds, normalizeDeckStatus } from "@/lib/airtable/utils";
import { EVENT_DESCRIPTION, EVENT_NAME } from "@/lib/site";

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
  const allSessionsCalendarKey = generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), "ics");
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
  const formatLabels = new Map(formats.map((record) => {
    const parsed = parseFormatRecord(record);
    return [parsed.id, parsed.label];
  }));
  const allSessionsData = sessions
    .map((session) => {
      const sessionData = parseSessionRecord(session);
      return {
        ...sessionData,
        subscribeUrl: getSessionCalendarHttpUrl(session.id, calendarKey),
        speakers: sessionData.speakerIds
          ?.map((id) => speakersData.find((item) => item.id === id))
          .filter(Boolean) as Speaker[],
        format: sessionData.format
          ?.map((formatId) => formatLabels.get(formatId))
          .filter(Boolean) as string[],
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
    <div className="min-h-screen bg-black p-8 font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-10">
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
          speakerPermitApproval={speakerData.speakerPermitApproval}
          slideDeckFile={speakerData.slideDeckFile}
          speakerTicketLink={speakerData.lumaTicketSpeaker}
          plusOneTicketLink={speakerData.invitationCode}
          discountCode={speakerData.discountCode}
          mcInfo={speakerData.mcInfo}
          parkingTicketUrl={speakerData.parkingTicket}
          youtubeVideoUrl={speakerData.youtubeVideoUrl}
          speakerPhotoLink={speakerData.speakerPhotoLink}
        />

        {/* <Separator />
        <PostEventSection /> */}
      </main>
    </div>
  );
}
