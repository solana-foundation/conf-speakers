import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import { generateKey, isKeyValid } from "@/lib/sign.server";
import { redirect } from "next/navigation";
import { getSessionsFilters } from "@/lib/airtable/utils";
import { Speaker } from "@/lib/airtable/types";
import { getSessionCalendarUrl, getSessionsCalendarUrl } from "@/lib/ics/utils";
import { GlobalStateProvider } from "@/lib/state";
import ScheduleSessionsTable from "@/components/schedule-sessions-table";
import ScheduleSubscribeButton from "@/components/schedule-subscribe-button";

export const metadata: Metadata = {
  title: "Breakpoint 2025 Schedule",
  description: "The schedule of the Breakpoint conference",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 600; // 10 minutes

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ key: string }> }) {
  const { key } = await searchParams;

  if (!isKeyValid(key ?? null)) {
    redirect("/?expired=1");
  }

  const calendarKey = generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), "ics");

  const speakers = await getCachedSpeakers();
  const speakersData = speakers.map((item) => SpeakerFieldsSchema.parse(item));
  const sessions = await getCachedSessions();
  const sessionsData = sessions.map((session) => {
    const sessionData = SessionFieldsSchema.parse(session);
    return {
      ...SessionFieldsSchema.parse(session),
      subscribeUrl: getSessionCalendarUrl(session.id, calendarKey),
      speakers: sessionData.speakerIds
        ?.map((id) => speakersData.find((item) => item.id === id))
        .filter(Boolean) as Speaker[],
    };
  });
  const filters = getSessionsFilters(sessionsData);

  return (
    <GlobalStateProvider>
      <div className="min-h-screen p-8 font-sans">
        <main className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
            <h1 className="font-fh-lecturis text-3xl">Breakpoint 2025 Schedule</h1>
            <ScheduleSubscribeButton href={getSessionsCalendarUrl(calendarKey)} />
          </div>

          <Separator />

          <ScheduleSessionsTable items={sessionsData} filters={filters} selectable />
        </main>
      </div>
    </GlobalStateProvider>
  );
}
