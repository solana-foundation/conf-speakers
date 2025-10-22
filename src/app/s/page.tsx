import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { generateKey, isKeyValid, getTokenPayload } from "@/lib/sign.server";
import { notFound, redirect } from "next/navigation";
import { getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsTable from "@/components/sessions-table";
import { getSessionsFilters } from "@/lib/airtable/utils";
import { Speaker } from "@/lib/airtable/types";
// import { Gallery } from "@/components/gallery";
import LogisticsDialogButton from "@/components/speaker-portal/LogisticsDialogButton";
import ActionsDialogButton from "@/components/speaker-portal/ActionsDialogButton";
import TicketsSection from "@/components/speaker-portal/TicketsSection";
import CommsCalendarSection from "@/components/speaker-portal/CommsCalendarSection";
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

  const speakers = await getCachedSpeakers();
  const speakersData = speakers.map((item) => SpeakerFieldsSchema.parse(item));
  const speakerData = speakersData.find((item) => item.id === speakerId);

  if (!speakerData) {
    notFound();
  }

  const sessions = await getCachedSessions({ speakerName: speakerData._name });
  const sessionsData = sessions.map((session) => {
    const sessionData = SessionFieldsSchema.parse(session);
    return {
      ...sessionData,
      subscribeUrl: `/api/ics/session/${session.id}?key=${calendarKey}`,
      speakers: sessionData.speakerIds
        ?.map((id) => speakersData.find((item) => item.id === id))
        .filter(Boolean) as Speaker[],
    };
  });
  const filters = getSessionsFilters(sessionsData);

  return (
    <div className="min-h-screen p-8 font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <SpeakerCard {...speakerData} subscribeUrl={`/api/ics/speaker/${speakerId}?key=${calendarKey}`} />

        <Separator />

        <h2 className="text-lg font-semibold">Schedule</h2>

        <SessionsTable items={sessionsData} filters={filters} />

        <div className="flex gap-3">
          <LogisticsDialogButton />
          <ActionsDialogButton />
        </div>

        <Separator />
        <TicketsSection />

        <Separator />
        <CommsCalendarSection />

        <Separator />
        <PostEventSection />
      </main>
    </div>
  );
}
