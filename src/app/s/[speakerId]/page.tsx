import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { generateHmac } from "@/lib/sign.server";
import { notFound } from "next/navigation";
import { fetchSessions, fetchSpeaker } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsTable from "@/components/sessions-table";

export const generateMetadata = async ({ params }: { params: Promise<{ speakerId: string }> }): Promise<Metadata> => {
  const { speakerId } = await params;

  return {
    title: `Breakpoint 2025 Speaker ${speakerId}`,
    description: `Detailed information about the speaker ${speakerId} of the Breakpoint conference`,
  };
};

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

  const speakers = await fetchSpeaker(speakerId);
  const speakersData = SpeakerFieldsSchema.parse(speakers.fields);
  const sessions = await fetchSessions({ speakerName: speakersData._name });
  const sessionsData = sessions.map((session) => ({
    ...SessionFieldsSchema.parse(session.fields),
    subscribeUrl: `/api/ics/session/${session.id}?key=${key}`,
  }));

  return (
    <div className="min-h-screen p-8 font-sans sm:p-20">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <SpeakerCard {...speakersData} subscribeUrl={`/api/ics/speaker/${speakerId}?key=${key}`} />

        <Separator />

        <SessionsTable items={sessionsData} />
      </main>
    </div>
  );
}
