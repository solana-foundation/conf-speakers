import { APP_CONFIG } from "@/lib/app-config";
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
import { BreakpointHero, EventMeta } from "@/components/breakpoint-hero";
import { SectionHeading } from "@/components/section-heading";
import { EVENT_DESCRIPTION, EVENT_NAME, HOME_SCHEDULE_ENABLED, SITE_NAME } from "@/lib/site";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: HOME_SCHEDULE_ENABLED ? `${EVENT_NAME} Schedule` : SITE_NAME,
  description: EVENT_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 600; // 10 minutes

export default async function SchedulePage() {
  if (!HOME_SCHEDULE_ENABLED) redirect("/email-link");

  const calendarKey = generateKey(Date.now() + APP_CONFIG.NEXT_PUBLIC_KEY_EXP, "ics");
  let filteredSessionsData: Array<
    ReturnType<typeof parseSessionRecord> & { subscribeUrl: string; speakers: Speaker[] }
  > = [];

  if (HOME_SCHEDULE_ENABLED) {
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
  }

  const filters = getSessionsFilters(filteredSessionsData);

  return (
    <GlobalStateProvider>
      <div className="min-h-screen bg-black font-sans">
        <BreakpointHero title="Event schedule" id="schedule-heading" />
        <main className="mx-auto flex max-w-[1728px] flex-col gap-12 px-4 pb-24 lg:gap-16 lg:px-8">
          <EventMeta />
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow={EVENT_NAME} title="Programme" id="programme-heading" />
            {filteredSessionsData.length > 0 && <ScheduleSubscribeButton href={getSessionsCalendarUrl(calendarKey)} />}
          </div>

          {filteredSessionsData.length === 0 ? (
            <section
              className="grid gap-8 border border-[#353535] bg-[#1e1e1e] p-6 sm:p-10 lg:grid-cols-2"
              aria-label="Schedule status"
            >
              <div>
                <p className="breakpoint-eyebrow mb-4 text-[#a2a2a2]">Schedule update</p>
                <h2 className="text-3xl leading-tight text-white sm:text-4xl">Sessions coming soon</h2>
                <p className="mt-4 text-base text-[#a2a2a2]">Sessions are being finalized and will appear here soon.</p>
              </div>
              <div className="space-y-6 border-t border-[#353535] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                <h3 className="breakpoint-eyebrow text-white">What you&apos;ll be able to do</h3>
                <ul className="space-y-2 text-base text-[#a2a2a2]">
                  <li>Browse the complete conference schedule</li>
                  <li>Filter sessions by name, date, and stage</li>
                  <li>View detailed session information including speakers, descriptions, and formats</li>
                  <li>Select sessions to create a personalized schedule</li>
                  <li>Subscribe to calendar updates for selected sessions</li>
                </ul>
                <div className="border-t border-[#353535] pt-6">
                  <h3 className="breakpoint-eyebrow mb-4 text-white">Available information</h3>
                  <ul className="space-y-2 text-base text-[#a2a2a2]">
                    <li>Session titles and descriptions</li>
                    <li>Speaker names and details</li>
                    <li>Date, time, and duration</li>
                    <li>Stage or location details</li>
                    <li>Session format</li>
                  </ul>
                </div>
              </div>
            </section>
          ) : (
            <ScheduleSessionsTable items={filteredSessionsData} filters={filters} selectable />
          )}
        </main>
      </div>
    </GlobalStateProvider>
  );
}
