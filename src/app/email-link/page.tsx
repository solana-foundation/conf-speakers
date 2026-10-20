"use client";

import { BreakpointHero, EventMeta } from "@/components/breakpoint-hero";
import { EmailForm } from "@/components/email-form";
import { SectionHeading } from "@/components/section-heading";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black pb-24">
      <BreakpointHero title="Speaker portal" id="speaker-access-title" />
      <div className="mx-auto max-w-[1728px] px-4 lg:px-8">
        <EventMeta />
        <section className="grid gap-10 py-16 lg:grid-cols-2 lg:gap-24 lg:py-24" aria-labelledby="access-link-title">
          <SectionHeading eyebrow="Private speaker access" title="Get your access link" id="access-link-title" />
          <div className="w-full max-w-[32rem] space-y-6">
            <p className="max-w-[28rem] text-base leading-[1.45] text-[#a2a2a2] lg:text-lg">
              Enter the email address the speaker team has for you. We&apos;ll send a secure link to your portal.
            </p>
            <Suspense fallback={null}>
              <ExpiredAlert />
            </Suspense>
            <EmailForm />
          </div>
        </section>
      </div>
    </main>
  );
}

function ExpiredAlert() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";

  return expired ? (
    <Alert className="border-[#aa67fb] bg-[#1e1e1e]">
      <AlertTitle>Link expired</AlertTitle>
      <AlertDescription>Your access link has expired. Enter your email to get a new one.</AlertDescription>
    </Alert>
  ) : null;
}
