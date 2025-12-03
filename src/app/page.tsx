import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import { generateKey } from "@/lib/sign.server";
import { getSessionsFilters } from "@/lib/airtable/utils";
import { Speaker } from "@/lib/airtable/types";
import { getSessionCalendarUrl, getSessionsCalendarUrl } from "@/lib/ics/utils";
import { GlobalStateProvider } from "@/lib/state";
import ScheduleSessionsTable from "@/components/schedule-sessions-table";
import ScheduleSubscribeButton from "@/components/schedule-subscribe-button";

export const metadata: Metadata = {
  title: "Breakpoint 2025 Schedule",
  description: "The schedule for the Breakpoint conference",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 600; // 10 minutes

export default async function SchedulePage() {
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
            {sessionsData.length > 0 && <ScheduleSubscribeButton href={getSessionsCalendarUrl(calendarKey)} />}
          </div>

          <Separator />

          {sessionsData.length === 0 ? (
            <div className="flex flex-col gap-6 py-16">
              <div className="text-center">
                <h2 className="mb-3 text-2xl">Sessions Coming Soon</h2>
                <p className="text-muted-foreground text-p1">Sessions are being finalized and will appear here soon.</p>
              </div>
              <div className="border-stroke-primary bg-background-secondary mx-auto space-y-4 rounded-lg border p-6 text-left">
                <h3>What you&apos;ll be able to do</h3>
                <ul className="text-p1 text-muted-foreground space-y-2">
                  <li>Browse the complete conference schedule</li>
                  <li>Filter sessions by name, date, and stage</li>
                  <li>View detailed session information including speakers, descriptions, and formats</li>
                  <li>Select sessions to create a personalized schedule</li>
                  <li>Subscribe to calendar updates for selected sessions</li>
                </ul>
                <div className="pt-2">
                  <h3 className="mb-2">Available information</h3>
                  <ul className="text-p1 text-muted-foreground space-y-2">
                    <li>Session titles and descriptions</li>
                    <li>Speaker names and details</li>
                    <li>Date, time, and duration</li>
                    <li>Stage location (Absolute Cinema or Lock In)</li>
                    <li>Session format</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ScheduleSessionsTable items={sessionsData} filters={filters} selectable />
          )}
        </main>
      </div>
    </GlobalStateProvider>
  );
}
