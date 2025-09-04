import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { generateHmac } from "@/lib/sign.server";
import { notFound } from "next/navigation";
import { getCachedSessions, getCachedSpeakers } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import SpeakerCard from "@/components/speaker-card";
import SessionsTable from "@/components/sessions-table";
import { getSessionsFilters } from "@/lib/airtable/utils";
import { Speaker } from "@/lib/airtable/types";
import { Gallery } from "@/components/gallery";

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

export const revalidate = 600; // 10 minutes

export default async function SpeakerPage({
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
        <SpeakerCard {...speakerData} subscribeUrl={`/api/ics/speaker/${speakerId}?key=${key}`} />

        <Separator />

        <h2 className="text-lg font-semibold">Schedule</h2>

        <SessionsTable items={sessionsData} filters={filters} />

        <h2 className="text-lg font-semibold">Highlights</h2>

        <Gallery
          images={[
            { src: "/placeholder1.png" },
            { src: "/placeholder2.png" },
            { src: "/placeholder1.png" },
            { src: "/placeholder1.png" },
            { src: "/placeholder2.png" },
            { src: "/placeholder2.png" },
            { src: "/placeholder1.png" },
            { src: "/placeholder2.png" },
          ]}
        />
      </main>
    </div>
  );
}
