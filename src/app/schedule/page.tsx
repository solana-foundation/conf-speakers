import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SessionsTable from "@/components/sessions-table";
import { generateHmac } from "@/lib/sign.server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSessionsFilters } from "@/lib/airtable/utils";
import { Speaker } from "@/lib/airtable/types";

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

  if (key !== generateHmac()) {
    notFound();
  }

  const speakers = await getCachedSpeakers();
  const speakersData = speakers.map((item) => SpeakerFieldsSchema.parse(item));
  const sessions = await getCachedSessions();
  const sessionsData = sessions.map((session) => {
    const sessionData = SessionFieldsSchema.parse(session);
    return {
      ...SessionFieldsSchema.parse(session),
      subscribeUrl: `/api/ics/session/${session.id}?key=${key}`,
      speakers: sessionData.speakerIds
        ?.map((id) => speakersData.find((item) => item.id === id))
        .filter(Boolean) as Speaker[],
    };
  });
  const filters = getSessionsFilters(sessionsData);

  return (
    <div className="min-h-screen p-8 font-sans sm:p-20">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
          <h1 className="text-2xl font-semibold">Breakpoint 2025 Schedule</h1>
          <Button asChild>
            <a href={`/api/ics/event?key=${key}`} target="_blank" rel="noopener noreferrer">
              Add all sessions to calendar
            </a>
          </Button>
        </div>

        <Separator />

        <SessionsTable items={sessionsData} filters={filters} />
      </main>
    </div>
  );
}
