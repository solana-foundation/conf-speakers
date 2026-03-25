import { Metadata } from "next/types";
import { getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { parseSessionRecord, parseSpeakerRecord } from "@/lib/airtable/schemas";
import { generateKey } from "@/lib/sign.server";
import { getSessionsFilters, getWebPublishingStatus } from "@/lib/airtable/utils";
import { Speaker } from "@/lib/airtable/types";
import { getSessionCalendarUrl, getSessionsCalendarUrl } from "@/lib/ics/utils";
import { GlobalStateProvider } from "@/lib/state";
import ScheduleSessionsTable from "@/components/schedule-sessions-table";
import ScheduleSubscribeButton from "@/components/schedule-subscribe-button";
import { EVENT_DESCRIPTION, EVENT_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${EVENT_NAME} Schedule`,
  description: EVENT_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 600; // 10 minutes

export default async function SchedulePage() {
  const calendarKey = generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), "ics");
  let filteredSessionsData: Array<ReturnType<typeof parseSessionRecord> & { subscribeUrl: string; speakers: Speaker[] }> = [];

  try {
    const speakers = await getCachedSpeakers();
    const speakersData = speakers.map(parseSpeakerRecord);
    const sessions = await getCachedSessions();
    const sessionsData = sessions.map((session) => {
      const sessionData = parseSessionRecord(session);
      return {
        ...sessionData,
        subscribeUrl: getSessionCalendarUrl(session.id, calendarKey),
        speakers: sessionData.speakerIds
          ?.map((id) => speakersData.find((item) => item.id === id))
          .filter(Boolean) as Speaker[],
      };
    });
    filteredSessionsData = sessionsData.filter((session) => {
      const publishingStatus = getWebPublishingStatus(session.webPublishingStatus);
      return publishingStatus?.hasDoNotPublish === false;
    });
  } catch (error) {
    console.error("Failed to load schedule data:", error);
  }

  const filters = getSessionsFilters(filteredSessionsData);

  return (
    <GlobalStateProvider>
      <div className="min-h-screen bg-black p-8 font-sans">
        <main className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
            <h1 className="gradient-text font-space-grotesk text-h1 font-light">{EVENT_NAME} Schedule</h1>
            {filteredSessionsData.length > 0 && <ScheduleSubscribeButton href={getSessionsCalendarUrl(calendarKey)} />}
          </div>

          <div className="section-divider" />

          {filteredSessionsData.length === 0 ? (
            <div className="flex flex-col gap-8 py-20">
              <div className="text-center">
                <h2 className="font-space-grotesk mb-4 text-3xl font-light text-white">Sessions Coming Soon</h2>
                <p className="text-white/50">Sessions are being finalized and will appear here soon.</p>
              </div>
              <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-8 text-left backdrop-blur-sm">
                <h3 className="text-white">What you&apos;ll be able to do</h3>
                <ul className="text-p1 space-y-2 text-white/50">
                  <li>Browse the complete conference schedule</li>
                  <li>Filter sessions by name, date, and stage</li>
                  <li>View detailed session information including speakers, descriptions, and formats</li>
                  <li>Select sessions to create a personalized schedule</li>
                  <li>Subscribe to calendar updates for selected sessions</li>
                </ul>
                <div className="pt-2">
                  <h3 className="mb-2 text-white">Available information</h3>
                  <ul className="text-p1 space-y-2 text-white/50">
                    <li>Session titles and descriptions</li>
                    <li>Speaker names and details</li>
                    <li>Date, time, and duration</li>
                    <li>Stage or location details</li>
                    <li>Session format</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ScheduleSessionsTable items={filteredSessionsData} filters={filters} selectable />
          )}
        </main>
      </div>
    </GlobalStateProvider>
  );
}
