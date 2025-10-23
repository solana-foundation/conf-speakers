import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { generateKey, isKeyValid, getTokenPayload } from "@/lib/sign.server";
import { notFound, redirect } from "next/navigation";
import { getCachedFormats, getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsCards from "@/components/sessions-cards";
import { Speaker } from "@/lib/airtable/types";
import { getSessionCalendarHttpUrl, getSessionsCalendarUrl } from "@/lib/ics/utils";
// import { Gallery } from "@/components/gallery";
import LogisticsDialogButton from "@/components/speaker-portal/LogisticsDialogButton";
import ActionsChecklist from "@/components/speaker-portal/ActionsChecklist";
import TicketsSection from "@/components/speaker-portal/TicketsSection";
import PostEventSection from "@/components/speaker-portal/PostEventSection";

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
  const sessionsData = sessions.map((session) => {
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

  // Calculate speaker status based on deck upload and dietary form completion
  const hasSlideDeck = !!speakerData.slideDeckUrl;
  const hasDietaryForm = true;
  const speakerStatus = hasSlideDeck && hasDietaryForm ? "all-set" : "awaiting-deck";

  // Extract telegram groups from sessions
  const sessionTelegramGroups = sessionsData
    .filter((session) => session.telegramGroup)
    .map((session) => ({
      sessionName: session.name,
      telegramGroup: session.telegramGroup!,
    }));

  // Add test data for debugging
  const telegramGroups =
    sessionsData.length > 0
      ? [{ sessionName: sessionsData[0]?.name, telegramGroup: "#" }, ...sessionTelegramGroups]
      : sessionTelegramGroups;

  return (
    <div className="min-h-screen p-8 font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <SpeakerCard {...speakerData} status={speakerStatus} />

        <Separator />

        <h2 className="text-h5 uppercase">Your Schedule</h2>

        <SessionsCards items={sessionsData} calendarUrl={speakerCalendarUrl} />

        <div className="flex gap-3">
          <LogisticsDialogButton stage={sessionsData[0]?.stage || "Main Stage"} />
        </div>

        <Separator />

        <ActionsChecklist hasSlideDeck={hasSlideDeck} hasDietaryForm={hasDietaryForm} telegramGroups={telegramGroups} />

        <Separator />
        <TicketsSection
          speakerTicket={speakerData.lumaTicketSpeaker}
          plusOneTicket={speakerData.lumaTicketPlusOne}
          invitationCode={speakerData.invitationCode}
        />

        <Separator />
        <PostEventSection />
      </main>
    </div>
  );
}
