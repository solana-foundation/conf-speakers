import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { generateKey, isKeyValid, getTokenPayload } from "@/lib/sign.server";
import { notFound, redirect } from "next/navigation";
import { getCachedFormats, getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsCards from "@/components/sessions-cards";
import { Speaker, StageTitle } from "@/lib/airtable/types";
import { getSessionCalendarHttpUrl, getSessionsCalendarUrl } from "@/lib/ics/utils";
// import { Gallery } from "@/components/gallery";
import LogisticsDialogButton from "@/components/speaker-portal/LogisticsDialogButton";
import ActionsChecklist from "@/components/speaker-portal/ActionsChecklist";
import TicketsSection from "@/components/speaker-portal/TicketsSection";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}): Promise<Metadata> => {
  const { key } = await searchParams;
  const payload = key ? getTokenPayload(key) : null;
  const speakerId = payload?.speakerId ?? "Unknown";

  return {
    title: `Breakpoint 2025 Speaker ${speakerId}`,
    description: `Detailed information about the speaker ${speakerId} of the Breakpoint conference`,
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
  const speakerCalendarUrl = getSessionsCalendarUrl(calendarKey);

  const speakers = await getCachedSpeakers();
  const speakersData = speakers.map((item) => SpeakerFieldsSchema.parse(item));
  const speakerData = speakersData.find((item) => item.id === speakerId);

  if (!speakerData) {
    notFound();
  }

  const sessions = await getCachedSessions({ speakerName: speakerData._name });
  const formats = await getCachedFormats();
  const allSessionsData = sessions.map((session) => {
    const sessionData = SessionFieldsSchema.parse(session);
    return {
      ...sessionData,
      subscribeUrl: getSessionCalendarHttpUrl(session.id, calendarKey),
      speakers: sessionData.speakerIds
        ?.map((id) => speakersData.find((item) => item.id === id))
        .filter(Boolean) as Speaker[],
      format: sessionData.format
        ?.map((formatId) => formats.find((item) => item.id === formatId)?.fields["Format"])
        .filter(Boolean) as string[],
    };
  });

  // Filter sessions based on webPublishingStatus
  // Show only if all 4 flags (Time, Title, Description, Speaker) are present and "Do not publish" is not present
  const sessionsData = allSessionsData.filter((session) => {
    const status = session.webPublishingStatus;
    if (!status) return false;

    const hasDoNotPublish = status.includes("Do not publish");
    const hasTime = status.includes("Time");
    const hasTitle = status.includes("Title");
    const hasDescription = status.includes("Description");
    const hasSpeaker = status.includes("Speaker");

    // Show if has all 4 flags and not "Do not publish"
    return hasTime && hasTitle && hasDescription && hasSpeaker && !hasDoNotPublish;
  });

  // Prepare sessions data for ActionsChecklist
  const sessionsForChecklist = sessionsData.map((session) => ({
    id: session.id,
    name: session.name,
    deckUrl: session.slideDeckUrl,
    deckStatus: session.slideDeckUrl ? "Completed" : undefined,
    greenlightTime: session.greenlightTime,
  }));

  // Extract telegram groups from sessions
  const sessionTelegramGroups = sessionsData
    .filter((session) => session.portalTelegramGroup)
    .map((session) => ({
      sessionName: session.name,
      telegramGroup: session.portalTelegramGroup!,
    }));

  return (
    <div className="min-h-screen p-8 font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <SpeakerCard {...speakerData} sessions={sessionsForChecklist} dietaryStatus={speakerData.dietary} />

        <Separator />

        <SessionsCards items={sessionsData} calendarUrl={speakerCalendarUrl} />

        {sessionsData.length > 0 && (
          <div className="flex gap-3">
            <LogisticsDialogButton
              stage={sessionsData[0]?.stage || "Main Stage"}
              stages={Array.from(new Set(sessionsData.map((s) => s.stage).filter(Boolean))) as StageTitle[]}
            />
          </div>
        )}

        <Separator />

        <ActionsChecklist
          sessions={sessionsForChecklist}
          dietaryStatus={speakerData.dietary}
          telegramGroups={sessionTelegramGroups}
        />

        <Separator />
        <TicketsSection
          speakerTicket={speakerData.lumaTicketSpeaker}
          plusOneTicket={speakerData.lumaTicketPlusOne}
          invitationCode={speakerData.invitationCode}
        />

        {/* <Separator />
        <PostEventSection /> */}
      </main>
    </div>
  );
}
