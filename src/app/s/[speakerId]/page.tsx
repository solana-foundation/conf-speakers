import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { generateHmac } from "@/lib/sign.server";
import { notFound } from "next/navigation";
import { getCachedSessions, getCachedSpeaker } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsTable from "@/components/sessions-table";
import { getSessionsFilters } from "@/lib/airtable/utils";

export const generateMetadata = async ({ params }: { params: Promise<{ speakerId: string }> }): Promise<Metadata> => {
  const { speakerId } = await params;

  return {
    title: `Breakpoint 2025 Speaker ${speakerId}`,
    description: `Detailed information about the speaker ${speakerId} of the Breakpoint conference`,
    robots: {
      index: false,
      follow: false,
    },
  };
};

export const revalidate = 60 * 10; // 10 minutes

export default async function Speaker({
  params,
  searchParams,
}: {
  params: Promise<{ speakerId: string }>;
  searchParams: Promise<{ key: string }>;
}) {
  const { key } = await searchParams;

  if (key !== generateHmac()) {
    notFound();
  }

  const { speakerId } = await params;

  const speakers = await getCachedSpeaker(speakerId);
  const speakersData = SpeakerFieldsSchema.parse(speakers.fields);
  const sessions = await getCachedSessions({ speakerName: speakersData._name });
  const sessionsData = sessions.map((session) => ({
    ...SessionFieldsSchema.parse(session.fields),
    subscribeUrl: `/api/ics/session/${session.id}?key=${key}`,
  }));
  const filters = getSessionsFilters(sessionsData);

  return (
    <div className="min-h-screen p-8 font-sans sm:p-20">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <SpeakerCard {...speakersData} subscribeUrl={`/api/ics/speaker/${speakerId}?key=${key}`} />

        <Separator />

        <SessionsTable items={sessionsData} filters={filters} />
      </main>
    </div>
  );
}
