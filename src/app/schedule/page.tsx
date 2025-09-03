import { Separator } from "@/components/ui/separator";
import { Metadata } from "next/types";
import { fetchSessions } from "@/lib/airtable/fetch";
import { SessionFieldsSchema } from "@/lib/airtable/schemas";
import SessionsTable from "@/components/sessions-table";
import { generateHmac } from "@/lib/sign.server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Breakpoint 2025 Schedule",
  description: "The schedule of the Breakpoint conference",
};

export default async function Schedule({ searchParams }: { searchParams: Promise<{ key: string }> }) {
  const { key } = await searchParams;

  if (key !== generateHmac()) {
    notFound();
  }

  const sessions = await fetchSessions();
  const sessionsData = sessions.map((session) => ({
    ...SessionFieldsSchema.parse(session.fields),
    subscribeUrl: `/api/ics/session/${session.id}?key=${key}`,
  }));

  return (
    <div className="min-h-screen p-8 font-sans sm:p-20">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
          <h1 className="text-2xl font-semibold">Breakpoint 2025 Schedule</h1>
          <Button asChild>
            <a href={`/api/ics/event?key=${key}`} target="_blank" rel="noopener noreferrer">
              Subscribe to all sessions
            </a>
          </Button>
        </div>

        <Separator />

        <SessionsTable items={sessionsData} />
      </main>
    </div>
  );
}
